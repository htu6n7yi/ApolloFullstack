from fastapi import FastAPI
from app import models
from app.database import engine
from app.routers import products

# Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Inclui as rotas que acabamos de criar
app.include_router(products.router, tags=["products"])

@app.get("/")
def read_root():
    return {"message": "API do Apollo Fullstack rodando!"}