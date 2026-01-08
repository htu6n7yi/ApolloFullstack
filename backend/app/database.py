# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Cria um arquivo de banco de dados chamado "app.db" na raiz
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

# check_same_thread=False é necessário apenas para SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependência para pegar a sessão do DB em cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()