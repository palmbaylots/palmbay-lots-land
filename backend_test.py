#!/usr/bin/env python3
"""
Test script for verifying blog API key rotation.
Tests:
1. NEW key should be ACCEPTED
2. OLD key should be REJECTED
3. Admin endpoint should return the NEW key
"""
import requests
import json
import sys

# Configuration
BASE_URL = "https://frontend-release-1.preview.emergentagent.com/api"
NEW_KEY = "MDC1Uq6q7ebEdA4lTqkVTxRuq1e0KU240BN6EAOo8Os"
OLD_KEY = "M-quMx2zP7boDfUQ5jahRdSPJYciiAv4a2-Kt5FC60I"
ADMIN_PASSWORD = "PalmBay2024!"

def test_new_key_accepted():
    """Test that the NEW key is accepted for blog creation."""
    print("\n" + "="*70)
    print("TEST 1: NEW KEY ACCEPTANCE")
    print("="*70)
    
    url = f"{BASE_URL}/blogs"
    headers = {
        "Authorization": f"Bearer {NEW_KEY}",
        "Content-Type": "application/json"
    }
    
    # Minimal payload to test auth (may fail validation, but auth should pass)
    payload = {
        "slug": "test-blog-key-rotation",
        "title": "Test Blog for Key Rotation",
        "content": "This is a test blog post to verify API key rotation."
    }
    
    print(f"Endpoint: POST {url}")
    print(f"Authorization: Bearer {NEW_KEY[:20]}...")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        # Auth passes if we don't get 401/403
        if response.status_code in [401, 403]:
            print("❌ FAILED: NEW key was REJECTED (got 401/403)")
            return False
        else:
            print("✅ PASSED: NEW key was ACCEPTED (auth passed, no 401/403)")
            return True
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False


def test_old_key_rejected():
    """Test that the OLD key is now rejected."""
    print("\n" + "="*70)
    print("TEST 2: OLD KEY REJECTION")
    print("="*70)
    
    url = f"{BASE_URL}/blogs"
    headers = {
        "Authorization": f"Bearer {OLD_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "slug": "test-blog-old-key",
        "title": "Test Blog with Old Key",
        "content": "This should be rejected."
    }
    
    print(f"Endpoint: POST {url}")
    print(f"Authorization: Bearer {OLD_KEY[:20]}...")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        # Old key should be rejected with 401 or 403
        if response.status_code in [401, 403]:
            print("✅ PASSED: OLD key was REJECTED (got 401/403 as expected)")
            return True
        else:
            print("❌ FAILED: OLD key was ACCEPTED (should have been rejected)")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False


def test_admin_endpoint_returns_new_key():
    """Test that the admin endpoint returns the NEW key."""
    print("\n" + "="*70)
    print("TEST 3: ADMIN ENDPOINT RETURNS NEW KEY")
    print("="*70)
    
    url = f"{BASE_URL}/admin/blog-key"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "password": ADMIN_PASSWORD
    }
    
    print(f"Endpoint: POST {url}")
    print(f"Password: {ADMIN_PASSWORD}")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            returned_key = data.get("key", "")
            print(f"\nReturned key: {returned_key}")
            print(f"Expected key: {NEW_KEY}")
            
            if returned_key == NEW_KEY:
                print("✅ PASSED: Admin endpoint returns the NEW key")
                return True
            else:
                print("❌ FAILED: Admin endpoint returned wrong key")
                return False
        else:
            print(f"❌ FAILED: Admin endpoint returned status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False


def main():
    """Run all tests and report results."""
    print("\n" + "="*70)
    print("BLOG API KEY ROTATION TEST SUITE")
    print("="*70)
    print(f"Base URL: {BASE_URL}")
    print(f"NEW Key: {NEW_KEY[:20]}...")
    print(f"OLD Key: {OLD_KEY[:20]}...")
    
    results = []
    
    # Run all tests
    results.append(("NEW key accepted", test_new_key_accepted()))
    results.append(("OLD key rejected", test_old_key_rejected()))
    results.append(("Admin endpoint returns NEW key", test_admin_endpoint_returns_new_key()))
    
    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED - API key rotation verified successfully!")
        sys.exit(0)
    else:
        print("\n⚠️  SOME TESTS FAILED - API key rotation has issues")
        sys.exit(1)


if __name__ == "__main__":
    main()
