from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import get_db
import csv
import io
from datetime import datetime

router = APIRouter()

# --- ROTA 1: UPLOAD DE CATEGORIAS ---
@router.post("/upload-categories-csv/")
def upload_categories_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    content = file.file.read()
    
    try:
        decoded_content = content.decode("utf-8")
        # Detecta delimitador
        delimiter = ";" if decoded_content.count(";") > decoded_content.count(",") else ","
        csv_file = io.StringIO(decoded_content)
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        
        # Normaliza cabeçalhos
        if csv_reader.fieldnames:
            csv_reader.fieldnames = [name.strip().lower() for name in csv_reader.fieldnames]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo: {str(e)}")

    updated_count = 0
    created_count = 0
    errors = []

    for index, row in enumerate(csv_reader):
        try:
            cat_id = row.get("id")
            name = row.get("name")
            discount = row.get("discount_percentage", 0.0)

            if not cat_id or not name:
                continue

            # Busca categoria existente
            category = db.query(models.Category).filter(models.Category.id == int(cat_id)).first()

            if category:
                category.name = name
                updated_count += 1
            else:
                new_category = models.Category(
                    id=int(cat_id),
                    name=name,
                    discount_percentage=float(discount)
                )
                db.add(new_category)
                created_count += 1

        except Exception as e:
            errors.append(f"Linha {index + 1}: Erro: {str(e)}")

    db.commit()

    return {
        "message": "Categorias processadas",
        "created": created_count,
        "updated": updated_count,
        "errors": errors
    }


# --- ROTA 2: UPLOAD DE PRODUTOS ---
@router.post("/upload-csv/")
def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    content = file.file.read()
    
    try:
        decoded_content = content.decode("utf-8")
        delimiter = ";" if decoded_content.count(";") > decoded_content.count(",") else ","
        csv_file = io.StringIO(decoded_content)
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        
        if csv_reader.fieldnames:
            csv_reader.fieldnames = [name.strip().lower() for name in csv_reader.fieldnames]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo: {str(e)}")

    products_added = 0
    errors = []

    for index, row in enumerate(csv_reader):
        try:
            name = row.get("name")
            price_str = row.get("price")
            category_id = row.get("category_id")
            category_name = row.get("category")

            if not name or not price_str:
                errors.append(f"Linha {index+1}: Nome ou preço faltando.")
                continue

            clean_price = str(price_str).replace("R$", "").strip().replace(".", "").replace(",", ".")
            price = float(clean_price)

            final_category_id = None
            
            if category_id:
                cat_id_int = int(category_id)
                db_category = db.query(models.Category).filter(models.Category.id == cat_id_int).first()
                if not db_category:
                    # Cria categoria placeholder (nome = ID) para ser corrigida depois
                    new_cat = models.Category(id=cat_id_int, name=str(cat_id_int), discount_percentage=0.0)
                    db.add(new_cat)
                    db.commit()
                    db.refresh(new_cat)
                    final_category_id = new_cat.id
                else:
                    final_category_id = db_category.id
            
            elif category_name:
                db_category = crud.get_category_by_name(db, category_name)
                if not db_category:
                    new_cat = schemas.CategoryCreate(name=category_name, discount_percentage=0.0)
                    db_cat_obj = crud.create_category(db, new_cat)
                    final_category_id = db_cat_obj.id
                else:
                    final_category_id = db_category.id

            if not final_category_id:
                errors.append(f"Linha {index+1}: Categoria não identificada.")
                continue

            new_prod = schemas.ProductCreate(
                name=name,
                price=price,
                category_id=final_category_id
            )
            crud.create_product(db, new_prod)
            products_added += 1

        except Exception as e:
            errors.append(f"Linha {index + 1}: Erro: {str(e)}")

    return {
        "message": "Processamento de produtos concluído",
        "products_added": products_added,
        "errors": errors
    }


# --- ROTA 3: UPLOAD DE VENDAS ---
@router.post("/upload-sales-csv/")
def upload_sales_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    content = file.file.read()
    
    try:
        decoded_content = content.decode("utf-8")
        delimiter = ";" if decoded_content.count(";") > decoded_content.count(",") else ","
        csv_file = io.StringIO(decoded_content)
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        
        if csv_reader.fieldnames:
            csv_reader.fieldnames = [name.strip().lower() for name in csv_reader.fieldnames]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo: {str(e)}")

    sales_added = 0
    errors = []

    for index, row in enumerate(csv_reader):
        try:
            p_id = row.get("product_id")
            qtd = row.get("quantity")
            price = row.get("total_price")
            date_str = row.get("date")

            if not p_id or not qtd:
                continue 

            product_id = int(p_id)
            db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
            
            if not db_product:
                errors.append(f"Linha {index + 1}: Produto ID {product_id} não encontrado.")
                continue

            quantity = int(float(qtd))
            total_price = float(price) if price else (db_product.price * quantity)
            profit = total_price * 0.30 

            # Processamento de Data
            sale_date = datetime.utcnow()
            if date_str:
                for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
                    try:
                        sale_date = datetime.strptime(date_str, fmt)
                        break
                    except ValueError:
                        pass

            new_sale = models.Sale(
                product_id=product_id,
                quantity=quantity,
                total_price=total_price,
                profit=profit,
                date=sale_date
            )
            db.add(new_sale)
            sales_added += 1

        except Exception as e:
            errors.append(f"Linha {index + 1}: Erro: {str(e)}")

    db.commit()

    return {
        "message": "Importação de vendas concluída",
        "sales_added": sales_added,
        "errors": errors
    }