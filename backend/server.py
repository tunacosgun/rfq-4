from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import secrets
import bcrypt
import base64
from enum import Enum
from services.email_service import email_service
from services.pdf_service import pdf_service


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBasic()

# Enums
class QuoteStatus(str, Enum):
    BEKLEMEDE = "beklemede"
    INCELENIYOR = "inceleniyor"
    FIYAT_VERILDI = "fiyat_verildi"
    ONAYLANDI = "onaylandi"
    REDDEDILDI = "reddedildi"

# Models
class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str

class AdminLogin(BaseModel):
    username: str
    password: str

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    icon: Optional[str] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    images: List[str] = []
    category: str
    variation: Optional[str] = None
    variants: List[str] = []  # e.g., ["S", "M", "L", "XL"]
    min_order_quantity: Optional[int] = 1
    price_range: Optional[str] = None
    stock_quantity: Optional[int] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    images: List[str] = []
    category: str
    variation: Optional[str] = None
    variants: List[str] = []
    min_order_quantity: Optional[int] = 1
    price_range: Optional[str] = None
    stock_quantity: Optional[int] = None
    is_active: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None
    variation: Optional[str] = None
    variants: Optional[List[str]] = None
    min_order_quantity: Optional[int] = None
    price_range: Optional[str] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None

class QuoteItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int

