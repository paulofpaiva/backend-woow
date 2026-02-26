# REST API Woow Technology

![Woow Technology](woow_logo.jpeg)

Este repositorio corresponde a un assignment técnico solicitado por [WoowTechnology SAS](https://woowtechnologysas.com/) como parte del proceso de selección para la vacante de desarrollador de software.

API REST para autenticación y gestión de usuarios. Desarrollada en Node.js con TypeScript, Express y PostgreSQL. Incluye registro, login con JWT, perfil de usuario y listado paginado para administradores.

## Descripción del proyecto

El backend expone endpoints para registrar usuarios, iniciar sesión (token JWT y cookie httpOnly), consultar y actualizar el perfil propio, y listar usuarios con paginación (solo administradores). Las contraseñas se almacenan hasheadas con bcrypt. La base de datos se gestiona con Drizzle ORM y migraciones versionadas.

## Prerrequisitos

* Node.js 18 o superior
* npm (incluido con Node)
* Docker y Docker Compose (para ejecutar PostgreSQL sin instalación local)
* Si no usas Docker: PostgreSQL 14 o superior instalado y en ejecución

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

* Las contraseñas deben guardarse hasheadas con **bcrypt** al registrar o actualizar.
* Roles: `user` y `admin`.

## Endpoints disponibles

Base URL: `http://localhost:3000` (o la que corresponda según tu configuración).

**Healthcheck**

`GET /api/health`

Comprueba el estado del servicio y la conexión a la base de datos. No requiere autenticación.

Ejemplo de respuesta:

```json
{
  "status": "ok",
  "message": "Servicio en funcionamiento",
  "api": { "name": "backend-woow", "version": "1.0.0" },
  "database": "ok",
  "timestamp": "2025-02-26T12:00:00.000Z"
}
```

**Registro de usuario**

`POST /api/auth/register`

Body (JSON): `name`, `email`, `password` (mínimo 8 caracteres).

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"María García","email":"maria@example.com","password":"12345678"}'
```

Respuesta esperada (201): `{ "message": "Usuario registrado exitosamente" }`.

**Login**

`POST /api/auth/login`

Body (JSON): `email`, `password`.

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"12345678"}'
```

Respuesta (200): `{ "token": "eyJ...", "user": { "id", "name", "email", "role" } }`. El token también se envía en una cookie httpOnly.

**Obtener perfil**

`GET /api/users/me`

Requiere autenticación: header `Authorization: Bearer <token>` o cookie `access_token`.

Ejemplo:

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <token>"
```

Respuesta (200): `{ "id", "name", "email", "role" }`.

**Actualizar perfil**

`PUT /api/users/me`

Requiere autenticación. Body (JSON): `name` (obligatorio).

Ejemplo:

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"María García López"}'
```

Respuesta (200): `{ "message": "Perfil actualizado", "user": { "id", "name", "email", "role" } }`.

**Listar usuarios** (solo admin)

`GET /api/users`

Requiere autenticación con un usuario de rol `admin`.

Parámetros de query (todos opcionales):

| Parámetro | Tipo   | Descripción |
|-----------|--------|-------------|
| `page`    | número | Página (por defecto 1). |
| `limit`   | número | Resultados por página (por defecto 10, máximo 100). |
| `search`  | texto | Busca por nombre o email (coincidencia parcial, insensible a mayúsculas). Máximo 255 caracteres. |
| `role`    | texto | Filtra por rol: `user` o `admin`. |

Ejemplo con paginación:

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer <token_admin>"
```

Ejemplo con búsqueda y filtro por rol:

```bash
curl -X GET "http://localhost:3000/api/users?search=maria&role=user" \
  -H "Authorization: Bearer <token_admin>"
```

Respuesta (200): `{ "users": [ ... ], "pagination": { "page", "limit", "total", "totalPages" } }`.

## Credenciales de prueba

Tras ejecutar las migraciones se crea un usuario administrador de prueba:

* Email: `admin@gmail.com`
* Contraseña: `12345678`
* Rol: `admin`

Puedes usarlo para hacer login y probar `GET /api/users/me` y `GET /api/users`.

Para probar como usuario normal, regístrate con `POST /api/auth/register` usando otro email. Ese usuario tendrá rol `user` y no podrá acceder a `GET /api/users`.

## Uso en Postman

### Configuración base

1. Crea un entorno (Environment) con la variable `baseUrl` = `http://localhost:3000` y, si quieres, `token` para guardar el JWT tras el login.
2. Para endpoints que requieren autenticación, en la pestaña **Authorization** elige **Bearer Token** y usa `{{token}}` (o pega el token manualmente).

### Login y guardar el token

1. **POST** `{{baseUrl}}/api/auth/login`
2. Body → raw → JSON: `{ "email": "admin@gmail.com", "password": "12345678" }`
3. En **Tests** del request, pega esto para guardar el token en el entorno:
   ```js
   const res = pm.response.json();
   if (res.token) pm.environment.set("token", res.token);
   ```
4. Ejecuta el request; en el entorno quedará guardado `token` para los siguientes requests.

### Listar usuarios (solo admin) con filtros y búsqueda

1. **GET** `{{baseUrl}}/api/users`
2. En la pestaña **Params** (query params) puedes usar:

   | Key    | Value   | Descripción |
   |--------|--------|-------------|
   | `page` | 1      | Página. |
   | `limit`| 10     | Resultados por página (máx. 100). |
   | `search` | maria | Busca en nombre y email (parcial, sin distinguir mayúsculas). |
   | `role` | user   | Solo usuarios con rol `user`. Usa `admin` para solo admins. |

   Puedes combinar: por ejemplo `page=1`, `limit=5`, `search=admin`, `role=admin` para la primera página de admins cuyo nombre o email contenga "admin".

3. Authorization: Bearer Token → `{{token}}` (token de un usuario admin).
4. Send. La respuesta incluye `users` (array) y `pagination` (`page`, `limit`, `total`, `totalPages`).

## Scripts npm

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en modo desarrollo con recarga |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el servidor compilado |
| `npm run db:generate` | Genera migraciones Drizzle a partir del schema |
| `npm run db:migrate` | Aplica migraciones a la base de datos |
| `npm run db:studio` | Abre Drizzle Studio para inspeccionar datos |

## Estructura SQL alternativa

En la carpeta `database/` encontrarás `schema.sql` (estructura de tablas) y `seed.sql` (datos de prueba). Son equivalentes a lo que aplican las migraciones de Drizzle y sirven como referencia o para entornos donde no se use Drizzle Kit. Para aplicarlos a mano con psql: `psql -U woow -d woow_db -f database/schema.sql` y luego `psql -U woow -d woow_db -f database/seed.sql`.
