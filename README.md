# 🚀 Apollo Fullstack Project

> Sistema Fullstack de Gestão de Varejo com Dashboard Analítico, Controle de Estoque e PDV.

![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)
![Tech Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Tech Frontend](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)

---

## 📋 Sobre o Projeto

O **Apollo** é uma solução completa de gestão para estabelecimentos de varejo, oferecendo:

- **Dashboard Analítico** com KPIs e gráficos de desempenho em tempo real
- **Controle de Estoque** com cadastro manual e importação em massa via CSV
- **Sistema de Vendas (PDV)** com registro de transações e cálculo automático de lucro
- **Gestão de Categorias** para organização hierárquica de produtos

O sistema foi desenvolvido com tecnologias modernas, priorizando performance, escalabilidade e experiência do usuário.

---

## 📂 Documentação Detalhada

Este projeto está dividido em duas partes. Para detalhes de arquitetura, instalação passo a passo e guias de deploy, acesse os links abaixo:

### 👉 [Documentação do Backend (API)](./backend/README.md)
*Contém: Configuração do Banco de Dados, Swagger, Endpoints e tratamento de CSV.*

### 👉 [Documentação do Frontend (Interface)](./frontend/README.md)
*Contém: Configuração de componentes, Variáveis de Ambiente e Estrutura de Pastas.*

---

## ⚡ Quick Start (Como rodar agora)

Se você já tem Python e Node.js instalados, use os comandos abaixo para subir o projeto rapidamente.

### 1. Inicie o Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

A API ficará disponível em: `http://127.0.0.1:8000`

**Documentação interativa (Swagger):** `http://127.0.0.1:8000/docs`

### 2. Inicie o Frontend

Abra um novo terminal na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação em: `http://localhost:3000`

> **Nota:** Certifique-se de criar o arquivo `.env.local` na pasta frontend apontando para o backend:
> ```bash
> NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
> ```

---

## 🛠️ Tecnologias Principais

### Backend
- **Python 3.11+** - Linguagem base
- **FastAPI** - Framework web moderno e de alta performance
- **SQLAlchemy** - ORM para manipulação do banco de dados
- **SQLite** - Banco de dados relacional (pronto para migração para PostgreSQL)
- **Pydantic** - Validação de dados e serialização
- **Uvicorn** - Servidor ASGI de alta performance

### Frontend
- **TypeScript** - JavaScript tipado para maior segurança
- **Next.js 15** - Framework React com App Router
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Biblioteca de componentes acessíveis
- **Recharts** - Biblioteca para gráficos e visualizações
- **Axios** - Cliente HTTP para comunicação com a API
- **Lucide React** - Biblioteca de ícones moderna

---

## 📊 Arquitetura do Sistema

```
apollo-smartmart/
├── backend/                    # API e Lógica de Negócio
│   ├── app/
│   │   ├── main.py            # Ponto de entrada da aplicação
│   │   ├── database.py        # Configuração do banco de dados
│   │   ├── models.py          # Modelos SQLAlchemy
│   │   ├── schemas.py         # Schemas Pydantic
│   │   └── routers/           # Endpoints da API
│   ├── requirements.txt       # Dependências Python
│   └── README.md             # Documentação do Backend
│
└── frontend/                  # Interface do Usuário
    ├── app/                   # Rotas do Next.js
    │   ├── page.tsx          # Dashboard
    │   ├── products/         # Gestão de Produtos
    │   ├── sales/            # Gestão de Vendas
    │   └── categories/       # Gestão de Categorias
    ├── components/            # Componentes React
    ├── lib/                   # Utilitários e configurações
    └── README.md             # Documentação do Frontend
```

---

## ✨ Funcionalidades

### 📊 Dashboard
- Visualização de KPIs (Faturamento, Lucro, Total de Produtos)
- Gráficos de desempenho de vendas mensais
- Métricas atualizadas em tempo real

### 📦 Gestão de Produtos
- Listagem com busca e filtros
- Cadastro manual de produtos
- Importação em massa via CSV
- Vinculação automática com categorias

### 💰 Gestão de Vendas
- Histórico completo de transações
- Registro manual de vendas
- Importação de histórico via CSV
- Cálculo automático de lucro (margem 30%)

### 🏷️ Gestão de Categorias
- Visualização de departamentos
- Correção de nomes via upload
- Organização hierárquica

---

## 🔧 Requisitos do Sistema

- **Python** 3.11 ou superior
- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **Git** para controle de versão

---

## 📝 Licença

Desenvolvido como parte de um desafio técnico fullstack.

MIT License - Sinta-se livre para usar como base para estudos e projetos.

---

## 📧 Contato

Desenvolvido por José Carlos Cavalcanti (htu6n7yi)