class QuotePricing(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    total_price: float

class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    items: List[QuoteItem]
    pricing: List[QuotePricing] = []
    file_url: Optional[str] = None
    status: QuoteStatus = QuoteStatus.BEKLEMEDE
    admin_note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteCreate(BaseModel):
    customer_name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    items: List[QuoteItem]

class QuoteUpdate(BaseModel):
    status: Optional[QuoteStatus] = None
    admin_note: Optional[str] = None
    pricing: Optional[List[QuotePricing]] = None

class Customer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password_hash: str
    company: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: Optional[str] = None
    phone: Optional[str] = None

class CustomerLogin(BaseModel):
    email: EmailStr
    password: str

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None

class CompanySettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    # Genel Bilgiler
    company_name: str = "Şirket Adı"
    company_address: str = ""
    company_phone: str = ""
    company_email: str = ""
    company_website: str = ""
    tax_number: str = ""
    logo_url: str = ""
    terms_and_conditions: str = ""
    bank_info: str = ""
    
    # Ana Sayfa
    home_hero_title: str = "Teklif Alın, Kazanın"
    home_hero_subtitle: str = "Ürünlerimizi inceleyin, ihtiyacınıza uygun teklifler alın"
    home_hero_bg_image: str = ""
    home_hero_bg_color: str = "#22C55E"
    home_hero_text_color: str = "#FFFFFF"
    home_hero_disable_color: bool = False
    home_hero_overlay_opacity: int = 80
    
    # Favicon
    site_favicon_url: str = ""
    home_features_title: str = "Neden Bizi Seçmelisiniz?"
    home_features_subtitle: str = "Müşterilerimize sunduğumuz benzersiz avantajlar"
    home_products_title: str = "Öne Çıkan Ürünler"
    home_products_subtitle: str = "En popüler ürünlerimizi keşfedin"
    home_cta_title: str = "Hemen Teklif Alın"
    home_cta_subtitle: str = "Ürünlerimizi sepete ekleyin ve size özel fiyat teklifi almak için formu doldurun."
    
    # Ürünler Sayfası
    products_hero_title: str = "Ürünlerimiz"
    products_hero_subtitle: str = "Geniş ürün yelpazemizle ihtiyacınıza en uygun çözümleri keşfedin."
    products_empty_text: str = "Aramanızla eşleşen ürün bulunamadı"
    
    # Özellikler Sayfası
    features_hero_title: str = "Özelliklerimiz"
    features_hero_subtitle: str = "Müşterilerimize en iyi hizmeti sunmak için sunduğumuz avantajları keşfedin."
    features_cta_title: str = "Hemen Teklif Alın"
    features_cta_subtitle: str = "Ürünlerimizi inceleyip size özel teklif almak için sepete ekleyin."
    
    # Hakkımızda Sayfası
    about_hero_title: str = "Hakkımızda"
    about_hero_subtitle: str = "Yılların deneyimi ve mükemmellik anlayışıyla, sektörün önde gelen firmalarından biriyiz."
    about_title: str = "Hakkımızda"
    about_description: str = "Sektörde uzun yıllara dayanan deneyimimiz ve mükemmellik anlayışımızla, müşterilerimize en kaliteli hizmeti sunmayı hedefliyoruz."
    about_image_url: str = ""
    about_stat1_number: str = "10+"
    about_stat1_label: str = "Yıllık Deneyim"
    about_stat2_number: str = "500+"
    about_stat2_label: str = "Mutlu Müşteri"
    about_stat3_number: str = "1000+"
    about_stat3_label: str = "Tamamlanan Proje"
    about_stat4_number: str = "98%"
    about_stat4_label: str = "Müşteri Memnuniyeti"
    about_mission: str = "Müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunarak, sektörde öncü olmak."
    about_vision: str = "Global pazarda rekabetçi bir oyuncu olarak, sürdürülebilir büyüme sağlamak."
    about_values: str = "Dürüstlük, kalite, müşteri odaklılık ve yenilikçilik temel değerlerimizdir."
    
    # İletişim Sayfası
    contact_hero_title: str = "İletişime Geçin"
    contact_hero_subtitle: str = "Sorularınız veya talepleriniz için bize ulaşabilirsiniz. Size yardımcı olmaktan mutluluk duyarız."
    
    # İletişim - Kartlar
    contact_phone_card_title: str = "Telefon"
    contact_email_card_title: str = "E-posta"
    contact_address_card_title: str = "Adres"
    
    # İletişim - Form
    contact_form_title: str = "Mesaj Gönderin"
    contact_form_subtitle: str = "Formu doldurarak bize ulaşabilirsiniz."
    contact_form_name_label: str = "Adınız Soyadınız *"
    contact_form_name_placeholder: str = "Örn: Ahmet Yılmaz"
    contact_form_email_label: str = "E-posta Adresiniz *"
    contact_form_email_placeholder: str = "Örn: ahmet@example.com"
    contact_form_phone_label: str = "Telefon Numaranız"
    contact_form_phone_placeholder: str = "Örn: 0532 123 45 67"
    contact_form_subject_label: str = "Konu *"
    contact_form_subject_placeholder: str = "Mesajınızın konusu"
    contact_form_message_label: str = "Mesajınız *"
    contact_form_message_placeholder: str = "Mesajınızı buraya yazın..."
    contact_form_button_text: str = "Mesaj Gönder"
    contact_form_button_sending: str = "Gönderiliyor..."
    contact_form_success_message: str = "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız."
    
    # İletişim - Yan Bilgiler
    contact_work_hours_title: str = "Çalışma Saatleri"
    contact_work_hours: str = "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 14:00"
    contact_quick_contact_title: str = "Hızlı İletişim"
    contact_quick_contact_description: str = "Acil durumlar için telefon veya e-posta ile bize ulaşabilirsiniz. Ortalama yanıt süremiz 2 saat içindedir."
    contact_call_button_text: str = "Hemen Ara"
    
    # İletişim - Renkler
    contact_card_bg_color: str = "#FFFFFF"
    contact_card_icon_bg_color: str = "#22C55E"
    contact_card_hover_shadow: str = "#00000015"
    contact_button_bg_color: str = "#22C55E"
    contact_button_text_color: str = "#FFFFFF"
    
    # Footer - Genel
    footer_company_description: str = "Profesyonel B2B teklif yönetim platformu. Hızlı, güvenilir ve modern çözümler sunuyoruz."
    footer_copyright_text: str = "© 2025 RFQ Platform. Tüm hakları saklıdır."
    footer_powered_by_text: str = "Tunahan Cosgun"
    
    # Footer - Sosyal Medya
    footer_facebook_url: str = "#"
    footer_twitter_url: str = "#"
    footer_linkedin_url: str = "#"
    footer_instagram_url: str = "#"
    
    # Footer - Hızlı Erişim Bölümü
    footer_quicklinks_title: str = "Hızlı Erişim"
    footer_menu_home: str = "Ana Sayfa"
    footer_menu_products: str = "Ürünler"
    footer_menu_features: str = "Özellikler"
    footer_menu_about: str = "Hakkımızda"
    footer_menu_contact: str = "İletişim"
    
    # Footer - İletişim Bölümü
    footer_contact_title: str = "İletişim"
    
    # Footer - Bülten Bölümü
    footer_newsletter_title: str = "Bülten"
    footer_newsletter_subtitle: str = "Yeni ürünler ve kampanyalardan haberdar olmak için bültene kaydolun."
    footer_newsletter_button_text: str = "Abone Ol"
    
    # Footer - Renkler
    footer_bg_color: str = "#1F2937"
    footer_text_color: str = "#9CA3AF"
    footer_heading_color: str = "#FFFFFF"
    footer_link_color: str = "#9CA3AF"
    footer_link_hover_color: str = "#22C55E"
    footer_divider_color: str = "#374151"
    
    # Header / Navbar
    header_logo_url: str = ""
    header_company_name: str = "Özmen Gıda"
    header_menu_home: str = "Ana Sayfa"
    header_menu_products: str = "Ürünler"
    header_menu_features: str = "Özellikler"
    header_menu_about: str = "Hakkımızda"
    header_menu_contact: str = "İletişim"
    header_cart_button_text: str = "Sepet"
    
    # Header - Renkler
    header_bg_color: str = "#FFFFFF"
    header_text_color: str = "#374151"
    header_link_color: str = "#374151"
    header_link_active_color: str = "#22C55E"
    header_link_hover_color: str = "#22C55E"
    header_scrolled_bg_color: str = "#FFFFFFFA"
    header_cart_button_bg: str = "#22C55E"
    header_cart_button_text_color: str = "#FFFFFF"

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def get_current_admin(credentials: HTTPBasicCredentials = Depends(security)):
    admin = await db.admins.find_one({"username": credentials.username}, {"_id": 0})
    if not admin or not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı kullanıcı adı veya şifre",
            headers={"WWW-Authenticate": "Basic"},
        )
    return admin

