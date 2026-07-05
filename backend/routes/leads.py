from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timezone
import os
import logging
import uuid
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client

from database import db
from models import Lead, LeadCreate, ContactMessage, StatusCheck, StatusCheckCreate

logger = logging.getLogger(__name__)
router = APIRouter()


# Email sending function
async def send_email(to_email: str, subject: str, body: str):
    """Send email using SMTP"""
    try:
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', 465))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')

        message = MIMEMultipart()
        message['From'] = smtp_user
        message['To'] = to_email
        message['Subject'] = subject
        message.attach(MIMEText(body, 'html'))

        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_password,
            use_tls=True
        )
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False


# SMS sending function
def send_sms(to_phone: str, message: str):
    """Send SMS using Twilio Messaging Service"""
    try:
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        messaging_service_sid = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')

        twilio_client = Client(account_sid, auth_token)

        msg = twilio_client.messages.create(
            body=message,
            messaging_service_sid=messaging_service_sid,
            to=to_phone
        )

        logger.info(f"SMS sent successfully. SID: {msg.sid}")
        return True
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}")
        return False


# Visitor counter
@router.get("/visitor-count")
async def get_visitor_count():
    stats = await db.site_stats.find_one({"type": "visitor_count"})
    if stats:
        return {"count": stats.get("count", 0)}
    return {"count": 0}


@router.post("/track-visit")
async def track_visit():
    result = await db.site_stats.find_one_and_update(
        {"type": "visitor_count"},
        {"$inc": {"count": 1}},
        upsert=True,
        return_document=True
    )
    return {"count": result.get("count", 1)}


# Status checks
@router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Leads CRUD
@router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    if not input.agreedToContact:
        raise HTTPException(status_code=400, detail="Consent required")

    lead_dict = input.model_dump()
    lead_obj = Lead(**lead_dict)
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.leads.insert_one(doc)

    # Notify Vahid of the new lead — never let a notification failure block saving the lead.
    try:
        notify_email = os.environ.get('CONTACT_EMAIL', 'palmbaylotsland@gmail.com')
        notify_phone = os.environ.get('TWILIO_TO_PHONE')

        email_body = f"""
        <html><body>
            <h2>New Lead from Website Popup</h2>
            <p><strong>Name:</strong> {lead_obj.name}</p>
            <p><strong>Email:</strong> {lead_obj.email}</p>
            <p><strong>Phone:</strong> {lead_obj.phone}</p>
            <hr>
            <p style="color:#666;font-size:12px;">Sent from Palm Bay Real Estate Website · {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </body></html>
        """
        await send_email(to_email=notify_email, subject=f"New Lead: {lead_obj.name}", body=email_body)

        if notify_phone:
            send_sms(
                to_phone=notify_phone,
                message=f"New lead from your website:\nName: {lead_obj.name}\nPhone: {lead_obj.phone}\nEmail: {lead_obj.email}",
            )
    except Exception as e:
        logger.error(f"Lead saved but notification failed: {str(e)}")

    return lead_obj


@router.get("/leads", response_model=List[Lead])
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead['timestamp'], str):
            lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
    return leads


@router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully", "id": lead_id}


# Contact form
@router.post("/contact")
async def submit_contact_form(contact: ContactMessage):
    """Handle contact form submissions and send email + SMS"""
    try:
        contact_email = os.environ.get('CONTACT_EMAIL', 'palmbaylotsland@gmail.com')
        contact_phone = os.environ.get('TWILIO_TO_PHONE')

        # Prepare email
        email_body = f"""
        <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Phone:</strong> {contact.phone}</p>
            <p><strong>Message:</strong></p>
            <p>{contact.message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                Sent from Palm Bay Real Estate Website Contact Form<br>
                Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            </p>
        </body>
        </html>
        """

        sms_message = f"New contact form submission from {contact.name}\nPhone: {contact.phone}\nEmail: {contact.email}\nMessage: {contact.message[:100]}..."

        email_sent = await send_email(
            to_email=contact_email,
            subject=f"New Contact: {contact.name}",
            body=email_body
        )

        sms_sent = False
        if contact_phone:
            sms_sent = send_sms(
                to_phone=contact_phone,
                message=sms_message
            )

        # Save to contacts collection
        contact_dict = contact.model_dump()
        contact_dict['id'] = str(uuid.uuid4())
        contact_dict['timestamp'] = datetime.now(timezone.utc).isoformat()
        contact_dict['email_sent'] = email_sent
        contact_dict['sms_sent'] = sms_sent
        await db.contacts.insert_one(contact_dict)

        # Also save to leads collection
        lead_dict = {
            'id': str(uuid.uuid4()),
            'name': contact.name,
            'email': contact.email,
            'phone': contact.phone,
            'source': 'contact_form',
            'agreedToContact': True,
            'agreedToMarketing': True,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        await db.leads.insert_one(lead_dict)

        if email_sent or sms_sent:
            return {
                "success": True,
                "message": "Thank you! Your message has been sent successfully.",
                "email_sent": email_sent,
                "sms_sent": sms_sent
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send notifications")

    except Exception as e:
        logger.error(f"Error in contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred. Please call directly at 321-333-7230.")
