from fastapi import FastAPI
from app import models
from app.database import engine
# Agora importamos 'uploads' no plural
from app.routers import products, uploads 

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(products.router, tags=["products"])
# Incluímos o roteador 'uploads'
app.include_router(uploads.router, tags=["uploads"]) 

@app.get("/")
def read_root():
    return {"message": "API do Apollo Fullstack rodando!"}