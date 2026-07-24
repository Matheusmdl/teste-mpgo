# Teste MPGO — API de Tickets

API REST para registrar tickets de suporte. Ao criar um ticket, a aplicação o classifica por categoria e prioridade e o persiste no MongoDB.

## Tecnologias

- Node.js 20+
- Express e Mongoose
- MongoDB
- Jest, Supertest e MongoDB Memory Server
- Docker

## Pré-requisitos

- Node.js 20 ou superior e npm;
- uma instância acessível de MongoDB para executar a API localmente;
- Docker

## Configuração

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Crie o arquivo de configuração local a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

   No PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Atualize as variáveis em `.env` conforme o ambiente:

   ```dotenv
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/db-01
   ```

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | Não | Porta HTTP da API. O padrão é `3000`. |
| `MONGODB_URI` | Sim | String de conexão do MongoDB usada pela aplicação. |

> Segurança: `.env` é ignorado pelo Git e não deve ser versionado. Nunca inclua senhas, tokens ou chaves de API no código, no README ou em commits. Mantenha apenas nomes de variáveis e valores fictícios em `.env.example`; em produção, forneça os segredos por variáveis de ambiente ou por um gerenciador de segredos.

## Executar localmente

Para iniciar a API:

```bash
npm start
```

Durante o desenvolvimento, use o modo com reinicialização automática:

```bash
npm run dev
```

Com a configuração padrão, a API fica disponível em `http://localhost:3000`.

### Endpoint disponível

`POST /tickets` cria um ticket. O corpo deve conter `user_email`, `issue_title` e `issue_description`.

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"user_email":"cliente@empresa.com","issue_title":"Sistema fora do ar","issue_description":"Não consigo acessar o painel."}'
```

Uma criação bem-sucedida retorna `201 Created` com o ticket persistido, incluindo `category`, `priority`, `status`, `createdAt` e `updatedAt`. Requisições com um ou mais campos obrigatórios ausentes retornam 400 Bad Request.

## Executar com Docker

O repositório inclui um `Dockerfile` para a API. Construa a imagem:

```bash
docker build -t teste-mpgo-api .
```

Depois, execute o contêiner informando uma URI de MongoDB acessível **a partir do contêiner**:

```bash
docker run --rm -p 3000:3000 \
  -e PORT=3000 \
  -e MONGODB_URI="mongodb://SEU_HOST_MONGODB:27017/db-01" \
  teste-mpgo-api
```

Se o MongoDB estiver em outro contêiner, use o nome do serviço/contêiner na URI, por exemplo `mongodb://mongo:27017/db-01`, desde que ambos estejam na mesma rede Docker. Não use `localhost` para apontar ao MongoDB que está fora do contêiner: dentro dele, `localhost` representa a própria API.

## Testes automatizados

Execute toda a suíte:

```bash
npm test
```

Os testes abrangem a regra de classificação de tickets e a integração do endpoint `POST /tickets`. A integração utiliza `mongodb-memory-server`, portanto não usa a variável `MONGODB_URI` nem altera o banco de desenvolvimento. Na primeira execução, a dependência pode baixar o binário temporário do MongoDB.

A mesma suíte é executada pelo GitHub Actions em pushes e pull requests para a branch `main`. Em pushes nessa branch, a pipeline também constrói a imagem Docker.
