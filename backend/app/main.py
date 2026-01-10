from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
# Importa todos os roteadores
from app.routers import products, uploads, sales

# Cria as tabelas no banco
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- Configuração do CORS (Obrigatório para o Front funcionar) ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Permite as origens listadas acima
    allow_credentials=True,
    allow_methods=["*"],   # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],   # Permite enviar JSON, Arquivos, etc.
)
# -------------------------------------------------------------

# Adiciona as rotas
app.include_router(products.router, tags=["products"])
app.include_router(uploads.router, tags=["uploads"])
app.include_router(sales.router, tags=["sales"])

@app.get("/")
def read_root():
    return {"message": "API do Apollo Fullstack rodando!"}