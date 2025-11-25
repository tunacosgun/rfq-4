import requests
import sys
import json
from datetime import datetime
import base64

class TurkishQuoteSystemTester:
    def __init__(self, base_url="https://merhaba-teklif.preview.emergentagent.com"):
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

    def test_quotes(self):
        """Test quote endpoints"""
        # Create quote (no auth required)
        quote_data = {
            "customer_name": "Test Müşteri",
            "company": "Test Firma",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "message": "Test teklif mesajı",
            "items": [
                {
                    "product_id": "test-product-id",
                    "product_name": "Test Ürün",
                    "quantity": 2
                }
            ]
        }
        
        create_success, created_quote = self.run_test("Create Quote", "POST", "quotes", 200, quote_data)
        
        # Get quotes (requires admin auth)
        if self.auth_header:
            self.run_test("Get Quotes", "GET", "quotes", 200)
            
            if create_success and created_quote:
                quote_id = created_quote.get('id')
                
                # Test get single quote
                self.run_test("Get Single Quote", "GET", f"quotes/{quote_id}", 200)
                
                # Test update quote status
                update_data = {
                    "status": "onaylandi",
                    "admin_note": "Test admin notu"
                }
                self.run_test("Update Quote", "PUT", f"quotes/{quote_id}", 200, update_data)
        
        return create_success

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
        print("🚀 Starting Turkish Quote System Backend Tests")
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
        self.test_quotes()
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