from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- Schemas para CATEGORIA ---
class CategoryBase(BaseModel):
    name: str
    discount_percentage: float = 0.0

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True # Permite ler dados do ORM (SQLAlchemy)

# --- Schemas para PRODUTO ---
class ProductBase(BaseModel):
    name: str
    price: float
    category_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    category: Optional[Category] = None

    class Config:
        from_attributes = True

# --- Schemas para VENDA ---
class SaleBase(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    total_price: float
    profit: float
    date: datetime
    product: Optional[Product] = None

    class Config:
        from_attributes = True