# Routes
@api_router.get("/")
async def root():
    return {"message": "Teklif Sistemi API"}

# Admin endpoints
@api_router.post("/admin/login")
async def admin_login(login: AdminLogin):
    admin = await db.admins.find_one({"username": login.username}, {"_id": 0})
    if not admin or not verify_password(login.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Hatalı kullanıcı adı veya şifre")
    return {"success": True, "username": admin["username"]}

@api_router.post("/admin/init")
async def init_admin():
    """Initialize admin user - only for first setup"""
    existing_admin = await db.admins.find_one({}, {"_id": 0})
    if existing_admin:
        return {"message": "Admin zaten mevcut"}
    
    admin = Admin(
        username="admin",
        password_hash=get_password_hash("admin123")
    )
    await db.admins.insert_one(admin.model_dump())
    return {"message": "Admin oluşturuldu", "username": "admin", "password": "admin123"}

# Category endpoints
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category: Category, admin: dict = Depends(get_current_admin)):
    await db.categories.insert_one(category.model_dump())
    return category

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_update: CategoryUpdate, admin: dict = Depends(get_current_admin)):
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı")
    
    update_data = {k: v for k, v in category_update.model_dump().items() if v is not None}
    if update_data:
        await db.categories.update_one({"id": category_id}, {"$set": update_data})
        category.update(update_data)
    
    return Category(**category)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı")
    return {"message": "Kategori silindi"}

