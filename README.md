# Teste MPGO — API de Tickets

API REST para registrar tickets de suporte. Ao criar um ticket, a aplicação classifica a demanda por categoria e prioridade e persiste o ticket no MongoDB Atlas.

## Tecnologias

- Node.js 20+
- Express
- Mongoose
- MongoDB
- Jest
- Supertest
- MongoDB Memory Server
- Docker
- GitHub Actions

## Pré-requisitos

- Node.js 20 ou superior e npm;
- uma instância acessível de MongoDB para executar a API localmente;
- Docker (opcional, para executar a aplicação em contêiner).

## Configuração

### 1. Instale as dependências

```bash
npm ci
```

### 2. Crie o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/db-01
```

>**Atenção:** Exemplo de URI real: MONGODB_URI=mongodb+srv://usuario:senha123@<cluster>.mongodb.net/meucluster

Substitua os valores pelos dados reais da sua conexão com o MongoDB Atlas.

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | Não | Porta HTTP da API. O padrão é `3000`. |
| `MONGODB_URI` | Sim | String de conexão do MongoDB utilizada pela aplicação. |

> **Segurança:** o arquivo `.env` não deve ser versionado. Nunca inclua senhas, tokens ou chaves de API no código, no README ou em commits. Utilize variáveis de ambiente ou um gerenciador de segredos para informações sensíveis.

## Executar localmente

Para iniciar a API:

```bash
npm start
```

Durante o desenvolvimento, utilize:

```bash
npm run dev
```

Com a configuração padrão, a API estará disponível em:

```text
http://localhost:3000
```

## Endpoint

### POST `/tickets`

Cria e processa um novo ticket.

#### Payload

```json
{
  "user_email": "cliente@empresa.com",
  "issue_title": "Sistema fora do ar",
  "issue_description": "Não consigo acessar o painel de vendas, a tela fica carregando infinitamente."
}
```

Exemplo utilizando `curl`:

```bash
curl -X POST http://localhost:3000/tickets   -H "Content-Type: application/json"   -d '{"user_email":"cliente@empresa.com","issue_title":"Sistema fora do ar","issue_description":"Não consigo acessar o painel de vendas, a tela fica carregando infinitamente."}'
```

Uma criação bem-sucedida retorna:

```text
201 Created
```

O ticket persistido inclui informações como:

- `category`;
- `priority`;
- `status`;
- `createdAt`;
- `updatedAt`.

Requisições com um ou mais campos obrigatórios ausentes retornam:

```text
400 Bad Request
```

Falhas durante a persistência retornam:

```text
500 Internal Server Error
```

## Testes automatizados

Execute toda a suíte:

```bash
npm test
```

Os testes abrangem:

- testes unitários da regra de classificação de tickets;
- teste de integração do endpoint `POST /tickets`;
- processamento e persistência de tickets;
- tratamento de payload incompleto;
- tratamento de falha na persistência.

A integração utiliza `mongodb-memory-server`, portanto os testes não utilizam a variável `MONGODB_URI` nem alteram o banco de desenvolvimento.

A mesma suíte de testes é executada pelo GitHub Actions em:

- pushes para a branch `main`;
- pull requests direcionados à branch `main`.

Em pushes para a branch `main`, após a aprovação dos testes, a pipeline também constrói a imagem Docker.

## Executar com Docker

Construa a imagem:

```bash
docker build -t teste-mpgo-api .
```

Execute o contêiner:

```bash
docker run --rm -p 3000:3000   -e PORT=3000   -e MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/db-01"   teste-mpgo-api
```

A API ficará disponível em:

```text
http://localhost:3000
```

> A URI do MongoDB deve ser acessível a partir do contêiner. Não utilize `localhost` para apontar para um MongoDB que esteja fora do contêiner, pois, dentro dele, `localhost` representa o próprio contêiner da API.

## CI/CD

A pipeline está localizada em:

```text
.github/workflows/ci-cd.yml
```

O fluxo de CI executa:

```text
Push ou Pull Request
        ↓
Checkout do código
        ↓
Configuração do Node.js
        ↓
npm ci
        ↓
npm test
```

Nos pushes para a branch `main`, a construção da imagem Docker ocorre somente após a aprovação dos testes:

```text
Testes
  ↓
Aprovados
  ↓
Docker Build
```

Caso algum teste falhe, a pipeline é interrompida.

## Estrutura do projeto

```text
teste-mpgo/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── ticketController.js
│   │
│   ├── models/
│   │   └── Ticket.js
│   │
│   ├── routes/
│   │   └── ticketRoutes.js
│   │
│   ├── services/
│   │   └── triagemService.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── integration/
│   │   └── ticket.integration.test.js
│   │
│   └── unit/
│       └── triagemService.test.js
│
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── package-lock.json
```
