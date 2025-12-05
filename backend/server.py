from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
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
import shutil
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

# Mount static files for uploads
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

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
    # New stock management fields
    alis_fiyati: Optional[float] = None
    birim: Optional[str] = None  # kg, kutu, adet, etc.
    minimum_stok: Optional[int] = None
    is_featured: Optional[bool] = False
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
    # New stock management fields
    alis_fiyati: Optional[float] = None
    birim: Optional[str] = None
    minimum_stok: Optional[int] = None
    is_featured: Optional[bool] = False

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
    # New stock management fields
    alis_fiyati: Optional[float] = None
    birim: Optional[str] = None
    minimum_stok: Optional[int] = None
    is_featured: Optional[bool] = None

class QuoteItem(BaseModel):
    product_id: str
    product_name: str
    product_image: Optional[str] = None
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
    attachments: List[str] = []  # URLs of uploaded files
    status: QuoteStatus = QuoteStatus.BEKLEMEDE
    admin_note: Optional[str] = None
    customer_id: Optional[str] = None  # Link to customer account
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteCreate(BaseModel):
    customer_name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    items: List[QuoteItem]
    attachments: List[str] = []  # URLs of uploaded files
    customer_id: Optional[str] = None

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

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    password: Optional[str] = None  # For password change


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None

class Campaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    baslik: str
    aciklama: str
    buton_yazisi: str
    buton_linki: str
    baslangic_tarihi: datetime
    bitis_tarihi: datetime
    aktif: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CampaignCreate(BaseModel):
    baslik: str
    aciklama: str
    buton_yazisi: str
    buton_linki: str
    baslangic_tarihi: datetime
    bitis_tarihi: datetime
    aktif: bool = True

class CampaignUpdate(BaseModel):
    baslik: Optional[str] = None
    aciklama: Optional[str] = None
    buton_yazisi: Optional[str] = None
    buton_linki: Optional[str] = None
    baslangic_tarihi: Optional[datetime] = None
    bitis_tarihi: Optional[datetime] = None
    aktif: Optional[bool] = None

class Vehicle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plaka: str
    marka_model: str
    kilometre: Optional[int] = None
    hat_depo: Optional[str] = None
    not_: Optional[str] = None
    bakim_tarihi: Optional[datetime] = None
    muayene_tarihi: Optional[datetime] = None
    kasko_tarihi: Optional[datetime] = None
    sigorta_tarihi: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleCreate(BaseModel):
    plaka: str
    marka_model: str
    kilometre: Optional[int] = None
    hat_depo: Optional[str] = None
    not_: Optional[str] = None
    bakim_tarihi: Optional[datetime] = None
    muayene_tarihi: Optional[datetime] = None
    kasko_tarihi: Optional[datetime] = None
    sigorta_tarihi: Optional[datetime] = None

class VehicleUpdate(BaseModel):
    plaka: Optional[str] = None
    marka_model: Optional[str] = None
    kilometre: Optional[int] = None
    hat_depo: Optional[str] = None
    not_: Optional[str] = None
    bakim_tarihi: Optional[datetime] = None
    muayene_tarihi: Optional[datetime] = None
    kasko_tarihi: Optional[datetime] = None
    sigorta_tarihi: Optional[datetime] = None


# Contact Message Models
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    status: str = "yeni"  # yeni, okundu, yanıtlandı
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactMessageUpdate(BaseModel):
    status: Optional[str] = None

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
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
    low_stock: Optional[bool] = None
):
    query = {}
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if low_stock:
        # Find products where stock_quantity <= minimum_stok
        query["$expr"] = {"$lte": ["$stock_quantity", "$minimum_stok"]}
    
    # Sorting
    sort_field = sort_by if sort_by else "created_at"
    sort_direction = 1 if sort_order == "asc" else -1
    
    products = await db.products.find(query, {"_id": 0}).sort(sort_field, sort_direction).to_list(1000)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/low-stock/list")
