# Estrutura do Projeto

```text
meu-projeto/
├── backend/
│   ├── app/
│   │   ├── main.py          # Ponto de entrada do FastAPI
│   │   ├── models.py        # Tabelas do Banco de Dados (ORM)
│   │   ├── schemas.py       # Modelos Pydantic para validação (I/O)
│   │   ├── crud.py          # Lógica de acesso ao DB (Create, Read, Update, Delete)
│   │   └── routers/         # Endpoints da API (products, sales, uploads)
│   ├── requirements.txt     # Dependências do Python
│   └── data/                # Pasta temporária para processamento de CSVs
├── frontend/
│   ├── app/                 # Next.js App Router (páginas)
│   ├── components/
│   │   ├── ui/              # Componentes reutilizáveis (shadcn/ui)
│   │   ├── Dashboard.tsx    # Componentes de visualização (Gráficos)
│   │   └── ProductForm.tsx  # Formulários
│   ├── lib/                 # Funções auxiliares (configuração do Axios/Fetch)
│   └── package.json         # Dependências do Node.js
└── README.md                # Documentação do projeto
