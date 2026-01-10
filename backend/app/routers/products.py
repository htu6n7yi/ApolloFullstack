from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db

# Cria o roteador. O prefixo '/products' significa que todas as rotas aqui começam assim.
router = APIRouter()

# --- Rotas de CATEGORIAS (Necessário criar antes do produto) ---

@router.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    # Verifica se já existe categoria com esse nome
    db_category = crud.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already registered")
    return crud.create_category(db=db, category=category)

@router.get("/categories/", response_model=List[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_categories(db)

# --- Rotas de PRODUTOS ---

@router.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    # Opcional: Verificar se a categoria existe antes de criar
    return crud.create_product(db=db, product=product)

@router.get("/products/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_products(db)

# ... imports anteriores

@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    # Verifica se categoria existe (opcional, mas recomendado)
    # Aqui assumimos que o crud.create_product já lida com isso
    return crud.create_product(db, product)