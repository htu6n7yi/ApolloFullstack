# 🚀 Apollo Fullstack Project

O **Apollo** é um sistema completo de gestão de vendas e estoque, composto por uma API robusta em Python e um Dashboard interativo em React/Next.js.

---

## 📂 Estrutura do Projeto

O projeto é dividido em dois módulos principais:

### 1. [Backend (API)](./backend)
Responsável pela lógica de negócios, banco de dados e processamento de arquivos.
- **Tecnologias:** Python, FastAPI, SQLAlchemy, SQLite.
- **Funcionalidades:** Upload de CSV, Gestão de Vendas, Analytics.

👉 **[Ver documentação do Backend](./backend/README.md)**

### 2. [Frontend (Dashboard)](./frontend)
Interface visual para análise de dados e upload de arquivos.
- **Tecnologias:** React, Next.js, ShadcnUI, Recharts.
- **Funcionalidades:** Gráficos interativos, KPIs, Upload Drag-and-drop.

👉 **[Ver documentação do Frontend](./frontend/README.md)** (Em breve)

---

## ⚡ Quick Start (Rodando tudo)

Para rodar o projeto completo, você precisará de dois terminais abertos:

**Terminal 1 (Backend):**
```bash
cd backend
# Ative seu venv
python -m uvicorn app.main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

O projeto estará acessível em:
- Frontend: http://localhost:3000
- Backend: http://127.0.0.1:8000

---

## 📝 Observações

Certifique-se de ter todas as dependências instaladas antes de executar o projeto. Consulte a documentação específica de cada módulo para mais detalhes sobre instalação e configuração.
