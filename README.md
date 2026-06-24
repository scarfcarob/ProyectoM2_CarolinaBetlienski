# mini-blog-api

REST API para la gestión de autores y publicaciones del servicio **MiniBlog** de DevSpark. Construida con Node.js (ESM), Express y PostgreSQL, sigue una arquitectura en capas (routes → controllers → services → db) y está lista para desplegar en Railway.

---

## Tabla de contenidos

1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y ejecución local](#instalación-y-ejecución-local)
4. [Ejecutar los tests](#ejecutar-los-tests)
5. [Documentación OpenAPI / Swagger UI](#documentación-openapi--swagger-ui)
6. [Deployment en Railway](#deployment-en-railway)

---

## Descripción del proyecto

`mini-blog-api` expone dos recursos principales a través de endpoints RESTful:

| Recurso | Ruta base | Operaciones |
|---------|-----------|-------------|
| Autores | `/authors` | CRUD completo |
| Posts   | `/posts`   | CRUD completo + filtro por autor y por estado de publicación |

Características destacadas:

- **Validaciones en controladores** — tipos, longitudes, emails, IDs de Postgres (enteros positivos ≤ 2 147 483 647), campos extra rechazados.
- **Manejo centralizado de errores** — middleware `errorHandler` con códigos semánticos (`VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`) y mapeo automático de errores de Postgres (23505, 23503, 22003/22P02).
- **Sin dependencias de terceros para entorno** — usa `process.loadEnvFile()` nativo (Node 20.6+) en lugar de `dotenv`.

### Estructura de archivos

```
mini-blog-api/
├── scripts/
│   ├── seed.sql          # Datos de prueba opcionales
│   └── setup.sql         # Creación de tablas
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authorsController.js
│   │   └── postsControllers.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authorsRouter.js
│   │   └── postsRouter.js
│   ├── services/
│   │   ├── authorsService.js
│   │   └── postsService.js
│   ├── tests/
│   ├── utils/
│   │   └── validationHelper.js
│   ├── app.js
│   └── openapi.json
├── .env                  # No incluido en el repo
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## Requisitos previos

- **Node.js** v20.6 o superior (necesario para `process.loadEnvFile()`)
- **PostgreSQL** 14+
- `npm` 9+

---

## Instalación y ejecución local

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

> El archivo `.env` está en `.gitignore` y no se sube al repositorio. Si no existe al iniciar, `server.js` muestra una advertencia y usa los valores del entorno del sistema.

### 3. Crear la base de datos y las tablas

Primero creá la base de datos en PostgreSQL (si no existe):

```bash
psql -U postgres -c "CREATE DATABASE miniblog_dev;"
```

Luego ejecutá el script de setup para crear las tablas:

```bash
psql -U postgres -d miniblog_dev -f scripts/setup.sql
```

Si querés cargar datos de prueba:

```bash
psql -U postgres -d miniblog_dev -f scripts/seed.sql
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con reinicio automático)
node --watch server.js

# Producción
node server.js
```

La API quedará disponible en `http://localhost:3000`.

#### Endpoints disponibles

```
GET    /authors
GET    /authors/:id
POST   /authors
PUT    /authors/:id
DELETE /authors/:id

GET    /posts                      # soporta ?published=true|false
GET    /posts/:id
GET    /posts/author/:authorId
POST   /posts
PUT    /posts/:id
DELETE /posts/:id
```

---

## Ejecutar los tests

```bash
npm test
```

Los tests se encuentran en `src/tests/` y cubren los casos principales de cada endpoint: respuestas exitosas, validaciones y errores 404.

Para ejecutar solo un archivo de tests específico:

```bash
npm test -- src/tests/authors.test.js
```

---

## Documentación OpenAPI / Swagger UI

La especificación OpenAPI del proyecto se encuentra en `src/openapi.json`.

La documentación interactiva está disponible mientras el servidor está corriendo:

```
http://localhost:3000/api-docs
```

Swagger UI permite explorar y probar cada endpoint directamente desde el navegador, sin necesidad de herramientas externas.

---

## Deployment en Railway

### Pasos generales

1. Creá un nuevo proyecto en [Railway](https://railway.app) y conectá el repositorio de GitHub.
2. Agregá un plugin de **PostgreSQL** desde el dashboard de Railway.
3. Configurá las **variables de entorno** del servicio (ver tabla abajo).
4. Railway detecta automáticamente el comando de inicio definido en `package.json` (`"start": "node server.js"`).
5. Una vez desplegado, ejecutá el script de setup para crear las tablas desde la consola de Railway o con el CLI:

```bash
railway run psql $DATABASE_URL -f scripts/setup.sql
```

### Variables de entorno en Railway

En la pestaña **Variables** de tu servicio, usá la sintaxis de **referencia interna** para conectar con el Postgres del mismo proyecto (más rápido y sin costos de egress):

| Variable | Valor en Railway |
|----------|-----------------|
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

- Para ver logs en tiempo real usá el tab **Logs** del dashboard o el CLI: `railway logs`.
- Si necesitás cargar datos de prueba en producción: `railway run psql $DATABASE_URL -f scripts/seed.sql`.