# Product endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, admin: dict = Depends(get_current_admin)):
    product = Product(**product_data.model_dump())
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate, admin: dict = Depends(get_current_admin)):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    
    update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
        product.update(update_data)
    
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return Product(**product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return {"message": "Ürün silindi"}

# Quote endpoints
@api_router.post("/quotes", response_model=Quote)
async def create_quote(quote_data: QuoteCreate):
    quote = Quote(**quote_data.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quotes.insert_one(doc)
    
    # Send notification email to admin
    try:
        email_service.send_new_quote_notification(doc)
    except Exception as e:
        logger.error(f"Failed to send quote notification email: {str(e)}")
    
    return quote

@api_router.get("/quotes", response_model=List[Quote])
async def get_quotes(admin: dict = Depends(get_current_admin), status_filter: Optional[str] = None):
    query = {}
    if status_filter:
        query["status"] = status_filter
    quotes = await db.quotes.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for quote in quotes:
        if isinstance(quote.get('created_at'), str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return quotes

@api_router.get("/quotes/{quote_id}", response_model=Quote)
async def get_quote(quote_id: str, admin: dict = Depends(get_current_admin)):
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
    if isinstance(quote.get('created_at'), str):
        quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return quote

@api_router.put("/quotes/{quote_id}", response_model=Quote)
async def update_quote(quote_id: str, quote_update: QuoteUpdate, admin: dict = Depends(get_current_admin)):
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
    
    update_data = {k: v for k, v in quote_update.model_dump().items() if v is not None}
    if update_data:
        await db.quotes.update_one({"id": quote_id}, {"$set": update_data})
        quote.update(update_data)
    
    if isinstance(quote.get('created_at'), str):
        quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return Quote(**quote)

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload file and return base64 encoded data URL"""
    try:
        contents = await file.read()
        file_extension = file.filename.split('.')[-1].lower()
        
        # Determine content type
        content_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }
        content_type = content_types.get(file_extension, 'application/octet-stream')
        
        # Convert to base64
        encoded = base64.b64encode(contents).decode('utf-8')
        data_url = f"data:{content_type};base64,{encoded}"
        
        return {"url": data_url, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dosya yüklenemedi: {str(e)}")

# PDF and Email endpoints
@api_router.get("/quotes/{quote_id}/pdf")
async def generate_quote_pdf(quote_id: str, admin: dict = Depends(get_current_admin)):
    """Generate PDF for quote"""
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
    
    try:
        # Get company settings
        settings = await db.settings.find_one({}, {"_id": 0})
        
        pdf_data = pdf_service.generate_quote_pdf(quote, quote.get('pricing'), settings)
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=teklif_{quote_id[:8]}.pdf"
            }
        )
    except Exception as e:
        logger.error(f"PDF generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF oluşturulamadı: {str(e)}")

@api_router.post("/quotes/{quote_id}/send-email")
async def send_quote_email(quote_id: str, admin: dict = Depends(get_current_admin)):
    """Send quote PDF to customer via email"""
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
    
    try:
        # Get company settings
        settings = await db.settings.find_one({}, {"_id": 0})
        
        # Generate PDF
        pdf_data = pdf_service.generate_quote_pdf(quote, quote.get('pricing'), settings)
        
        # Send email with PDF attachment
        success = email_service.send_quote_response(quote, pdf_data)
        
        if success:
            return {"message": "Email başarıyla gönderildi", "sent_to": quote['email']}
        else:
            return {"message": "Email gönderilemedi (SMTP yapılandırılmamış)", "sent_to": quote['email']}
            
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Email gönderilemedi: {str(e)}")

@api_router.delete("/quotes/{quote_id}")
async def delete_quote(quote_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a quote (Admin only)"""
    result = await db.quotes.delete_one({"id": quote_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
    
    return {"message": "Teklif başarıyla silindi", "deleted_id": quote_id}


# Customer Auth endpoints
@api_router.post("/customer/register")
async def customer_register(data: CustomerRegister):
    """Register new customer"""
    existing = await db.customers.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email zaten kayıtlı")
    
    customer = Customer(
        name=data.name,
        email=data.email,
        password_hash=get_password_hash(data.password),
        company=data.company,
        phone=data.phone
    )
    doc = customer.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.customers.insert_one(doc)
    return {"message": "Kayıt başarılı", "customer_id": customer.id}

@api_router.post("/customer/login")
async def customer_login(data: CustomerLogin):
    """Customer login"""
    customer = await db.customers.find_one({"email": data.email}, {"_id": 0})
    if not customer or not verify_password(data.password, customer["password_hash"]):
        raise HTTPException(status_code=401, detail="Hatalı email veya şifre")
    return {"success": True, "customer": {"id": customer["id"], "name": customer["name"], "email": customer["email"]}}

@api_router.get("/customer/quotes/{customer_email}")
async def get_customer_quotes(customer_email: str):
    """Get customer's quotes"""
    quotes = await db.quotes.find({"email": customer_email}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for quote in quotes:
        if isinstance(quote.get('created_at'), str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return quotes

# Settings endpoints
@api_router.get("/settings")
async def get_settings():
    """Get company settings (public)"""
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        return CompanySettings().model_dump()
    return settings

@api_router.post("/settings")
async def update_settings(settings: CompanySettings, admin: dict = Depends(get_current_admin)):
    """Update company settings"""
    await db.settings.delete_many({})  # Remove old settings
    await db.settings.insert_one(settings.model_dump())
    return {"message": "Ayarlar kaydedildi"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
