from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    agreedToContact: bool


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    agreedToContact: bool
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    message: str


class PropertyCreate(BaseModel):
    title: str
    address: str
    city: str = "Palm Bay, FL"
    price: str
    acres: str
    propertyType: str = "Residential"
    tags: List[str] = []
    description: str = ""
    featured: bool = False
    image: str = ""
    crexiUrl: str = ""
    inventoryId: str = ""
    county: str = ""
    owner: str = ""
    unit: str = ""
    block: str = ""
    lot: str = ""
    streetNumber: str = ""
    streetName: str = ""
    taxAccount: str = ""
    width: str = ""
    depth: str = ""
    water: str = ""
    sewer: str = ""
    zoning: str = ""
    flu: str = ""
    together: str = ""
    pieShape: bool = False
    status: str = "available"
    sold: bool = False
    cashOnly: bool = False


class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    address: str
    city: str = "Palm Bay, FL"
    price: str
    acres: str
    propertyType: str = "Residential"
    tags: List[str] = []
    description: str = ""
    featured: bool = False
    image: str = ""
    crexiUrl: str = ""
    inventoryId: str = ""
    county: str = ""
    owner: str = ""
    unit: str = ""
    block: str = ""
    lot: str = ""
    streetNumber: str = ""
    streetName: str = ""
    taxAccount: str = ""
    width: str = ""
    depth: str = ""
    water: str = ""
    sewer: str = ""
    zoning: str = ""
    flu: str = ""
    together: str = ""
    pieShape: bool = False
    status: str = "available"
    sold: bool = False
    cashOnly: bool = False
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatResponse(BaseModel):
    response: str
    session_id: str
