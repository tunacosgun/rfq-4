from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
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

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None

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