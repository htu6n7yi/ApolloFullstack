from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
import csv
import io

router = APIRouter()

@router.post("/upload-csv/")
def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Verificar se é um CSV
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    # 2. Ler o conteúdo do arquivo
    content = file.file.read()
    
    # 3. Decodificar para string (utf-8) e preparar para leitura CSV
    try:
        decoded_content = content.decode("utf-8")
        csv_reader = csv.DictReader(io.StringIO(decoded_content), delimiter=',')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo: {str(e)}")

    products_added = 0
    errors = []

    # 4. Iterar sobre as linhas do CSV
    for index, row in enumerate(csv_reader):
        try:
            # Esperamos colunas: name, price, category
            name = row.get("name")
            price_str = row.get("price")
            category_name = row.get("category")

            if not name or not price_str or not category_name:
                continue # Pula linhas inválidas

            # Tratamento de Preço (converter "10.50" para float)
            price = float(price_str)

            # A. Verificar/Criar Categoria
            db_category = crud.get_category_by_name(db, category_name)
            if not db_category:
                # Cria a categoria se não existir
                new_cat = schemas.CategoryCreate(name=category_name, discount_percentage=0.0)
                db_category = crud.create_category(db, new_cat)
            
            # B. Criar Produto
            # Primeiro criamos o schema de entrada
            new_prod = schemas.ProductCreate(
                name=name,
                price=price,
                category_id=db_category.id
            )
            crud.create_product(db, new_prod)
            products_added += 1

        except Exception as e:
            errors.append(f"Linha {index + 1}: {str(e)}")

    return {
        "message": "Processamento concluído",
        "products_added": products_added,
        "errors": errors
    }