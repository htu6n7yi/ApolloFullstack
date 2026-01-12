from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy import func
from datetime import datetime  # ← ADICIONE ESTA LINHA

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

# --- CRUD de Vendas ---
def create_sale(db: Session, sale: schemas.SaleCreate):
    """
    Cria uma venda calculando automaticamente:
    - total_price = preço do produto × quantidade
    - profit = 30% do total_price
    """
    # 1. Busca o produto para obter o preço
    product = db.query(models.Product).filter(models.Product.id == sale.product_id).first()
    
    if not product:
        # Produto não encontrado
        return None

    # 2. Calcula valores automaticamente
    total_price = product.price * sale.quantity
    profit = total_price * 0.30  # Margem de lucro de 30%

    # 3. Usa a data fornecida ou a data atual
    sale_date = sale.date if hasattr(sale, 'date') and sale.date else datetime.utcnow()

    # 4. Cria a venda
    db_sale = models.Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        total_price=total_price,
        profit=profit,
        date=sale_date
    )
    
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def get_sales(db: Session, skip: int = 0, limit: int = 100):
    """Lista todas as vendas com paginação"""
    return db.query(models.Sale).offset(skip).limit(limit).all()

# --- CRUD de Estatísticas (Dashboard) ---
def get_dashboard_stats(db: Session):
    """
    Retorna estatísticas do dashboard:
    - Total de produtos cadastrados
    - Valor total de vendas
    - Lucro total
    - Dados agrupados por mês para gráficos
    """
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

    # 3. Formatar dados do gráfico
    chart_data = []
    for row in sales_by_month:
        chart_data.append({
            "date": row.month,
            "total_sales": float(row.total_sales or 0),
            "profit": float(row.profit or 0)
        })

    return {
        "total_products": total_products,
        "total_sales_value": float(total_sales_value),
        "total_profit": float(total_profit),
        "chart_data": chart_data
    }

def update_product(db: Session, product_id: int, product_data: schemas.ProductCreate):
    # 1. Busca o produto no banco
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    # 2. Se não achar, retorna None (para o router lançar erro 404)
    if not db_product:
        return None

    # 3. Atualiza os campos
    # Transformamos os dados recebidos em dicionário e atualizamos o objeto do banco
    for key, value in product_data.dict().items():
        setattr(db_product, key, value)

    # 4. Salva as mudanças
    db.commit()
    db.refresh(db_product)
    return db_product