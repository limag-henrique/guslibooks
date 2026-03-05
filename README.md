# GUSLI Books - E-commerce

> [!NOTE]  
> Este repositório contém o código-fonte (Frontend e Backend) para o projeto e-commerce **GUSLI Books**. Siga as instruções abaixo para rodar o projeto localmente na sua máquina.

## Pré-requisitos

Certifique-se de que você possui as seguintes ferramentas instaladas:
- **Node.js**: (versão 18 ou superior)
- **npm** (gerenciador de pacotes do Node)

---

## ⚙️ Backend

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

## 🖥️ Frontend

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


