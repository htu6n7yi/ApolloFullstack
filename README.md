# Apollo Fullstack Challenge

Projeto desenvolvido com FastAPI (Backend) e Next.js (Frontend).

## 🚀 Como rodar localmente

### Pré-requisitos
- Python 3.10+
- Node.js 18+

### 1. Backend (API)
```bash
cd backend
# Windows
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# O Swagger estará em: http://localhost:8000/docs