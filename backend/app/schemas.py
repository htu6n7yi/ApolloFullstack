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
        from_attributes = True # ou orm_mode = True (depende da versao do Pydantic, from_attributes é a v2)

# --- Schemas de Produto ---
class ProductBase(BaseModel):
    name: str
    price: float
    category_id: int

# CORREÇÃO AQUI: 'name: str' em vez de 'name: string'
class ProductCreate(BaseModel):
    name: str 
    price: float
    category_id: int

class Product(ProductBase):
    id: int
    # category é opcional para evitar erro de recursão se não carregada
    category: Optional[Category] = None 
    class Config:
        from_attributes = True

# --- Schemas de Venda ---
class SaleBase(BaseModel):
    product_id: int
    quantity: int
    total_price: float
    profit: float
    date: datetime

class SaleCreate(BaseModel):
    product_id: int
    quantity: int
    # Data é opcional na criação manual
    
class Sale(SaleBase):
    id: int
    class Config:
        from_attributes = True

# --- Schemas para o DASHBOARD ---
class ChartData(BaseModel):
    date: str
    total_sales: float
    profit: float

class DashboardData(BaseModel):
    total_products: int
    total_sales_value: float
    total_profit: float
    chart_data: List[ChartData]