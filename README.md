# 🚀 Apollo Fullstack

Sistema completo de gestão para varejo desenvolvido com **FastAPI** (backend) e **Next.js** (frontend). Uma solução moderna e intuitiva para controle de estoque, vendas e análise de desempenho comercial.

---

## 📸 Preview

<p align="center">
  <img src="./screenshots/dashboard.jpeg" alt="Dashboard" width="800"/>
</p>

<p align="center">
  <img src="./screenshots/products.jpeg" alt="Produtos" width="800"/>
</p>

<p align="center">
  <img src="./screenshots/sales.jpeg" alt="Vendas" width="800"/>
</p>

---

## 🎯 Sobre o Projeto

Sistema de gestão completo para varejo com interface moderna e API robusta. Desenvolvido para demonstrar integração fullstack entre FastAPI e Next.js com funcionalidades reais de um sistema comercial.

---

## ✨ Funcionalidades Principais

### 📊 Dashboard Analítico
- KPIs em tempo real (faturamento, lucro e estoque)
- Gráficos interativos de vendas mensais
- Métricas estratégicas para tomada de decisão

### 📦 Gestão de Produtos
- Listagem com busca e filtros por categoria
- Cadastro e **edição inline** de produtos
- **Importação em massa** via CSV
- **Exportação de dados** para relatórios
- Paginação automática (15 itens por página)

### 💰 Gestão de Vendas
- Registro de vendas com cálculo automático de lucro
- **Edição de vendas** (quantidade, valores, data)
- Histórico completo ordenado por data
- **Importação/Exportação CSV** para migração de dados

### 🏷️ Categorias
- Organização hierárquica de produtos
- Correção em massa via upload de arquivo
- Vinculação automática com produtos

### 📁 Importação/Exportação
- Upload de CSV com interface drag-and-drop
- Download de relatórios completos
- Validação automática de dados
- Feedback visual de progresso

---

## 🏗️ Arquitetura

```
Apollo Fullstack/
│
├── backend/           # API REST com FastAPI + SQLite
│   └── README.md     # 📘 Documentação do Backend
│
├── frontend/          # Interface com Next.js + TypeScript
│   └── README.md     # 📗 Documentação do Frontend
│
└── screenshots/       # Capturas de tela
```

**📚 Documentação Detalhada:**
- **[Backend](./backend/README.md)** - Endpoints, modelos, rotas e configuração da API
- **[Frontend](./frontend/README.md)** - Componentes, páginas, UI/UX e instalação

---

## 🚀 Stack Tecnológica

### Backend
- **FastAPI** - Framework web de alta performance
- **SQLAlchemy** - ORM para Python
- **SQLite** - Banco de dados
- **Pydantic** - Validação de dados

### Frontend
- **Next.js 15** - Framework React (App Router)
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interativos

---

## ⚙️ Como Executar

### Pré-requisitos
- Python 3.8+
- Node.js 18+

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
✅ API rodando em `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```
✅ Interface rodando em `http://localhost:3000`

---

## 📊 Principais Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products/` | Lista produtos |
| POST | `/products/` | Cria produto |
| PUT | `/{product_id}` | Atualiza produto |
| GET | `/sales/` | Lista vendas |
| POST | `/sales/` | Registra venda |
| PUT | `/sales/{id}` | Atualiza venda |
| GET | `/export/products` | Exporta produtos CSV |
| GET | `/export/sales` | Exporta vendas CSV |
| POST | `/upload-csv/` | Importa produtos CSV |
| POST | `/upload-sales-csv/` | Importa vendas CSV |
| GET | `/dashboard-stats/` | Estatísticas dashboard |

📚 **Documentação completa:** `http://localhost:8000/docs`

---

## 📱 Responsividade

Sistema 100% responsivo:
- 📱 **Mobile** - Layout em coluna, menu hamburguer
- 💻 **Tablet** - Layout adaptativo
- 🖥️ **Desktop** - Sidebar fixa, layout completo

---

## 🎨 Diferenciais

- ✅ **Edição inline** - altere dados sem modais desnecessários
- ✅ **Import/Export CSV** - migração e backup simplificados
- ✅ **Cálculos automáticos** - lucro e totais sem erro manual
- ✅ **Validação robusta** - dados consistentes em toda aplicação
- ✅ **UI moderna** - interface limpa e profissional
- ✅ **Mobile-first** - funciona perfeitamente em qualquer tela

---

## 📄 Licença

Este projeto está sob a licença MIT. Livre para uso em projetos pessoais e comerciais.

---

**⭐ Gostou do projeto? Deixe uma estrela no repositório!**