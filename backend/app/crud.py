from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy import func

# --- CRUD de Categorias ---
def get_category_by_name(db: Session, name: str):
    return db.query(models.Category).filter(models.Category.name == name).first()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(
        name=category.name, 
        discount_percentage=category.discount_percentage
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session):
    return db.query(models.Category).all()

# --- CRUD de Produtos ---
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name, 
        price=product.price, 
        category_id=product.category_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session):
    return db.query(models.Product).all()

# --- CRUD de Estatísticas (Dashboard) ---
def get_dashboard_stats(db: Session):
    # 1. Totais Gerais
    total_products = db.query(func.count(models.Product.id)).scalar()
    
    # Soma do valor total de vendas (trata None como 0)
    total_sales_value = db.query(func.sum(models.Sale.total_price)).scalar() or 0.0
    
    # Soma do lucro total
    total_profit = db.query(func.sum(models.Sale.profit)).scalar() or 0.0

    # 2. Dados para o Gráfico (Agrupado por Mês)
    # Formato da data no SQLite: '%Y-%m' (Ano-Mês)
    sales_by_month = db.query(
        func.strftime('%Y-%m', models.Sale.date).label('month'),
        func.sum(models.Sale.total_price).label('total_sales'),
        func.sum(models.Sale.profit).label('profit')
    ).group_by('month').order_by('month').all()

    # Formatar para o Schema
    chart_data = []
    for row in sales_by_month:
        chart_data.append({
            "date": row.month,
            "total_sales": row.total_sales,
            "profit": row.profit
        })

    return {
        "total_products": total_products,
        "total_sales_value": total_sales_value,
        "total_profit": total_profit,
        "chart_data": chart_data
    }