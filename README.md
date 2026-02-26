# Backend Woow

API REST en Node.js + TypeScript con Express y PostgreSQL (Drizzle ORM).

## Requisitos

- Node.js 18+
- Docker y Docker Compose (para el banco PostgreSQL)

## Instalación

```bash
npm install
cp .env.example .env
```

Ajusta el `.env` si hace falta (las credenciales por defecto coinciden con `docker-compose.yml`).

## Cómo subir la base de datos

Con Docker instalado, en la raíz del proyecto:

```bash
docker compose up -d
```

Esto levanta PostgreSQL en el puerto `5432` con usuario `woow`, contraseña `woow_secret` y base de datos `woow_db`.

Para aplicar el schema (primera vez o tras cambios en el schema):

```bash
npm run db:generate
npm run db:migrate
```

## Cómo iniciar la API

**Desarrollo** (con recarga al guardar):

```bash
npm run dev
```

**Producción** (build + start):

```bash
npm run build
npm start
```

La API queda en `http://localhost:3000` (o en el `PORT` del `.env`).

## Healthcheck

- **GET** `/api/health`

Ejemplo de respuesta (cuando todo está bien):

- `status`: `"ok"` o `"degraded"` (degraded si la base no está disponible)
- `message`: mensaje en español
- `api`: `name`, `version`
- `database`: `"ok"` o `"down"`
- `timestamp`: ISO

## Scripts

| Script        | Descripción                    |
|---------------|--------------------------------|
| `npm run dev` | Servidor en modo desarrollo    |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm start`   | Ejecuta `dist/server.js`       |
| `npm run db:generate` | Genera migraciones (Drizzle) |
| `npm run db:migrate`  | Aplica migraciones            |
| `npm run db:studio`   | Abre Drizzle Studio           |

## Tabla `users`

Campos: `id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`.

- Las contraseñas deben guardarse hasheadas con **bcrypt** al registrar o actualizar.
- Roles: `user` y `admin`.
