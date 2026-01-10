from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import get_db
import random
from datetime import datetime, timedelta
from typing import List

router = APIRouter()

# ========== DASHBOARD STATS ==========
@router.get("/dashboard-stats/", response_model=schemas.DashboardData)
def get_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

# ========== LISTAR VENDAS ==========
@router.get("/sales/", response_model=List[schemas.Sale])
def read_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sales = db.query(models.Sale).offset(skip).limit(limit).all()
    return sales

# ========== CRIAR VENDA ==========
# ✅ CORRIGIDO: Mudei de "/" para "/sales/"
@router.post("/sales/", response_model=schemas.Sale)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    db_sale = crud.create_sale(db, sale=sale)
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_sale

# ========== GERADOR DE DADOS FALSOS ==========
@router.post("/generate-fake-sales/")
def generate_fake_sales(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    if not products:
        return {"message": "Cadastre produtos antes de gerar vendas!"}

    for _ in range(50):  # Gera 50 vendas aleatórias
        product = random.choice(products)
        quantity = random.randint(1, 5)
        
        # Simula custo como 70% do preço (lucro de 30%)
        cost_price = product.price * 0.7 
        total_price = product.price * quantity
        profit = (product.price - cost_price) * quantity
        
        # Data aleatória nos últimos 365 dias
        days_ago = random.randint(0, 365)
        sale_date = datetime.utcnow() - timedelta(days=days_ago)

        fake_sale = models.Sale(
            product_id=product.id,
            quantity=quantity,
            total_price=total_price,
            profit=profit,
            date=sale_date
        )
        db.add(fake_sale)
    
    db.commit()  # ✅ MOVIDO PARA FORA DO LOOP
    return {"message": "50 vendas falsas geradas com sucesso!"}