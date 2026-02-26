# Backend Woow

API REST em Node.js + TypeScript com Express e PostgreSQL (Drizzle ORM).

## Requisitos

- Node.js 18+
- Docker e Docker Compose (para o banco PostgreSQL)

## Instalação

```bash
npm install
cp .env.example .env
```

Ajuste o `.env` se precisar (credenciais padrão batem com o `docker-compose.yml`).

## Como subir o banco de dados

Com Docker instalado, na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe o PostgreSQL na porta `5432` com usuário `woow`, senha `woow_secret` e banco `woow_db`.

Para aplicar o schema (primeira vez ou após mudanças no schema):

```bash
npm run db:generate
npm run db:migrate
```

## Como iniciar a API

**Desenvolvimento** (com reload ao salvar):

```bash
npm run dev
```

**Produção** (build + start):

```bash
npm run build
npm start
```

A API sobe em `http://localhost:3000` (ou na `PORT` do `.env`).

## Healthcheck

- **GET** `/api/health`

Resposta exemplo (quando está tudo ok):

- `status`: `"ok"` ou `"degraded"` (degraded se o banco estiver inacessível)
- `message`: mensagem em español
- `api`: `name`, `version`
- `database`: `"ok"` ou `"down"`
- `timestamp`: ISO

## Scripts

| Script        | Descrição                    |
|---------------|------------------------------|
| `npm run dev` | Servidor em modo desenvolvimento |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm start`   | Roda `dist/server.js`        |
| `npm run db:generate` | Gera migrations (Drizzle) |
| `npm run db:migrate`  | Aplica migrations           |
| `npm run db:studio`   | Abre Drizzle Studio         |
