from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import csv
import io

from app import models, crud
from app.database import engine, get_db
# Importa todos os roteadores
from app.routers import products, uploads, sales

# Cria as tabelas no banco
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- Configuração do CORS ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adiciona as rotas
app.include_router(products.router, tags=["products"])
app.include_router(uploads.router, tags=["uploads"])
app.include_router(sales.router, tags=["sales"])

@app.get("/")
def read_root():
    return {"message": "API do Apollo Fullstack rodando!"}

# --- Rotas de Exportação CSV ---
@app.get("/export/products")
async def export_products_csv(db: Session = Depends(get_db)):
    """Exporta todos os produtos para CSV"""
    products = crud.get_products(db)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['ID', 'Nome', 'Preço', 'Categoria ID', 'Categoria'])
    
    for product in products:
        writer.writerow([
            product.id,
            product.name,
            product.price,
            product.category_id,
            product.category.name if product.category else ''
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=produtos.csv"}
    )

@app.get("/export/sales")
async def export_sales_csv(db: Session = Depends(get_db)):
    """Exporta todas as vendas para CSV"""
    sales = crud.get_sales(db, skip=0, limit=10000)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['ID', 'Produto ID', 'Produto', 'Quantidade', 'Total', 'Lucro', 'Data'])
    
    for sale in sales:
        writer.writerow([
            sale.id,
            sale.product_id,
            sale.product.name if sale.product else '',
            sale.quantity,
            sale.total_price,
            sale.profit,
            sale.date.strftime('%Y-%m-%d') if sale.date else ''
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=vendas.csv"}
    )