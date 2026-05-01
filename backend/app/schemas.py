from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    """Schema for user registration."""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Public user data returned to the client."""
    id: str
    full_name: str
    email: str
    created_at: datetime


class Token(BaseModel):
    """JWT token pair."""
    access_token: str
    token_type: str = "bearer"


# ─── Inventory ───────────────────────────────────────────────────────────────

class InventoryItemCreate(BaseModel):
    """Schema for creating an inventory item."""
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(default="Uncategorized", max_length=50)
    quantity: int = Field(default=0, ge=0)
    price: float = Field(default=0.0, ge=0)
    sku: str | None = Field(default=None, max_length=50)
    image_url: str | None = None


class InventoryItemUpdate(BaseModel):
    """Schema for updating an inventory item (all fields optional)."""
    name: str | None = Field(default=None, min_length=1, max_length=200)
    category: str | None = Field(default=None, max_length=50)
    quantity: int | None = Field(default=None, ge=0)
    price: float | None = Field(default=None, ge=0)
    sku: str | None = Field(default=None, max_length=50)
    image_url: str | None = None


class InventoryItemResponse(BaseModel):
    """Full inventory item returned to the client."""
    id: str
    name: str
    category: str
    quantity: int
    price: float
    sku: str | None
    image_url: str | None
    created_at: datetime
    updated_at: datetime


# ─── Receipt / OCR ───────────────────────────────────────────────────────────

class ReceiptItem(BaseModel):
    """A single line item extracted from a receipt."""
    name: str
    quantity: int = 1
    sku: str | None = None
    price: float


class ReceiptScanResponse(BaseModel):
    """Structured data returned after OCR processing a receipt image."""
    store_name: str | None = None
    date: str | None = None
    items: list[ReceiptItem] = []
    total: float = 0.0
    raw_text: str | None = None
