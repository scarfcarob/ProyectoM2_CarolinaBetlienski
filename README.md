# 🗞️ mini-blog-api

**REST API** para la gestión de autores y publicaciones del servicio **MiniBlog** de DevSpark.

Construida con **Node.js (ESM)**, **Express** y **PostgreSQL**, sigue una arquitectura en capas (`routes → controllers → services → db`), con validaciones estrictas, manejo centralizado de errores y documentación interactiva vía Swagger UI. Lista para desplegar en Railway.

---

## Tabla de contenidos

1. [Tecnologías utilizadas](#tecnologías-utilizadas)
2. [URL de la API](#url-de-la-api)
3. [Estructura de archivos](#estructura-de-archivos)
4. [Instalación local](#instalación-local)
5. [Endpoints disponibles](#endpoints-disponibles)
6. [Ejemplos de uso](#ejemplos-de-uso)
7. [Tests](#tests)
8. [Documentación OpenAPI / Swagger UI](#documentación-openapi--swagger-ui)
9. [Deployment en Railway](#deployment-en-railway)

---

## Tecnologías utilizadas

| Tecnología | Versión mínima | Rol en el proyecto |
|---|---|---|
| Node.js (ESM) | 20.6 | Runtime y módulos nativos (`process.loadEnvFile()`) |
| Express | 4.x | Framework HTTP y routing |
| PostgreSQL | 14+ | Base de datos relacional |
| pg (node-postgres) | — | Driver y connection pool hacia PostgreSQL |
| Vitest | — | Framework de testing |
| Supertest | — | Testing de endpoints HTTP |
| swagger-ui-express | — | Interfaz visual interactiva de la documentación |
| js-yaml | — | Parseo del archivo `openapi.yaml` |

---

## URL de la API

| Entorno | URL |
|---|---|
| Local | `http://localhost:3000` |
| Producción (Railway) | `https://mini-blog-api-production.up.railway.app` |

---

## Estructura de archivos

```
mini-blog-api/
├── docs/
│   └── openapi.yaml          # Especificación OpenAPI 3.0
├── scripts/
│   ├── seed.sql              # Datos de prueba opcionales
│   └── setup.sql             # Creación de tablas
├── src/
│   ├── config/
│   │   └── db.js             # Configuración del pool de conexión PostgreSQL
│   ├── controllers/
│   │   ├── authorsController.js
│   │   └── postsControllers.js
│   ├── middleware/
│   │   └── errorHandler.js   # Manejo centralizado de errores
│   ├── routes/
│   │   ├── authorsRouter.js
│   │   └── postsRouter.js
│   ├── services/
│   │   ├── authorsService.js
│   │   └── postsService.js
│   ├── tests/
│   │   ├── authors.test.js
│   │   └── posts.test.js
│   ├── utils/
│   │   └── validationHelper.js
│   └── app.js
├── .env                      # No incluido en el repo
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── vitest.config.js
```

---

## Instalación local

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd mini-blog-api
npm install
```

### 2. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

El `.env` debe tener esta forma:

```env
# .env — ejemplo para entorno local
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_dev
DB_USER=postgres
DB_PASSWORD=tu_password_local
```

> El archivo `.env` está en `.gitignore` y no se sube al repositorio. Si no existe al iniciar, `server.js` muestra una advertencia y continúa con los valores del entorno del sistema.

### 3. Crear la base de datos y las tablas

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE miniblog_dev;"

# Crear las tablas
psql -U postgres -d miniblog_dev -f scripts/setup.sql

# (Opcional) Cargar datos de prueba
psql -U postgres -d miniblog_dev -f scripts/seed.sql
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con reinicio automático)
node --watch server.js

# Producción
node server.js
```

---

## Endpoints disponibles

### Authors `/authors`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un nuevo autor |
| PUT | `/authors/:id` | Actualizar un autor por ID |
| DELETE | `/authors/:id` | Eliminar un autor por ID |

### Posts `/posts`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/posts` | Obtener todos los posts (soporta `?published=true\|false`) |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener todos los posts de un autor |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post por ID |
| DELETE | `/posts/:id` | Eliminar un post por ID |

---

## Ejemplos de uso

### Autores

**Obtener todos los autores**
```http
GET /authors
```
```json
{
  "data": [
    {
      "id": 1,
      "name": "Carolina Betlienski",
      "email": "carolina@devspark.com",
      "bio": "Desarrolladora backend en DevSpark.",
      "created_at": "2025-06-01T10:00:00.000Z"
    }
  ]
}
```

---

**Crear un autor**
```http
POST /authors
Content-Type: application/json

{
  "name": "Carolina Betlienski",
  "email": "carolina@devspark.com",
  "bio": "Desarrolladora backend en DevSpark."
}
```
```json
{
  "data": {
    "id": 1,
    "name": "Carolina Betlienski",
    "email": "carolina@devspark.com",
    "bio": "Desarrolladora backend en DevSpark.",
    "created_at": "2025-06-01T10:00:00.000Z"
  }
}
```

---

**Actualizar un autor**
```http
PUT /authors/1
Content-Type: application/json

{
  "name": "Carolina Betlienski",
  "email": "carolina@devspark.com",
  "bio": "Bio actualizada."
}
```
```json
{
  "data": {
    "id": 1,
    "name": "Carolina Betlienski",
    "email": "carolina@devspark.com",
    "bio": "Bio actualizada.",
    "created_at": "2025-06-01T10:00:00.000Z"
  }
}
```

---

**Eliminar un autor**
```http
DELETE /authors/1
```
```
204 No Content
```

---

### Posts

**Obtener todos los posts publicados**
```http
GET /posts?published=true
```
```json
{
  "data": [
    {
      "id": 1,
      "title": "Mi primer post en MiniBlog",
      "content": "Contenido del post.",
      "author_id": 1,
      "published": true,
      "created_at": "2025-06-05T09:00:00.000Z"
    }
  ]
}
```

---

**Crear un post**
```http
POST /posts
Content-Type: application/json

{
  "title": "Mi primer post en MiniBlog",
  "content": "Contenido del post.",
  "author_id": 1,
  "published": true
}
```
```json
{
  "data": {
    "id": 1,
    "title": "Mi primer post en MiniBlog",
    "content": "Contenido del post.",
    "author_id": 1,
    "published": true,
    "created_at": "2025-06-05T09:00:00.000Z"
  }
}
```

---

**Obtener posts de un autor**
```http
GET /posts/author/1
```
```json
{
  "data": [
    {
      "id": 1,
      "title": "Mi primer post en MiniBlog",
      "content": "Contenido del post.",
      "author_id": 1,
      "published": true,
      "created_at": "2025-06-05T09:00:00.000Z"
    }
  ]
}
```

---

### Respuestas de error

Todos los errores siguen la misma estructura:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo 'name' es obligatorio y debe ser un texto válido."
  }
}
```

| Código | HTTP | Cuándo ocurre |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Campo inválido, faltante o no permitido |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `CONFLICT` | 400 | Email duplicado (restricción UNIQUE) |
| `BAD_REQUEST` | 400 | Datos numéricos con formato inválido |
| `INTERNAL_ERROR` | 500 | Error inesperado del servidor |

---

## Tests

Los tests están escritos con **Vitest** y **Supertest**, y se encuentran en `src/tests/`. Corren contra la base de datos real, por lo que es necesario tener PostgreSQL activo y el `.env` configurado antes de ejecutarlos. La configuración de Vitest se encuentra en `vitest.config.js` en la raíz del proyecto.

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar un archivo específico

```bash
npm test -- src/tests/authors.test.js
npm test -- src/tests/posts.test.js
```

---

### `authors.test.js` — Suite de pruebas de autores

Cubre los endpoints de `/authors` con los siguientes casos:

| Tipo | Test | Qué valida |
|---|---|---|
| ✅ Éxito | `GET /authors` | Devuelve status 200 y un array en `data` |
| ✅ Éxito | `POST /authors` | Crea un autor y devuelve status 201 con `id` en la respuesta |
| ❌ Edge case | `POST /authors` con campos extra | Rechaza con 400 y código `VALIDATION_ERROR` cuando se inyectan propiedades no permitidas (`isAdmin`, `hack`, etc.) |
| ❌ Edge case | `GET /authors/:id` con ID gigante | Rechaza con 400 y `VALIDATION_ERROR` cuando el ID desborda un entero de 32 bits (ej: `9999999999999999`) |
| ❌ Error | `GET /authors/:id` con ID inexistente | Devuelve 404 con código `NOT_FOUND` para un ID válido pero que no existe en la BD |

> Los tests de creación usan emails con `Date.now()` para evitar conflictos con la restricción `UNIQUE` de la base de datos.

---

### `posts.test.js` — Suite de pruebas de posts

Usa `beforeAll` para crear un autor real en la base de datos antes de correr los tests, garantizando un `author_id` válido disponible para todos los casos.

| Tipo | Test | Qué valida |
|---|---|---|
| ✅ Éxito | `GET /posts` | Devuelve status 200 y un array en `data` |
| ✅ Éxito | `POST /posts` | Crea un post con `author_id` válido y devuelve status 201 con `id` |
| ❌ Edge case | `GET /posts?published=no_se_sabe` | Rechaza con 400 cuando el query param `published` tiene un valor no permitido |
| ❌ Edge case | `POST /posts` con título > 200 caracteres | Rechaza con 400 y mensaje que contiene `"excede el límite"` |
| ❌ Edge case | `POST /posts` con `author_id` no numérico | Rechaza con 400 y código `VALIDATION_ERROR` |

---

## Documentación OpenAPI / Swagger UI

La especificación OpenAPI 3.0 del proyecto se encuentra en `docs/openapi.yaml`.

La documentación interactiva está disponible mientras el servidor está corriendo:

```
http://localhost:3000/api-docs
```

Swagger UI permite explorar todos los endpoints, ver los esquemas de request y response, y probar la API directamente desde el navegador sin necesidad de herramientas externas como Postman.

---

## Deployment en Railway

### Pasos generales

1. Creá un nuevo proyecto en [Railway](https://railway.app) y conectá el repositorio de GitHub.
2. Agregá un plugin de **PostgreSQL** desde el dashboard de Railway.
3. Configurá las **variables de entorno** del servicio (ver tabla abajo).
4. Railway detecta automáticamente el comando de inicio definido en `package.json` (`"start": "node server.js"`).
5. Una vez desplegado, ejecutá el script de setup para crear las tablas:

```bash
railway run psql $DATABASE_URL -f scripts/setup.sql
```

### Variables de entorno en Railway

En la pestaña **Variables** de tu servicio, usá la sintaxis de **referencia interna** para conectar con el Postgres del mismo proyecto:

| Variable | Valor en Railway |
|---|---|
| `PORT` | `3000` |
| `DB_HOST` | `${{Postgres.PGHOST}}` |
| `DB_PORT` | `${{Postgres.PGPORT}}` |
| `DB_NAME` | `${{Postgres.PGDATABASE}}` |
| `DB_USER` | `${{Postgres.PGUSER}}` |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |

> La sintaxis `${{Postgres.VARIABLE}}` le dice a Railway que resuelva el valor desde el plugin de Postgres del mismo proyecto usando la **URL interna**, sin exponerlo al exterior.

### URL pública

Una vez desplegado, Railway genera una URL pública del tipo:

```
https://mini-blog-api-production.up.railway.app
```

La encontrás en **Settings → Networking → Public URL**. Compartila con el equipo de frontend y DevOps para integrar la API.

### Consideraciones adicionales

- Para ver logs en tiempo real: tab **Logs** del dashboard o `railway logs` desde el CLI.
- Para cargar datos de prueba en producción: `railway run psql $DATABASE_URL -f scripts/seed.sql`.
- Uso de inteligencia artificial

Durante el desarrollo de este proyecto se utilizó Claude (Anthropic) como herramienta de asistencia. A continuación se detalla de forma transparente en qué áreas y con qué propósito:

Diseño y arquitectura


Validación de la arquitectura en capas elegida (routes → controllers → services → db) y consultas sobre buenas prácticas para proyectos Express con ESM.
Orientación sobre el uso de process.loadEnvFile() nativo como alternativa a dotenv.
Definición de la estrategia de manejo centralizado de errores con códigos semánticos (VALIDATION_ERROR, NOT_FOUND, CONFLICT, etc.) y mapeo de errores de PostgreSQL.


Generación de código


Implementación de la función sanitizeObject en validationHelper.js para rechazar campos no permitidos en el body.
Estructura base del middleware errorHandler.js con manejo diferenciado de errores operativos y errores de Postgres (códigos 23505, 23503, 22003, 22P02).
Revisión y corrección de lógica en controladores (authorsController.js, postsControllers.js).


Documentación


Generación del archivo docs/openapi.yaml con especificación OpenAPI 3.0 completa: schemas reutilizables, ejemplos de request/response y mensajes de error reales extraídos del código.
Redacción y revisión iterativa de este README.md en múltiples versiones, ajustando la estructura de archivos para que coincida con el proyecto real.
Definición de los mensajes de commit siguiendo la convención Conventional Commits (docs:, feat:, etc.) en español.


Testing


Orientación sobre la estrategia de testing con Vitest y Supertest.
Explicación del uso de beforeAll en posts.test.js para crear un autor real antes de ejecutar los tests de posts.
Sugerencia del uso de Date.now() en emails de prueba para evitar conflictos con la restricción UNIQUE de la base de datos.


Aclaraciones


Todo el código fue revisado, comprendido y validado por la desarrolladora antes de integrarse al proyecto.
Las decisiones de diseño, la estructura del proyecto y la lógica de negocio fueron definidas y aprobadas por la desarrolladora.
El uso de IA funcionó como herramienta de apoyo y aceleración del proceso de desarrollo, no como reemplazo del criterio técnico propio.
