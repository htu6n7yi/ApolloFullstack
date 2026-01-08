# backend/app/main.py
from fastapi import FastAPI
from . import models
from .database import engine

# Isso cria as tabelas no banco de dados automaticamente
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API do Apollo Fullstack rodando!"}