from sqlalchemy.orm import Session
from app import models, schemas

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