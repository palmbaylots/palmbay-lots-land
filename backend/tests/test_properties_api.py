"""
Backend API Tests for Palm Bay Real Estate Properties
Tests the /api/properties endpoints for inventory and curated listings
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://palmbay-realestate.preview.emergentagent.com')

class TestPropertiesAPI:
    """Test /api/properties endpoints"""
    
    def test_get_all_properties_returns_603(self):
        """GET /api/properties should return 603 properties (582 inventory + 21 curated)"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 603, f"Expected 603 properties, got {len(data)}"
    
    def test_inventory_lots_count(self):
        """Should have 582 inventory lots (properties with inventoryId)"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        inventory_lots = [p for p in data if p.get('inventoryId')]
        assert len(inventory_lots) == 582, f"Expected 582 inventory lots, got {len(inventory_lots)}"
    
    def test_curated_listings_count(self):
        """Should have 5 curated listings (properties without inventoryId)"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        curated = [p for p in data if not p.get('inventoryId')]
        assert len(curated) == 21, f"Expected 21 curated listings, got {len(curated)}"
    
    def test_curated_listings_categories(self):
        """Curated listings should have correct category counts: Commercial(2), Multi-Family(1), Assemblage(1), Residential(1)"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        curated = [p for p in data if not p.get('inventoryId')]
        
        # Count by property type
        type_counts = {}
        for p in curated:
            ptype = p.get('propertyType', 'Unknown')
            type_counts[ptype] = type_counts.get(ptype, 0) + 1
        
        assert type_counts.get('Commercial', 0) == 2, f"Expected 2 Commercial, got {type_counts.get('Commercial', 0)}"
        assert type_counts.get('Multi-Family', 0) == 1, f"Expected 1 Multi-Family, got {type_counts.get('Multi-Family', 0)}"
        assert type_counts.get('Assemblage', 0) == 1, f"Expected 1 Assemblage, got {type_counts.get('Assemblage', 0)}"
        assert type_counts.get('Residential', 0) == 1, f"Expected 1 Residential, got {type_counts.get('Residential', 0)}"
    
    def test_featured_property_exists(self):
        """328 Malabar Rd should be featured"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        featured = [p for p in data if p.get('featured') == True]
        
        assert len(featured) >= 1, "Expected at least 1 featured property"
        
        # Check that 328 Malabar Rd is featured
        malabar = [p for p in featured if '328 Malabar' in p.get('title', '')]
        assert len(malabar) == 1, "328 Malabar Rd should be featured"
    
    def test_inventory_lot_has_required_fields(self):
        """Inventory lots should have inventoryId, unit, block, lot, streetNumber, streetName, taxAccount fields"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        inventory_lots = [p for p in data if p.get('inventoryId')]
        
        # Check first inventory lot has required fields
        if inventory_lots:
            lot = inventory_lots[0]
            required_fields = ['inventoryId', 'unit', 'block', 'lot', 'streetNumber', 'streetName', 'taxAccount', 'county', 'owner']
            for field in required_fields:
                assert field in lot, f"Inventory lot missing field: {field}"
    
    def test_inventory_lot_data_structure(self):
        """Verify inventory lot data structure is correct"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        
        data = response.json()
        inventory_lots = [p for p in data if p.get('inventoryId')]
        
        # Sample a few lots to verify structure
        sample_lot = inventory_lots[0] if inventory_lots else None
        assert sample_lot is not None, "No inventory lots found"
        
        # Verify it has an inventoryId
        assert sample_lot.get('inventoryId'), "Inventory lot should have inventoryId"
        
        # Verify it has city
        assert sample_lot.get('city'), "Inventory lot should have city"
        
        # Verify it has acres
        assert sample_lot.get('acres'), "Inventory lot should have acres"


class TestFeaturedPropertiesAPI:
    """Test /api/properties/featured endpoint"""
    
    def test_get_featured_properties(self):
        """GET /api/properties/featured should return featured properties"""
        response = requests.get(f"{BASE_URL}/api/properties/featured")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        # All returned properties should be featured
        for prop in data:
            assert prop.get('featured') == True, f"Property {prop.get('title')} should be featured"


class TestLeadsAPI:
    """Test /api/leads endpoints"""
    
    def test_get_leads(self):
        """GET /api/leads should return list of leads"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_lead_requires_consent(self):
        """POST /api/leads should require agreedToContact=true"""
        response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": "TEST_User",
            "email": "test@example.com",
            "phone": "1234567890",
            "agreedToContact": False
        })
        assert response.status_code == 400, "Should reject lead without consent"


class TestHealthEndpoints:
    """Test basic health endpoints"""
    
    def test_root_endpoint(self):
        """GET /api/ should return hello world"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
    
    def test_visitor_count(self):
        """GET /api/visitor-count should return count"""
        response = requests.get(f"{BASE_URL}/api/visitor-count")
        assert response.status_code == 200
        
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
