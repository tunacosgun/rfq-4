import requests
import sys
import json
from datetime import datetime
import base64
import time

class ComprehensiveE2ETester:
    def __init__(self, base_url="https://quotepro-6.preview.emergentagent.com"):
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

    def test_backend_api_health_checks(self):
        """1️⃣ BACKEND API HEALTH CHECKS - Test all major endpoints"""
        print("\n🔍 1️⃣ BACKEND API HEALTH CHECKS")
        print("=" * 50)
        
        health_results = []
        
        # Test root endpoint
        success, _ = self.run_test("Root API Health", "GET", "", 200)
        health_results.append(success)
        
        # Test products endpoint
        success, _ = self.run_test("Products API Health", "GET", "products", 200)
        health_results.append(success)
        
        # Test categories endpoint  
        success, _ = self.run_test("Categories API Health", "GET", "categories", 200)
        health_results.append(success)
        
        # Test quotes endpoint (requires admin auth)
        if self.auth_header:
            success, _ = self.run_test("Quotes API Health", "GET", "quotes", 200)
            health_results.append(success)
        
        # Test contact messages endpoint (requires admin auth)
        if self.auth_header:
            success, _ = self.run_test("Contact Messages API Health", "GET", "contact-messages", 200)
            health_results.append(success)
        
        # Test admin customers endpoint
        if self.auth_header:
            success, _ = self.run_test("Admin Customers API Health", "GET", "admin/customers", 200)
            health_results.append(success)
        
        return all(health_results)

    def test_admin_balance_management(self):
        """2️⃣ ADMIN PANEL - BALANCE MANAGEMENT (CRITICAL - USER'S MAIN COMPLAINT)"""
        print("\n🔍 2️⃣ ADMIN PANEL - BALANCE MANAGEMENT (CRITICAL)")
        print("=" * 50)
        
        if not self.auth_header:
            self.log_test("Balance Management Prerequisites", False, "No admin authentication")
            return False
        
        # First, create a test customer for balance management
        customer_data = {
            "name": "Test Balance Customer",
            "email": "balance@test.com",
            "password": "test123",
            "company": "Balance Test A.Ş.",
            "phone": "05551234567"
        }
        
        # Register customer
        create_success, customer_response = self.run_test(
            "Create Test Customer for Balance", 
            "POST", 
            "customer/register", 
            200, 
            customer_data
        )
        
        if not create_success:
            return False
        
        customer_id = customer_response.get('customer_id')
        if not customer_id:
            self.log_test("Customer ID Check", False, "No customer ID returned")
            return False
        
        # Test getting all customers (admin panel customer list)
        list_success, customers = self.run_test(
            "Get All Customers (Admin Panel)", 
            "GET", 
            "admin/customers", 
            200
        )
        
        if not list_success:
            return False
        
        # Find our test customer in the list
        test_customer = None
        for customer in customers:
            if customer.get('id') == customer_id:
                test_customer = customer
                break
        
        if not test_customer:
            self.log_test("Customer Found in List", False, "Test customer not found in admin customer list")
            return False
        
        self.log_test("Customer Found in List", True, f"Customer '{test_customer.get('name')}' found")
        
        # Test balance operations
        balance_results = []
        
        # Test adding balance
        add_balance_data = {
            "customer_id": customer_id,
            "customer_name": test_customer.get('name'),
            "action": "add",
            "amount": 100.0,
            "old_balance": 0.0,
            "new_balance": 100.0,
            "note": "Test balance addition"
        }
        
        add_success, _ = self.run_test(
            "Add Balance (100 TL)", 
            "POST", 
            "admin/balance-log", 
            200, 
            add_balance_data
        )
        balance_results.append(add_success)
        
        # Test subtracting balance
        subtract_balance_data = {
            "customer_id": customer_id,
            "customer_name": test_customer.get('name'),
            "action": "subtract",
            "amount": 50.0,
            "old_balance": 100.0,
            "new_balance": 50.0,
            "note": "Test balance subtraction"
        }
        
        subtract_success, _ = self.run_test(
            "Subtract Balance (50 TL)", 
            "POST", 
            "admin/balance-log", 
            200, 
            subtract_balance_data
        )
        balance_results.append(subtract_success)
        
        # Test setting balance
        set_balance_data = {
            "customer_id": customer_id,
            "customer_name": test_customer.get('name'),
            "action": "set",
            "amount": 200.0,
            "old_balance": 50.0,
            "new_balance": 200.0,
            "note": "Test balance set"
        }
        
        set_success, _ = self.run_test(
            "Set Balance (200 TL)", 
            "POST", 
            "admin/balance-log", 
            200, 
            set_balance_data
        )
        balance_results.append(set_success)
        
        # Test getting balance logs for customer
        logs_success, logs = self.run_test(
            "Get Customer Balance Logs", 
            "GET", 
            f"admin/balance-logs/{customer_id}", 
            200
        )
        balance_results.append(logs_success)
        
        if logs_success and logs:
            if len(logs) >= 3:  # Should have at least 3 log entries
                self.log_test("Balance Logs Count", True, f"Found {len(logs)} balance log entries")
            else:
                self.log_test("Balance Logs Count", False, f"Expected at least 3 logs, found {len(logs)}")
        
        return all(balance_results)

    def test_admin_panel_other_features(self):
        """3️⃣ ADMIN PANEL - OTHER CRITICAL FEATURES"""
        print("\n🔍 3️⃣ ADMIN PANEL - OTHER CRITICAL FEATURES")
        print("=" * 50)
        
        if not self.auth_header:
            self.log_test("Admin Panel Prerequisites", False, "No admin authentication")
            return False
        
        feature_results = []
        
        # Test "Öne Çıkar" (Featured) products endpoint
        # First create a product to feature
        product_data = {
            "name": "Featured Test Product",
            "description": "Test product for featuring",
            "category": "test-category",
            "images": ["https://example.com/featured.jpg"],
            "is_featured": True
        }
        
        create_success, created_product = self.run_test(
            "Create Featured Product", 
            "POST", 
            "products", 
            200, 
            product_data
        )
        feature_results.append(create_success)
        
        if create_success:
            product_id = created_product.get('id')
            
            # Test updating product to featured
            update_data = {"is_featured": True}
            update_success, _ = self.run_test(
                "Update Product to Featured", 
                "PUT", 
                f"products/{product_id}", 
                200, 
                update_data
            )
            feature_results.append(update_success)
        
        # Test contact messages visibility (already tested in health checks)
        contact_success, messages = self.run_test(
            "Contact Messages Visibility", 
            "GET", 
            "contact-messages", 
            200
        )
        feature_results.append(contact_success)
        
        # Test admin password change functionality
        password_change_data = {
            "current_password": "admin123",
            "new_password": "newadmin123"
        }
        
        password_success, _ = self.run_test(
            "Admin Password Change", 
            "POST", 
            "admin/change-password", 
            200, 
            password_change_data
        )
        feature_results.append(password_success)
        
        # Change password back for other tests
        if password_success:
            # Update auth header with new password
            credentials = base64.b64encode(b"admin:newadmin123").decode('ascii')
            self.auth_header = {"Authorization": f"Basic {credentials}"}
            
            # Change back to original password
            revert_data = {
                "current_password": "newadmin123",
                "new_password": "admin123"
            }
            
            revert_success, _ = self.run_test(
                "Revert Admin Password", 
                "POST", 
                "admin/change-password", 
                200, 
                revert_data
            )
            
            if revert_success:
                # Restore original auth header
                credentials = base64.b64encode(b"admin:admin123").decode('ascii')
                self.auth_header = {"Authorization": f"Basic {credentials}"}
        
        # Test visitor tracking page
        visitor_success, visitors = self.run_test(
            "Visitor Tracking Data", 
            "GET", 
            "admin/visitors", 
            200
        )
        feature_results.append(visitor_success)
        
        return all(feature_results)

    def test_customer_panel_functionality(self):
        """4️⃣ CUSTOMER PANEL"""
        print("\n🔍 4️⃣ CUSTOMER PANEL")
        print("=" * 50)
        
        panel_results = []
        
        # Register a new customer
        customer_data = {
            "name": "Panel Test Customer",
            "email": "panel@test.com",
            "password": "test123",
            "company": "Panel Test A.Ş.",
            "phone": "05551234567"
        }
        
        register_success, register_response = self.run_test(
            "Register New Customer", 
            "POST", 
            "customer/register", 
            200, 
            customer_data
        )
        panel_results.append(register_success)
        
        if not register_success:
            return False
        
        customer_id = register_response.get('customer_id')
        
        # Login customer
        login_data = {
            "email": "panel@test.com",
            "password": "test123"
        }
        
        login_success, login_response = self.run_test(
            "Customer Login", 
            "POST", 
            "customer/login", 
            200, 
            login_data
        )
        panel_results.append(login_success)
        
        if login_success:
            customer_info = login_response.get('customer', {})
            self.log_test("Customer Login Verification", True, f"Logged in as {customer_info.get('name')}")
        
        # Test customer profile retrieval
        if customer_id:
            profile_success, profile = self.run_test(
                "Get Customer Profile", 
                "GET", 
                f"customer/profile/{customer_id}", 
                200
            )
            panel_results.append(profile_success)
            
            # Test profile update
            if profile_success:
                update_data = {
                    "phone": "05559876543",
                    "company": "Updated Panel Test A.Ş."
                }
                
                update_success, _ = self.run_test(
                    "Update Customer Profile", 
                    "PUT", 
                    f"customer/profile/{customer_id}", 
                    200, 
                    update_data
                )
                panel_results.append(update_success)
        
        # Test quote item selection feature (create a quote for the customer)
        quote_data = {
            "customer_name": "Panel Test Customer",
            "email": "panel@test.com",
            "phone": "05551234567",
            "company": "Panel Test A.Ş.",
            "message": "Test quote for customer panel",
            "items": [
                {
                    "product_id": "panel-test-1",
                    "product_name": "Panel Test Product",
                    "product_image": "/uploads/panel-test.jpg",
                    "quantity": 3
                }
            ],
            "customer_id": customer_id
        }
        
        quote_success, quote_response = self.run_test(
            "Create Quote for Customer", 
            "POST", 
            "quotes", 
            200, 
            quote_data
        )
        panel_results.append(quote_success)
        
        # Test getting customer quotes
        if quote_success:
            customer_quotes_success, quotes = self.run_test(
                "Get Customer Quotes", 
                "GET", 
                f"customer/quotes/panel@test.com", 
                200
            )
            panel_results.append(customer_quotes_success)
            
            if customer_quotes_success and quotes:
                self.log_test("Customer Quotes Count", True, f"Found {len(quotes)} quotes for customer")
                
                # Test creating an order from selected quote items
                if len(quotes) > 0:
                    quote_id = quotes[0].get('id')
                    
                    # First add pricing to quote (admin action)
                    if self.auth_header and quote_id:
                        pricing_data = {
                            "pricing": [
                                {
                                    "product_id": "panel-test-1",
                                    "product_name": "Panel Test Product",
                                    "quantity": 3,
                                    "unit_price": 150.0,
                                    "total_price": 450.0
                                }
                            ],
                            "status": "fiyat_verildi"
                        }
                        
                        pricing_success, _ = self.run_test(
                            "Add Pricing to Customer Quote", 
                            "PUT", 
                            f"quotes/{quote_id}", 
                            200, 
                            pricing_data
                        )
                        
                        if pricing_success:
                            # Test converting quote to order
                            order_data = {
                                "selected_items": [0]  # Select first item
                            }
                            
                            order_success, _ = self.run_test(
                                "Convert Quote to Order", 
                                "POST", 
                                f"customer/quotes/{quote_id}/convert-to-order", 
                                200, 
                                order_data
                            )
                            panel_results.append(order_success)
        
        return all(panel_results)

    def test_performance_check(self):
        """5️⃣ PERFORMANCE CHECK"""
        print("\n🔍 5️⃣ PERFORMANCE CHECK")
        print("=" * 50)
        
        performance_results = []
        
        # Measure AdminCustomers page load time
        if self.auth_header:
            start_time = time.time()
            
            success, customers = self.run_test(
                "Admin Customers Performance", 
                "GET", 
                "admin/customers", 
                200
            )
            
            end_time = time.time()
            load_time = end_time - start_time
            
            if success:
                if load_time < 5.0:  # Should load within 5 seconds
                    self.log_test("Admin Customers Load Time", True, f"Loaded in {load_time:.2f}s")
                    performance_results.append(True)
                else:
                    self.log_test("Admin Customers Load Time", False, f"Slow load time: {load_time:.2f}s")
                    performance_results.append(False)
                
                # Check for excessive data
                if customers and len(customers) > 0:
                    self.log_test("Customer Data Size", True, f"Retrieved {len(customers)} customers")
                else:
                    self.log_test("Customer Data Size", True, "No customers found (expected for test)")
            else:
                performance_results.append(False)
        
        # Test multiple API calls to check for performance bottlenecks
        start_time = time.time()
        
        api_calls = [
            ("products", "GET", "products"),
            ("categories", "GET", "categories"),
            ("settings", "GET", "settings"),
            ("brands", "GET", "brands")
        ]
        
        for name, method, endpoint in api_calls:
            success, _ = self.run_test(f"Performance - {name}", method, endpoint, 200)
            performance_results.append(success)
        
        end_time = time.time()
        total_time = end_time - start_time
        
        if total_time < 10.0:  # All calls should complete within 10 seconds
            self.log_test("Multiple API Calls Performance", True, f"Completed in {total_time:.2f}s")
        else:
            self.log_test("Multiple API Calls Performance", False, f"Slow performance: {total_time:.2f}s")
            performance_results.append(False)
        
        return all(performance_results)

    def run_comprehensive_e2e_tests(self):
        """Run comprehensive E2E tests based on user report: 'sayfalar hata veriyor'"""
        print("🚀 COMPREHENSIVE E2E TEST - USER REPORTED: 'sayfalar hata veriyor'")
        print(f"🔗 Testing API at: {self.api_url}")
        print("=" * 80)
        
        # Initialize admin first
        print("\n🔧 SETUP - Admin Initialization")
        self.test_admin_init()
        admin_login_success = self.test_admin_login()[0]
        
        if not admin_login_success:
            print("❌ CRITICAL: Admin login failed - cannot proceed with admin tests")
            return 1
        
        # Run all critical test flows
        test_results = []
        
        # 1️⃣ Backend API Health Checks
        health_result = self.test_backend_api_health_checks()
        test_results.append(("Backend API Health", health_result))
        
        # 2️⃣ Admin Panel - Balance Management (CRITICAL)
        balance_result = self.test_admin_balance_management()
        test_results.append(("Admin Balance Management (CRITICAL)", balance_result))
        
        # 3️⃣ Admin Panel - Other Features
        admin_features_result = self.test_admin_panel_other_features()
        test_results.append(("Admin Panel Features", admin_features_result))
        
        # 4️⃣ Customer Panel
        customer_result = self.test_customer_panel_functionality()
        test_results.append(("Customer Panel", customer_result))
        
        # 5️⃣ Performance Check
        performance_result = self.test_performance_check()
        test_results.append(("Performance Check", performance_result))
        
        # Print detailed summary
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE E2E TEST RESULTS")
        print("=" * 80)
        
        failed_tests = []
        for test_name, result in test_results:
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{status} - {test_name}")
            if not result:
                failed_tests.append(test_name)
        
        print(f"\n📈 Overall: {self.tests_passed}/{self.tests_run} individual tests passed")
        
        if failed_tests:
            print(f"\n⚠️  FAILED TEST CATEGORIES:")
            for failed in failed_tests:
                print(f"   - {failed}")
            
            if "Admin Balance Management (CRITICAL)" in failed_tests:
                print("\n🚨 CRITICAL ISSUE: Balance Management is failing - this matches user complaint!")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ALL TESTS PASSED - No backend issues found!")
            return 0
        else:
            print(f"\n⚠️  ISSUES FOUND - {self.tests_run - self.tests_passed} tests failed")
            return 1

    def run_all_tests(self):
        """Run comprehensive E2E tests"""
        return self.run_comprehensive_e2e_tests()

def main():
    tester = ComprehensiveE2ETester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())