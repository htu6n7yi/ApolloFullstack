# Apollo Fullstack API 🚀

API desenvolvida em **Python (FastAPI)** para o gerenciamento de produtos e vendas do projeto Apollo. O sistema alimenta um Dashboard de BI, suportando cargas massivas via CSV, cadastros manuais e cálculo automático de lucros.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** Python 3.10+
- **Framework Web:** FastAPI
- **Banco de Dados:** SQLite (via SQLAlchemy)
- **Servidor:** Uvicorn
- **Validação de Dados:** Pydantic
- **Upload de Arquivos:** python-multipart
- **Processamento CSV:** Biblioteca nativa `csv`
- **CORS:** Habilitado para integração com frontend

---

## ⚙️ Funcionalidades Principais

### 1. Gestão de Produtos 📦

- **Listagem de Produtos:** Visualização de todos os produtos cadastrados com informações detalhadas (nome, preço, categoria).
- **Cadastro Manual:** Criação unitária de produtos via requisição JSON.
- **Carga Massiva (CSV):** Importação de grandes volumes de produtos através de arquivo `.csv` com detecção automática de separadores (vírgula ou ponto-e-vírgula).

### 2. Gestão de Vendas 💰

- **Listagem Detalhada:** Histórico completo de vendas com informações de produto, quantidade, valores e datas.
- **Venda Manual:** Registro unitário de vendas com cálculo automático do valor total e lucro estimado (30%).
- **Importação de Histórico (CSV):** Carga de vendas passadas através de arquivo CSV.
- **Gerador de Dados Falsos:** Criação automática de vendas para testes de carga e visualização do dashboard.

### 3. Dashboard Analytics 📊

- **Endpoint Exclusivo:** `/dashboard-stats` retorna dados agregados para alimentar o BI.
- **KPIs Principais:** Total de Vendas, Lucro Líquido e Quantidade de Produtos.
- **Agrupamento Temporal:** Dados organizados por mês para geração de gráficos de evolução.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter o **Python 3.10+** instalado na sua máquina.

### Passo 1: Configurar o Ambiente

No terminal, dentro da pasta `backend`:

#### 1. Crie o ambiente virtual:
```bash
python -m venv venv
```

#### 2. Ative o ambiente virtual:

**Windows:**
```bash
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 3. Instale as dependências:
```bash
pip install -r requirements.txt
```

### Passo 2: Rodar o Servidor

Execute o comando abaixo para iniciar a API em modo de desenvolvimento (com reload automático):

```bash
python -m uvicorn app.main:app --reload
```

O servidor estará rodando em: **http://127.0.0.1:8000**

---

## 📖 Documentação da API

O FastAPI gera documentação automática e interativa. Com o servidor rodando, acesse:

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc

---

## 📡 Endpoints Disponíveis

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/products/` | Lista todos os produtos cadastrados |
| POST | `/products/` | Cria um produto manualmente via JSON |
| POST | `/upload-csv/` | Faz upload de CSV para cadastro em massa |

### Vendas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/sales/` | Lista todas as vendas com detalhes |
| POST | `/sales/` | Registra uma venda manual (cálculo automático) |
| POST | `/upload-sales-csv/` | Importa histórico de vendas via CSV |
| POST | `/generate-fake-sales/` | Gera vendas aleatórias para testes |

### Dashboard

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/dashboard-stats/` | Retorna KPIs e dados agregados para gráficos |

---

## 📂 Modelos de Arquivos CSV

O sistema é robusto e aceita arquivos com separadores **vírgula (`,`)** ou **ponto-e-vírgula (`;`)**. Os cabeçalhos não diferenciam maiúsculas de minúsculas.

### 1. Produtos (`/upload-csv/`)

**Colunas esperadas:** `name`, `price`, `category` (ou `category_id`)

**Exemplo:**
```csv
name,price,category
Notebook Dell,3500.00,Eletronicos
Mesa de Escritorio,800.00,Moveis
Camiseta Dev,80.00,Roupas
```

### 2. Vendas (`/upload-sales-csv/`)

**Colunas esperadas:** `product_id`, `quantity`, `total_price`, `date`

**Exemplo:**
```csv
product_id,quantity,total_price,date
1,10,35000.00,2025-01-15
2,5,4000.00,2025-02-20
```

**Observações:**
- Se `total_price` não for enviado, o sistema calcula automaticamente baseado no preço do produto.
- Se `date` não for enviada, o sistema assume a data atual.

---

## 🗂 Estrutura do Projeto

```
backend/
├── app/
│   ├── routers/
│   │   ├── products.py    # Rotas de gerenciamento de produtos
│   │   ├── sales.py       # Rotas de vendas e dashboard
│   │   └── uploads.py     # Lógica de processamento de CSV
│   ├── crud.py            # Regras de negócio e acesso ao banco
│   ├── models.py          # Modelos do banco de dados (SQLAlchemy)
│   ├── schemas.py         # Schemas de validação (Pydantic)
│   ├── database.py        # Configuração do SQLite
│   ├── data/
│   │   └── models.py
│   └── main.py            # Aplicação principal e configuração CORS
├── app.db                 # Banco de dados SQLite (gerado automaticamente)
├── requirements.txt       # Dependências do Python
└── README.md              # Documentação do projeto
```

---

## 📝 Notas Importantes

- O banco de dados `app.db` é criado automaticamente na primeira execução.
- As vendas calculam automaticamente um lucro estimado de 30% sobre o preço do produto.
- O sistema suporta CORS para integração com frontends hospedados em diferentes domínios.
- Os uploads de CSV fazem validação automática dos dados antes da inserção no banco.

---


**Desenvolvido por José Carlos Cavalcanti**