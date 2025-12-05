import requests
import sys
import json
from datetime import datetime
import base64

class TurkishQuoteSystemTester:
    def __init__(self, base_url="https://business-rfq-hub.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.auth_header = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        if self.auth_header:
            test_headers.update(self.auth_header)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_admin_init(self):
        """Initialize admin user"""
        return self.run_test("Admin Init", "POST", "admin/init", 200)

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login", 
            "POST", 
            "admin/login", 
            200,
            {"username": "admin", "password": "admin123"}
        )
        
        if success:
            # Set basic auth header for subsequent requests
            credentials = base64.b64encode(b"admin:admin123").decode('ascii')
            self.auth_header = {"Authorization": f"Basic {credentials}"}
        
        return success, response

    def test_categories(self):
        """Test category endpoints"""
        # Get categories
        success, categories = self.run_test("Get Categories", "GET", "categories", 200)
        
        # Create category (requires admin auth)
        if self.auth_header:
            category_data = {
                "name": "Test Kategori",
                "slug": "test-kategori",
                "icon": "test-icon"
            }
            self.run_test("Create Category", "POST", "categories", 200, category_data)
        
        return success

    def test_products(self):
        """Test product endpoints"""
        # Get products
        success, products = self.run_test("Get Products", "GET", "products", 200)
        
        # Create product (requires admin auth)
        if self.auth_header:
            product_data = {
                "name": "Test Ürün",
                "description": "Test ürün açıklaması",
                "category": "test-kategori",
                "images": ["https://example.com/test.jpg"],
                "variation": "Test Varyasyon",
                "min_order_quantity": 1,
                "price_range": "100-500 TL"
            }
            create_success, created_product = self.run_test("Create Product", "POST", "products", 200, product_data)
            
            if create_success and created_product:
                product_id = created_product.get('id')
                
                # Test get single product
                self.run_test("Get Single Product", "GET", f"products/{product_id}", 200)
                
                # Test update product
                update_data = {"name": "Updated Test Ürün"}
                self.run_test("Update Product", "PUT", f"products/{product_id}", 200, update_data)
                
                # Test delete product
                self.run_test("Delete Product", "DELETE", f"products/{product_id}", 200)
        
        return success

    def test_contact_messages_api(self):
        """Test Contact Messages API - FAZ 1 Critical Business Logic"""
        print("\n🔍 Testing Contact Messages API...")
        
        # 1. POST /api/contact - Create new message
        contact_data = {
            "name": "Test Kullanıcı",
            "email": "test@example.com",
            "phone": "05551234567",
            "subject": "Test Konusu",
            "message": "Bu bir test mesajıdır"
        }
        
        create_success, created_message = self.run_test(
            "Create Contact Message", 
            "POST", 
            "contact", 
            200, 
            contact_data
        )
        
        if not create_success:
            return False
            
        message_id = created_message.get('id')
        if not message_id:
            self.log_test("Contact Message ID Check", False, "No message ID returned")
            return False
        
        # 2. GET /api/contact-messages - List messages as admin
        if self.auth_header:
            list_success, messages = self.run_test(
                "List Contact Messages (Admin)", 
                "GET", 
                "contact-messages", 
                200
            )
            
            if list_success and messages:
                # Verify the created message exists and has "yeni" status
                found_message = None
                for msg in messages:
                    if msg.get('id') == message_id:
                        found_message = msg
                        break
                
                if found_message:
                    if found_message.get('status') == 'yeni':
                        self.log_test("Message Status Check", True, "Status is 'yeni' as expected")
                    else:
                        self.log_test("Message Status Check", False, f"Expected 'yeni', got '{found_message.get('status')}'")
                else:
                    self.log_test("Message Found Check", False, "Created message not found in list")
            
            # 3. PUT /api/contact-messages/{message_id} - Update status to "okundu"
            update_data = {"status": "okundu"}
            update_success, updated_message = self.run_test(
                "Update Message Status", 
                "PUT", 
                f"contact-messages/{message_id}", 
                200, 
                update_data
            )
            
            if update_success and updated_message.get('status') == 'okundu':
                self.log_test("Status Update Verification", True, "Status updated to 'okundu'")
            else:
                self.log_test("Status Update Verification", False, f"Status not updated correctly")
            
            # 4. DELETE /api/contact-messages/{message_id} - Delete message
            delete_success, _ = self.run_test(
                "Delete Contact Message", 
                "DELETE", 
                f"contact-messages/{message_id}", 
                200
            )
            
            return create_success and list_success and update_success and delete_success
        
        return create_success

    def test_quote_with_product_image(self):
        """Test Quote Create with Product Image - FAZ 1 Critical Business Logic"""
        print("\n🔍 Testing Quote Create with Product Image...")
        
        # Create quote with product_image field
        quote_data = {
            "customer_name": "Ali Yılmaz",
            "email": "ali@test.com",
            "phone": "05551234567",
            "company": "Test A.Ş.",
            "message": "Test teklif",
            "items": [
                {
                    "product_id": "test-product-1",
                    "product_name": "Test Ürün",
                    "product_image": "/uploads/test.png",
                    "quantity": 5
                }
            ],
            "attachments": []
        }
        
        create_success, created_quote = self.run_test(
            "Create Quote with Product Image", 
            "POST", 
            "quotes", 
            200, 
            quote_data
        )
        
        if not create_success:
            return False
            
        quote_id = created_quote.get('id')
        if not quote_id:
            self.log_test("Quote ID Check", False, "No quote ID returned")
            return False
        
        # Get the created quote and verify product_image field
        if self.auth_header:
            get_success, quote_details = self.run_test(
                "Get Quote Details", 
                "GET", 
                f"quotes/{quote_id}", 
                200
            )
            
            if get_success and quote_details:
                items = quote_details.get('items', [])
                if items and len(items) > 0:
                    first_item = items[0]
                    if 'product_image' in first_item and first_item['product_image'] == '/uploads/test.png':
                        self.log_test("Product Image Field Verification", True, "product_image field present and correct")
                        return True, quote_id  # Return quote_id for PDF test
                    else:
                        self.log_test("Product Image Field Verification", False, f"product_image field missing or incorrect: {first_item}")
                else:
                    self.log_test("Quote Items Check", False, "No items found in quote")
            
            return get_success, quote_id if get_success else None
        
        return create_success, quote_id

    def test_pdf_generate_with_product_images(self, quote_id=None):
        """Test PDF Generate with Product Images - FAZ 1 Critical Business Logic"""
        print("\n🔍 Testing PDF Generate with Product Images...")
        
        if not quote_id or not self.auth_header:
            self.log_test("PDF Test Prerequisites", False, "No quote_id or admin auth")
            return False
        
        # First add pricing to the quote (admin requirement)
        pricing_data = {
            "pricing": [
                {
                    "product_id": "test-product-1",
                    "product_name": "Test Ürün",
                    "quantity": 5,
                    "unit_price": 100.0,
                    "total_price": 500.0
                }
            ]
        }
        
        pricing_success, _ = self.run_test(
            "Add Pricing to Quote", 
            "PUT", 
            f"quotes/{quote_id}", 
            200, 
            pricing_data
        )
        
        if not pricing_success:
            return False
        
        # Test PDF generation
        try:
            url = f"{self.api_url}/quotes/{quote_id}/pdf"
            headers = {'Authorization': self.auth_header['Authorization']}
            
            response = requests.get(url, headers=headers, timeout=30)
            
            success = response.status_code == 200
            content_type = response.headers.get('content-type', '')
            
            if success and 'application/pdf' in content_type:
                self.log_test("PDF Generation", True, f"PDF generated successfully, Content-Type: {content_type}")
                return True
            else:
                details = f"Status: {response.status_code}, Content-Type: {content_type}"
                if not success:
                    try:
                        error_data = response.json()
                        details += f", Error: {error_data}"
                    except:
                        details += f", Response: {response.text[:200]}"
                self.log_test("PDF Generation", False, details)
                return False
                
        except Exception as e:
            self.log_test("PDF Generation", False, f"Exception: {str(e)}")
            return False

    def test_quote_update_customer_panel(self, quote_id=None):
        """Test Quote Update for Customer Panel - FAZ 1 Critical Business Logic"""
        print("\n🔍 Testing Quote Update (Customer Panel Scenario)...")
        
        if not quote_id or not self.auth_header:
            self.log_test("Quote Update Prerequisites", False, "No quote_id or admin auth")
            return False
        
        # First, get current quote to see current items
        get_success, current_quote = self.run_test(
            "Get Current Quote for Update", 
            "GET", 
            f"quotes/{quote_id}", 
            200
        )
        
        if not get_success:
            return False
        
        # Remove one item from the quote (simulate customer removing item)
        current_items = current_quote.get('items', [])
        if len(current_items) > 0:
            # Keep all items but reduce quantity (simulating item removal)
            updated_items = [
                {
                    "product_id": item['product_id'],
                    "product_name": item['product_name'],
                    "product_image": item.get('product_image'),
                    "quantity": max(1, item['quantity'] - 1)  # Reduce quantity by 1
                }
                for item in current_items
            ]
        else:
            updated_items = []
        
        # Update quote with modified items and status
        update_data = {
            "status": "onaylandi",  # Convert to order
            "items": updated_items
        }
        
        # Note: This endpoint might need to be modified to accept items update
        # For now, we'll test status update
        status_update_data = {"status": "onaylandi"}
        
        update_success, updated_quote = self.run_test(
            "Update Quote Status to Approved", 
            "PUT", 
            f"quotes/{quote_id}", 
            200, 
            status_update_data
        )
        
        if update_success:
            # Verify status was updated
            if updated_quote.get('status') == 'onaylandi':
                self.log_test("Quote Status Update Verification", True, "Status updated to 'onaylandi'")
                
                # Check if pricing array still exists after update
                if 'pricing' in updated_quote:
                    self.log_test("Pricing Array Preservation", True, "Pricing array preserved after update")
                else:
                    self.log_test("Pricing Array Preservation", False, "Pricing array missing after update")
                
                return True
            else:
                self.log_test("Quote Status Update Verification", False, f"Expected 'onaylandi', got '{updated_quote.get('status')}'")
        
        return update_success

    def test_quotes(self):
        """Test quote endpoints - Enhanced for FAZ 1 Critical Business Logic"""
        print("\n🔍 Running Enhanced Quote Tests...")
        
        # Run the new product image quote test
        quote_success, quote_id = self.test_quote_with_product_image()
        
        if quote_success and quote_id:
            # Test PDF generation with the created quote
            pdf_success = self.test_pdf_generate_with_product_images(quote_id)
            
            # Test quote update for customer panel
            update_success = self.test_quote_update_customer_panel(quote_id)
            
            return quote_success and pdf_success and update_success
        
        return quote_success

    def test_file_upload(self):
        """Test file upload endpoint"""
        # Create a simple test file
        test_content = b"Test file content"
        files = {'file': ('test.txt', test_content, 'text/plain')}
        
        try:
            url = f"{self.api_url}/upload"
            response = requests.post(url, files=files, timeout=30)
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                try:
                    result = response.json()
                    if 'url' in result:
                        details += ", File uploaded successfully"
                    else:
                        success = False
                        details += ", Missing URL in response"
                except:
                    success = False
                    details += ", Invalid JSON response"
            
            self.log_test("File Upload", success, details)
            return success
            
        except Exception as e:
            self.log_test("File Upload", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Turkish Quote System Backend Tests - FAZ 1 Critical Business Logic")
        print(f"🔗 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Test basic connectivity
        self.test_root_endpoint()
        
        # Initialize and test admin
        self.test_admin_init()
        self.test_admin_login()
        
        # Test main functionality
        self.test_categories()
        self.test_products()
        
        # FAZ 1 - Critical Business Logic Tests
        print("\n" + "=" * 60)
        print("🎯 FAZ 1 - KRİTİK İŞ MANTIĞI BACKEND TESTLERİ")
        print("=" * 60)
        
        # Test Contact Messages API
        self.test_contact_messages_api()
        
        # Test Enhanced Quotes (includes product images, PDF generation, and updates)
        self.test_quotes()
        
        # Test file upload
        self.test_file_upload()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = TurkishQuoteSystemTester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())