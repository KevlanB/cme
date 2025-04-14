# CME - Central de Materiais e Esterilização

## Descrição

Este sistema tem como objetivo ajudar no controle dos materiais hospitalares, facilitando o processo de esterilização dos equipamentos e garantindo as etapas que um material deve percorrer para ser utilizado sejam seguidas corretamente.


## Funcionalidades

- Cadastro de materiais
- Controle de etapas (Recebimento, Lavagem, Esterilização, Distribuição)
- Geração automática de serial
- Controle de usuários
- Rastreabilidade de material


## Tecnologias Utilizadas

### Back-end
- Python
- FastAPI
- PostgreSQL

### Front-end
- React
- Vite
- HeroUI
- TailwindCSS

### Banco de Dados
- PostgreSQL

### Contêinerização
- Docker


## Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/usuario/projeto.git

2. Crie os arquivos .env tanto no diretório do Back-end quanto no diretório do Front-end com as variáveis necessárias:

- No Back-end: DATABASE_URL
- No Front-end: VITE_API_URL

3. Execute o comando abaixo para rodar o projeto:
   ```bash
   docker-compose up --build

### Acesso ao sistema

- Adicionei um init.db para o docker inserir alguns dados iniciais:

1. Etapas (4 postos, podendo acrescentar mais)
2. Usuário Admin | senha: Admin
3. Funções (Administrativo, Técnico, Enfermagem)

## Variáveis de Ambiente

### Back-end
- `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL.

### Front-end
- `VITE_API_URL`: URL base da API.


## Documentação da API

A documentação da API pode ser acessada através do **Swagger** integrado ao FastAPI, acessando a URL:  
`http://localhost:8000/docs`


## Autor

Kevlan Betto dos Santos Costa  
[LinkedIn](https://www.linkedin.com/in/kevlanc/)

## Licença

Este projeto está licenciado sob a **Licença Proprietária**. Todos os direitos reservados.
