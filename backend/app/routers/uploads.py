from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models  # <--- O erro estava faltando importar 'models' aqui
from app.database import get_db
import csv
import io
from datetime import datetime

router = APIRouter()

# --- ROTA 1: UPLOAD DE PRODUTOS ---
@router.post("/upload-csv/")
def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    content = file.file.read()
    
    try:
        decoded_content = content.decode("utf-8")
        
        # Detector de Separador
        if decoded_content.count(";") > decoded_content.count(","):
            delimiter = ";"
        else:
            delimiter = ","
            
        csv_file = io.StringIO(decoded_content)
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        
        # Normalização de Cabeçalhos
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
            # Tenta 'category' ou 'category_id'
            category_name = row.get("category") or row.get("category_id")

            if not name or not price_str or not category_name:
                missing = []
                if not name: missing.append("name")
                if not price_str: missing.append("price")
                if not category_name: missing.append("category")
                
                if missing:
                    errors.append(f"Linha {index + 1}: Dados faltando: {', '.join(missing)}")
                continue 

            clean_price = str(price_str).replace("R$", "").strip().replace(".", "").replace(",", ".")
            price = float(clean_price)

            db_category = crud.get_category_by_name(db, category_name)
            if not db_category:
                new_cat = schemas.CategoryCreate(name=category_name, discount_percentage=0.0)
                db_category = crud.create_category(db, new_cat)
            
            new_prod = schemas.ProductCreate(
                name=name,
                price=price,
                category_id=db_category.id
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


# --- ROTA 2: UPLOAD DE VENDAS (Seu CSV específico) ---
@router.post("/upload-sales-csv/")
def upload_sales_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    content = file.file.read()
    
    try:
        decoded_content = content.decode("utf-8")
        
        # Detector de Separador
        if decoded_content.count(";") > decoded_content.count(","):
            delimiter = ";"
        else:
            delimiter = ","
            
        csv_file = io.StringIO(decoded_content)
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        
        # Normalizar cabeçalhos
        if csv_reader.fieldnames:
            csv_reader.fieldnames = [name.strip().lower() for name in csv_reader.fieldnames]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo: {str(e)}")

    sales_added = 0
    errors = []

    for index, row in enumerate(csv_reader):
        try:
            # Ler colunas do seu CSV (id, product_id, quantity, total_price, date)
            p_id = row.get("product_id")
            qtd = row.get("quantity")
            price = row.get("total_price")
            date_str = row.get("date")

            if not p_id or not qtd:
                continue 

            # Verificar se o produto existe no banco
            product_id = int(p_id)
            db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
            
            if not db_product:
                errors.append(f"Linha {index + 1}: Produto ID {product_id} não encontrado. Cadastre-o primeiro.")
                continue

            quantity = int(float(qtd))
            total_price = float(price) if price else 0.0

            # Calcular Lucro Estimado (30%)
            profit = total_price * 0.30 

            # Tratar Data
            sale_date = datetime.utcnow()
            if date_str:
                try:
                    sale_date = datetime.strptime(date_str, "%Y-%m-%d")
                except:
                    try:
                        sale_date = datetime.strptime(date_str, "%d/%m/%Y")
                    except:
                        pass 

            # Salvar usando models.Sale (agora importado corretamente)
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