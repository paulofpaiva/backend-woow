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

## Instalación paso a paso

1. Clonar el repositorio y entrar en la carpeta del proyecto.

2. Instalar dependencias:

```bash
npm install
```

3. Copiar el archivo de variables de entorno y ajustar si es necesario:

```bash
cp .env.example .env
```

En `.env` debes definir al menos `DATABASE_URL` (cadena de conexión a PostgreSQL) y `JWT_SECRET` (clave para firmar los tokens). Las credenciales por defecto del ejemplo coinciden con las del `docker-compose.yml`.

4. Crear la base de datos y aplicar migraciones (ver sección siguiente).

## Cómo crear la base de datos

Con Docker y Docker Compose en la raíz del proyecto:

```bash
docker compose up -d
```

Esto inicia PostgreSQL en el puerto 5432 con usuario `woow`, contraseña `woow_secret` y base de datos `woow_db`.

Aplicar las migraciones (crea tablas e inserta el usuario admin de prueba):

```bash
npm run db:migrate
```

Para recrear la base desde cero (borra datos):

```bash
docker compose down -v
docker compose up -d
npm run db:migrate
```

Si usas PostgreSQL instalado localmente, crea la base `woow_db` (o la que indiques en `DATABASE_URL`) y ejecuta solo `npm run db:migrate`.

## Cómo ejecutar el proyecto

Este repositorio contiene solo el backend. No hay frontend incluido.

**Modo desarrollo** (recarga al guardar):

```bash
npm run dev
```

**Modo producción** (compilar y ejecutar):

```bash
npm run build
npm start
```

El servidor escucha en `http://localhost:3000` por defecto, o en el puerto definido en `PORT` en el `.env`.

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

Requiere autenticación con un usuario de rol `admin`. Query opcionales: `page` (por defecto 1), `limit` (por defecto 10, máximo 100).

Ejemplo:

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
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
