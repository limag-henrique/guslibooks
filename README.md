# Gusli Books

> [!NOTE]  
> Olá! Seja bem-vindo ao repositório do Gusli Books!

Este projeto foi inteiramente gerado por inteligência artificial (Antigravity, do Google), dada a minha falta de conhecimento técnico para codificá-lo do zero. O tempo necessário para a finalização, ajustes e testes foi de aproximadamente 13 horas.

Os prompts foram formulados a partir da experiência prática do usuário e dos requisitos do projeto. Para fins de organização, separei os prompts de comando e deixei uma mensagem especial para você, avaliador, na página: [dti_prompts](https://limag-henrique.github.io/dti_prompts/).

## Pré-requisitos

Certifique-se de que você possui as seguintes ferramentas instaladas:
- **Node.js**: (versão 18 ou superior --> Para verificar, digite node -v)
- **npm**: (gerenciador de pacotes do Node --> Para verificar, digite npm -v)

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

## Documentação da API (Backend)

### Principais Arquivos
- **`server.js`**: Ponto de entrada do backend. Escuta na porta `3001`, configura o CORS, define o transporte de e-mails (Nodemailer) e estabelece todas as rotas (Endpoints) da API.
- **`database.sqlite`**: Banco de dados relacional gerado localmente que armazena Usuários, Produtos, Pedidos e Itens do Carrinho.
- **`seed.js`**: Script utilitário executado uma única vez para popular as tabelas do SQLite com o catálogo inicial de livros e seus respectivos metadados (preço, gênero, autor, etc.).

### Endpoints (Rotas da API)

#### Produtos e Catálogo
- `GET /api/products`
  - **Função:** Retorna o array completo de todos os livros cadastrados na loja.
- `GET /api/products/:id`
  - **Função:** Retorna os detalhes de um livro específico com base em seu ID. Retorna erro 404 se não for encontrado.

#### Gerenciamento de Carrinho (Sessão Global)
- `GET /api/cart`
  - **Função:** Retorna todos os itens atualmente no carrinho global do banco de dados.
- `POST /api/cart`
  - **Função:** Adiciona um novo livro ao carrinho. Se o item já existir, incrementa a sua quantidade.
- `PUT /api/cart/:id`
  - **Função:** Atualiza a quantidade de um item específico dentro do carrinho (ex: adicionar mais +1 unidade).
- `DELETE /api/cart/:id`
  - **Função:** Remove um item específico do carrinho através do seu ID.
- `DELETE /api/cart`
  - **Função:** Limpa completamente a tabela do carrinho (utilizado após conclusão de pedidos ou limpeza manual).

#### Check-out e Pedidos
- `POST /api/checkout`
  - **Função:** Processa o formulário final de compra. 
  - **Lógica:** Recebe os dados pessoais do cliente e os itens do carrinho. O sistema salva o pedido no banco de dados com o status *"Aguardando Pagamento"* e utiliza o **Nodemailer** e o SMTP do Gmail para disparar **dois e-mails simultâneos**:
    1. Notificação HTML detalhada para o Administrador da loja.
    2. E-mail de confirmação em texto puro para o cliente.
  - O carrinho é esvaziado automaticamente após o envio da requisição com sucesso.

#### Usuários e Autenticação (Simulada)
- `POST /api/register`
  - **Função:** Cria um novo usuário no banco de dados encriptando a senha fornecida utilizando `bcrypt`.
- `POST /api/login`
  - **Função:** Autentica um usuário existente verificando a senha com o `bcrypt`.
- `GET /api/user/:id/orders`
  - **Função:** Retorna o histórico de pedidos amarrado ao ID do usuário autenticado.
- `DELETE /api/user/:id`
  - **Função:** Exclui permanentemente a conta do usuário e os seus dados.

---

## Premissas

1. O foco divulgar as obras literárias de impressão humanizada num aspecto editorial para o consumidor. O site foi desenhado para incentivar descobertas e navegação casual (materializado pelo botão de obras aleatórias, exibição cinemática de detalhes, separação minimalista) 
2. Para o Proof-of-Concept, a loja não possui gateways de pagamentos diretos. O sistema captura a intenção de compra, cadastra o pedido, notifica a gerência por e-mail e informa virtualmente ao usuário que a equipe da Gusli entrará em contato com ele em breve com as faturas.
3. O frete e a logística de entrega não são contabilizados no total do carrinho. 