async def get_low_stock_products(admin: dict = Depends(get_current_admin)):
    """Get products with low stock (stock_quantity <= minimum_stok)"""
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    low_stock_products = []
    
    for product in products:
        stock_qty = product.get('stock_quantity', 0)
        min_stock = product.get('minimum_stok', 0)
        
        if min_stock and stock_qty is not None and stock_qty <= min_stock:
            if isinstance(product.get('created_at'), str):
                product['created_at'] = datetime.fromisoformat(product['created_at'])
            
            product['stock_status'] = 'critical' if stock_qty == 0 else 'low'
            product['stock_difference'] = min_stock - stock_qty
            low_stock_products.append(product)
    
    return low_stock_products

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
        
        # Get backend URL from environment or use localhost
        base_url = os.environ.get('BACKEND_URL', 'http://localhost:8001')
        
        pdf_data = pdf_service.generate_quote_pdf(quote, quote.get('pricing'), settings, base_url)
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
        
        # Get backend URL
        base_url = os.environ.get('BACKEND_URL', 'http://localhost:8001')
        
        # Generate PDF
        pdf_data = pdf_service.generate_quote_pdf(quote, quote.get('pricing'), settings, base_url)
        
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


@api_router.get("/customer/profile/{customer_id}")
async def get_customer_profile(customer_id: str):
    """Get customer profile by ID"""
    customer = await db.customers.find_one({"id": customer_id}, {"_id": 0, "password_hash": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Müşteri bulunamadı")
    if isinstance(customer.get('created_at'), str):
        customer['created_at'] = datetime.fromisoformat(customer['created_at'])
    return customer

@api_router.put("/customer/profile/{customer_id}")
async def update_customer_profile(customer_id: str, data: CustomerUpdate):
    """Update customer profile"""
    customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Müşteri bulunamadı")
    
    update_data = data.model_dump(exclude_unset=True)
    
    # Check email uniqueness if email is being updated
    if 'email' in update_data and update_data['email'] != customer['email']:
        existing = await db.customers.find_one({"email": update_data['email']}, {"_id": 0})
        if existing:
            raise HTTPException(status_code=400, detail="Bu email adresi zaten kullanılıyor")
    
    # Hash password if being updated
    if 'password' in update_data and update_data['password']:
        update_data['password_hash'] = get_password_hash(update_data['password'])
        del update_data['password']
    
    if update_data:
        await db.customers.update_one(
            {"id": customer_id},
            {"$set": update_data}
        )
    
    updated_customer = await db.customers.find_one({"id": customer_id}, {"_id": 0, "password_hash": 0})
    if isinstance(updated_customer.get('created_at'), str):
        updated_customer['created_at'] = datetime.fromisoformat(updated_customer['created_at'])
    
    return {"message": "Profil güncellendi", "customer": updated_customer}

# Admin Password Change
@api_router.post("/admin/change-password")
async def change_admin_password(
    data: dict,
    admin: dict = Depends(get_current_admin)
):
    """Change admin password"""
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="Tüm alanlar gereklidir")
    
    # Verify current password
    if not verify_password(current_password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Mevcut şifre yanlış")
    
    # Update password (Note: In production, this should update database)
    global ADMIN_PASSWORD_HASH
    ADMIN_PASSWORD_HASH = get_password_hash(new_password)
    
    return {"message": "Şifre başarıyla güncellendi"}

        updated_customer['created_at'] = datetime.fromisoformat(updated_customer['created_at'])
    
    return {"message": "Profil güncellendi", "customer": updated_customer}


# Admin Customer Management endpoints
@api_router.get("/admin/customers")
async def get_all_customers(admin: dict = Depends(get_current_admin)):
    """Get all customers with their quote statistics"""
    customers = await db.customers.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(1000)
    
    # Add quote statistics for each customer
    for customer in customers:
        if isinstance(customer.get('created_at'), str):
            customer['created_at'] = datetime.fromisoformat(customer['created_at'])
        
        # Count quotes for this customer
        quote_count = await db.quotes.count_documents({"email": customer["email"]})
        customer['quote_count'] = quote_count
        
        # Get latest quote
        latest_quote = await db.quotes.find_one(
            {"email": customer["email"]}, 
            {"_id": 0},
            sort=[("created_at", -1)]
        )
        customer['latest_quote_date'] = latest_quote.get('created_at') if latest_quote else None
    
    return customers

@api_router.get("/admin/customers/{customer_id}/quotes")
async def get_customer_quotes_by_id(customer_id: str, admin: dict = Depends(get_current_admin)):
    """Get all quotes for a specific customer"""
    customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Müşteri bulunamadı")
    
    quotes = await db.quotes.find({"email": customer["email"]}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for quote in quotes:
        if isinstance(quote.get('created_at'), str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    
    return {"customer": customer, "quotes": quotes}

# File Upload endpoints
@api_router.post("/upload-file")
async def upload_file_to_disk(file: UploadFile = File(...)):
    """Upload a file (for quotes or other purposes)"""
    try:
        # Generate unique filename
        file_ext = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return URL
        file_url = f"/uploads/{unique_filename}"
        return {
            "success": True,
            "url": file_url,
            "filename": file.filename,
            "size": file.size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

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

# Campaign endpoints
@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns(admin: dict = Depends(get_current_admin)):
    """Get all campaigns (admin only)"""
    campaigns = await db.campaigns.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for campaign in campaigns:
        if isinstance(campaign.get('created_at'), str):
            campaign['created_at'] = datetime.fromisoformat(campaign['created_at'])
        if isinstance(campaign.get('baslangic_tarihi'), str):
            campaign['baslangic_tarihi'] = datetime.fromisoformat(campaign['baslangic_tarihi'])
        if isinstance(campaign.get('bitis_tarihi'), str):
            campaign['bitis_tarihi'] = datetime.fromisoformat(campaign['bitis_tarihi'])
    return campaigns

@api_router.get("/campaigns/active")
async def get_active_campaign():
    """Get currently active campaign (public)"""
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    
    campaigns = await db.campaigns.find({
        "aktif": True,
        "baslangic_tarihi": {"$lte": now_iso},
        "bitis_tarihi": {"$gte": now_iso}
    }, {"_id": 0}).to_list(1)
    
    if not campaigns:
        return None
    
    campaign = campaigns[0]
    if isinstance(campaign.get('created_at'), str):
        campaign['created_at'] = datetime.fromisoformat(campaign['created_at'])
    if isinstance(campaign.get('baslangic_tarihi'), str):
        campaign['baslangic_tarihi'] = datetime.fromisoformat(campaign['baslangic_tarihi'])
    if isinstance(campaign.get('bitis_tarihi'), str):
        campaign['bitis_tarihi'] = datetime.fromisoformat(campaign['bitis_tarihi'])
    
    return campaign

@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(campaign_data: CampaignCreate, admin: dict = Depends(get_current_admin)):
    """Create new campaign"""
    campaign = Campaign(**campaign_data.model_dump())
    doc = campaign.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['baslangic_tarihi'] = doc['baslangic_tarihi'].isoformat()
    doc['bitis_tarihi'] = doc['bitis_tarihi'].isoformat()
    await db.campaigns.insert_one(doc)
    return campaign

@api_router.put("/campaigns/{campaign_id}", response_model=Campaign)
async def update_campaign(campaign_id: str, campaign_update: CampaignUpdate, admin: dict = Depends(get_current_admin)):
    """Update campaign"""
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Kampanya bulunamadı")
    
    update_data = {k: v for k, v in campaign_update.model_dump().items() if v is not None}
    if update_data:
        # Convert datetime fields to ISO format if present
        if 'baslangic_tarihi' in update_data:
            update_data['baslangic_tarihi'] = update_data['baslangic_tarihi'].isoformat()
        if 'bitis_tarihi' in update_data:
            update_data['bitis_tarihi'] = update_data['bitis_tarihi'].isoformat()
        
        await db.campaigns.update_one({"id": campaign_id}, {"$set": update_data})
        campaign.update(update_data)
    
    # Convert string dates back to datetime for response
    if isinstance(campaign.get('created_at'), str):
        campaign['created_at'] = datetime.fromisoformat(campaign['created_at'])
    if isinstance(campaign.get('baslangic_tarihi'), str):
        campaign['baslangic_tarihi'] = datetime.fromisoformat(campaign['baslangic_tarihi'])
    if isinstance(campaign.get('bitis_tarihi'), str):
        campaign['bitis_tarihi'] = datetime.fromisoformat(campaign['bitis_tarihi'])
    
    return Campaign(**campaign)

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, admin: dict = Depends(get_current_admin)):
    """Delete campaign"""
    result = await db.campaigns.delete_one({"id": campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kampanya bulunamadı")
    return {"message": "Kampanya silindi"}

# Vehicle endpoints
@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles(admin: dict = Depends(get_current_admin)):
    """Get all vehicles"""
    vehicles = await db.vehicles.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for vehicle in vehicles:
        if isinstance(vehicle.get('created_at'), str):
            vehicle['created_at'] = datetime.fromisoformat(vehicle['created_at'])
        for date_field in ['bakim_tarihi', 'muayene_tarihi', 'kasko_tarihi', 'sigorta_tarihi']:
            if vehicle.get(date_field) and isinstance(vehicle[date_field], str):
                vehicle[date_field] = datetime.fromisoformat(vehicle[date_field])
    return vehicles

@api_router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str, admin: dict = Depends(get_current_admin)):
    """Get vehicle by ID"""
    vehicle = await db.vehicles.find_one({"id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")
    
    if isinstance(vehicle.get('created_at'), str):
        vehicle['created_at'] = datetime.fromisoformat(vehicle['created_at'])
    for date_field in ['bakim_tarihi', 'muayene_tarihi', 'kasko_tarihi', 'sigorta_tarihi']:
        if vehicle.get(date_field) and isinstance(vehicle[date_field], str):
            vehicle[date_field] = datetime.fromisoformat(vehicle[date_field])
    
    return vehicle

@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(vehicle_data: VehicleCreate, admin: dict = Depends(get_current_admin)):
    """Create new vehicle"""
    vehicle = Vehicle(**vehicle_data.model_dump())
    doc = vehicle.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    # Convert date fields to ISO format
    for date_field in ['bakim_tarihi', 'muayene_tarihi', 'kasko_tarihi', 'sigorta_tarihi']:
        if doc.get(date_field):
            doc[date_field] = doc[date_field].isoformat()
    
    await db.vehicles.insert_one(doc)
    return vehicle

@api_router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(vehicle_id: str, vehicle_update: VehicleUpdate, admin: dict = Depends(get_current_admin)):
    """Update vehicle"""
    vehicle = await db.vehicles.find_one({"id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")
    
    update_data = {k: v for k, v in vehicle_update.model_dump().items() if v is not None}
    if update_data:
        # Convert date fields to ISO format if present
        for date_field in ['bakim_tarihi', 'muayene_tarihi', 'kasko_tarihi', 'sigorta_tarihi']:
            if date_field in update_data and update_data[date_field]:
                update_data[date_field] = update_data[date_field].isoformat()
        
        await db.vehicles.update_one({"id": vehicle_id}, {"$set": update_data})
        vehicle.update(update_data)
    
    # Convert string dates back to datetime for response
    if isinstance(vehicle.get('created_at'), str):
        vehicle['created_at'] = datetime.fromisoformat(vehicle['created_at'])
    for date_field in ['bakim_tarihi', 'muayene_tarihi', 'kasko_tarihi', 'sigorta_tarihi']:
        if vehicle.get(date_field) and isinstance(vehicle[date_field], str):
            vehicle[date_field] = datetime.fromisoformat(vehicle[date_field])
    
    return Vehicle(**vehicle)

@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, admin: dict = Depends(get_current_admin)):
    """Delete vehicle"""
    result = await db.vehicles.delete_one({"id": vehicle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")
    return {"message": "Araç silindi"}

@api_router.get("/vehicles/warnings/all")
async def get_vehicle_warnings(admin: dict = Depends(get_current_admin)):
    """Get vehicles with upcoming or overdue maintenance dates"""
    vehicles = await db.vehicles.find({}, {"_id": 0}).to_list(1000)
    now = datetime.now(timezone.utc)
    warning_threshold = 30  # 30 days
    
    warnings = []
    for vehicle in vehicles:
        vehicle_warnings = []
        
        for date_field in ['bakim_tarihi', 'muayene_tarihi', 'kasko_tarihi', 'sigorta_tarihi']:
            if vehicle.get(date_field):
                date_str = vehicle[date_field]
                date_obj = datetime.fromisoformat(date_str) if isinstance(date_str, str) else date_str
                
                days_until = (date_obj - now).days
                
                if days_until < 0:
                    status = "overdue"
                    color = "red"
                elif days_until <= warning_threshold:
                    status = "warning"
                    color = "yellow"
                else:
                    status = "ok"
                    color = "green"
                
                vehicle_warnings.append({
                    "field": date_field,
                    "date": date_str,
                    "days_until": days_until,
                    "status": status,
                    "color": color
                })
        
        if vehicle_warnings:
            warnings.append({
                "vehicle_id": vehicle["id"],
                "plaka": vehicle["plaka"],
                "marka_model": vehicle["marka_model"],
                "warnings": vehicle_warnings
            })
    
    return warnings


# ==================== CONTACT MESSAGES ====================

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageCreate):
    """Create new contact message (public endpoint)"""
    message = ContactMessage(**message_data.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    
    # Optional: Send notification email to admin
    try:
        logger.info(f"New contact message received from {message.email}")
    except Exception as e:
        logger.error(f"Failed to log contact message: {str(e)}")
    
    return message

@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages(admin: dict = Depends(get_current_admin), status_filter: Optional[str] = None):
    """Get all contact messages (admin only)"""
    query = {}
    if status_filter:
        query["status"] = status_filter
    messages = await db.contact_messages.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for message in messages:
        if isinstance(message.get('created_at'), str):
            message['created_at'] = datetime.fromisoformat(message['created_at'])
    return messages

@api_router.get("/contact-messages/{message_id}", response_model=ContactMessage)
async def get_contact_message(message_id: str, admin: dict = Depends(get_current_admin)):
    """Get specific contact message (admin only)"""
    message = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
    if not message:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı")
    if isinstance(message.get('created_at'), str):
        message['created_at'] = datetime.fromisoformat(message['created_at'])
    return message

@api_router.put("/contact-messages/{message_id}", response_model=ContactMessage)
async def update_contact_message(message_id: str, message_update: ContactMessageUpdate, admin: dict = Depends(get_current_admin)):
    """Update contact message status (admin only)"""
    message = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
    if not message:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı")
    
    update_data = message_update.model_dump(exclude_unset=True)
    if update_data:
        await db.contact_messages.update_one(
            {"id": message_id},
            {"$set": update_data}
        )
    
    updated_message = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
    if isinstance(updated_message.get('created_at'), str):
        updated_message['created_at'] = datetime.fromisoformat(updated_message['created_at'])
    
    return ContactMessage(**updated_message)

@api_router.delete("/contact-messages/{message_id}")
async def delete_contact_message(message_id: str, admin: dict = Depends(get_current_admin)):
    """Delete contact message (admin only)"""
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı")
    return {"message": "Mesaj silindi"}


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
