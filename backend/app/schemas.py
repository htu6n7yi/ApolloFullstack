from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# --- Schemas de Categoria ---
class CategoryBase(BaseModel):
    name: str
    discount_percentage: float

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# --- Schemas de Produto ---
class ProductBase(BaseModel):
    name: str
    price: float
    category_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    # Categoria é opcional para evitar erro de recursão se não carregada
    category: Optional[Category] = None 
    class Config:
        from_attributes = True

# --- Schemas de Venda ---
class SaleBase(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(SaleBase):
    # ✅ ADICIONADO: Data opcional (usa data atual se não fornecida)
    date: Optional[datetime] = None

class Sale(SaleBase):
    id: int
    total_price: float
    profit: float
    date: datetime
    # Opcional: incluir dados do produto na resposta
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True

# --- Schemas para o DASHBOARD ---
class ChartData(BaseModel):
    date: str  # Formato: "2026-01" (ano-mês)
    total_sales: float
    profit: float

class DashboardData(BaseModel):
    total_products: int
    total_sales_value: float
    total_profit: float
    chart_data: List[ChartData]