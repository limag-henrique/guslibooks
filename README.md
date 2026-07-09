# Gusli Books

Olá! Seja bem-vindo ao repositório do Gusli Books!

Este projeto foi inteiramente gerado com o auxílio de inteligência artificial generativa (Antigravity, do Google --> Modelo Gemini 3.1 Pro). O tempo necessário para a finalização, ajustes e testes foi de aproximadamente 14 horas.

Para acessar sem demora, basta acessar em: [Gusli Books - Render](https://gusli-books.onrender.com/)

Por curiosidade, os 65 livros são livros que li/estou lendo/lerei, então considere-os como uma possível sugestão de leitura real ;)

## Obter o Projeto localmente

Antes de tudo, você precisa ter os arquivos do projeto na sua máquina. Existem duas formas:

- **Download do ZIP:** Acesse o repositório no GitHub, clique em **Code → Download ZIP** e extraia o conteúdo em uma pasta de sua preferência.
- **Via branch do GitHub:** Se preferir, clone o repositório ou trabalhe diretamente a partir de uma branch existente:
  ```bash
  git clone https://github.com/limag-henrique/dti.git
  cd dti
  ```

---

## Pré-requisitos

Certifique-se de que você possui o node.js instalado:
- Node.js: (versão 18 ou superior --> Para verificar, digite `node -v`)

- Caso não o tenha (Erro de comando não encontrado), baixe-o em: [Node.js](https://nodejs.org/pt-br/download)
- Se estiver com algum erro de permissão, execute: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## Backend

O backend é construído em Node.js usando Express, e utiliza o SQLite como banco de dados.

### Como rodar o servidor

1. Abra um terminal e navegue até a pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Se for a sua primeira vez rodando o projeto e precisar popular o banco de dados inicial (com produtos fictícios e configurações do carrinho), rode o script de _seed_:
   ```bash
   node seed.js
   ```

4. Inicie o servidor:
   ```bash
   node server.js
   ```
   *O servidor será iniciado na porta 3001 (http://localhost:3001).*

---

## Frontend

O frontend é construído com React e Vite, estilizado com Tailwind CSS. 

### Como iniciar a aplicação

1. Abra um **novo** terminal (mantenha o terminal do backend rodando) e vá para a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. **Acesse o site:** Abra seu navegador e acesse [http://localhost:5173](http://localhost:5173).

---

## Premissas

1. O foco é divulgar as obras literárias de impressão humanizada num aspecto editorial para o consumidor. O site foi desenhado para incentivar descobertas e navegação casual (materializado pelo botão de obras aleatórias, exibição cinemática de detalhes, separação minimalista)
2. Para o Proof-of-Concept, a loja não possui gateways de pagamentos diretos. O sistema captura a intenção de compra, cadastra o pedido, notifica a gerência por e-mail e informa virtualmente ao usuário que a equipe da Gusli entrará em contato com ele em breve com as faturas.
3. O frete não é contabilizado no total do carrinho. 

---

## Documentação da API (Backend)

### Principais Arquivos
- **`server.js`**: Ponto de entrada do backend. Escuta na porta `3001`, configura o CORS, define o transporte de e-mails (Nodemailer) e estabelece todas as rotas (Endpoints) da API.
- **`database.sqlite`**: Banco de dados relacional gerado localmente que armazena Usuários, Produtos, Pedidos e Itens do Carrinho.
- **`seed.js`**: Script utilitário executado uma única vez para popular as tabelas do SQLite com o catálogo inicial de livros e seus respectivos metadados (preço, gênero, autor, etc.).
