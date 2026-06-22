# 📝 mini-blog-api — DevSpark

API REST desarrollada en Node.js + Express + PostgreSQL para gestionar autores y publicaciones del servicio de contenidos **Miniblog** de DevSpark.

---

## 📋 Tabla de contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Decisiones técnicas](#decisiones-técnicas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Ejecutar la aplicación](#ejecutar-la-aplicación)
- [Ejecutar tests](#ejecutar-tests)
- [Documentación OpenAPI / Swagger](#documentación-openapi--swagger)
- [Endpoints disponibles](#endpoints-disponibles)
- [Manejo de errores](#manejo-de-errores)
- [Despliegue en Railway](#despliegue-en-railway)
- [Uso de IA en el proyecto](#uso-de-ia-en-el-proyecto)

---

## Descripción del proyecto

`mini-blog-api` es la primera versión del backend del servicio de contenidos de DevSpark. Permite al equipo de front-end y a futuras integraciones gestionar **autores** y **posts** mediante una API REST simple, estable y documentada.

Funcionalidades cubiertas:

- CRUD completo de autores
- CRUD completo de posts
- Filtro de posts por estado (publicado / borrador)
- Filtro de posts por autor
- Validaciones de campos obligatorios antes de impactar la base de datos
- Manejo centralizado de errores con códigos semánticos

---

## Decisiones técnicas

### ¿Por qué Node.js + Express?
Express es minimalista y flexible, ideal para una startup que necesita iterar rápido sin atarse a un framework opinionado. Permite agregar capas (autenticación, caché, etc.) a medida que el producto crece.

### ¿Por qué PostgreSQL con driver `pg` nativo y sin ORM?
Se eligió trabajar directamente con SQL parametrizado (`$1`, `$2`) en lugar de un ORM como Sequelize o Prisma por tres razones:

- **Transparencia:** cada query es explícita y auditable, sin magia detrás.
- **Control:** las constraints de la DB (UNIQUE, NOT NULL, FOREIGN KEY, CASCADE) se respetan directamente sin capas intermedias que puedan ignorarlas.
- **Simplicidad:** para una API de este tamaño, un ORM agrega complejidad innecesaria.

### ¿Por qué arquitectura en capas?
El código se separó en `routes → controllers → services → db` para que cada archivo tenga una sola responsabilidad:

| Capa | Responsabilidad |
|------|----------------|
| `routes` | Mapear URLs a controladores |
| `controllers` | Validar input y coordinar la respuesta |
| `services` | Ejecutar queries SQL |
| `db` | Mantener el pool de conexiones |
| `middleware` | Capturar y formatear errores globalmente |

### ¿Por qué ESModules (ESM)?
Se usa `import/export` nativo de Node.js en lugar de `require/module.exports` para alinearse con el estándar moderno de JavaScript y facilitar la futura integración con herramientas que ya asumen ESM.

### ¿Por qué `process.loadEnvFile()` en lugar de `dotenv`?
Node.js 20.6+ incluye carga de `.env` nativa con `process.loadEnvFile()`, eliminando una dependencia externa innecesaria.

### Manejo de errores de PostgreSQL
Los errores de constraints de la DB se mapean a códigos HTTP semánticos directamente en el `errorHandler`:

| Código PG | Causa | HTTP |
|-----------|-------|------|
| `23505` | Email duplicado (UNIQUE) | 400 CONFLICT |
| `23502` | Campo requerido nulo (NOT NULL) | 400 VALIDATION_ERROR |
| `23503` | author_id inexistente (FK) | 404 NOT_FOUND |
| `22P02` | ID con formato inválido | 400 BAD_REQUEST |

---

## Estructura del proyecto

```
mini-blog-api/
├── src/
│   ├── config/
│   │   └── db.js               # Pool de conexiones PostgreSQL
│   ├── middleware/
│   │   └── errorHandler.js     # Manejo centralizado de errores
│   ├── routes/
│   │   ├── authorsRouter.js    # Rutas de autores
│   │   └── postsRouter.js      # Rutas de posts
│   ├── controllers/
│   │   ├── authorsController.js
│   │   └── postsControllers.js
│   ├── services/
│   │   ├── authorsService.js   # Queries SQL de autores
│   │   └── postsService.js     # Queries SQL de posts
│   └── app.js                  # Configuración de Express
├── server.js                   # Entry point — arranca el servidor
├── .env                        # Variables de entorno (no subir al repo)
├── .env.example                # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## Requisitos previos

- Node.js v20.6 o superior
- PostgreSQL v14 o superior
- pgAdmin (opcional, para gestión visual de la DB)

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/devspark/mini-blog-api.git
cd mini-blog-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y completar los valores:

```bash
cp .env.example .env
```

Contenido del `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_blog
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3000
```

### 4. Crear la base de datos en PostgreSQL

Ejecutar este SQL en pgAdmin o en la terminal de PostgreSQL:

```sql
CREATE DATABASE mini_blog;

\c mini_blog

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
```

---

## Ejecutar la aplicación

### Modo desarrollo

```bash
node server.js
```

### Verificar que el servidor está corriendo

```
Conexión exitosa a la base de datos. Hora actual: 2026-01-15T10:30:00Z
```

La API queda disponible en `http://localhost:3000`.

---

## Endpoints disponibles

### Authors

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/authors` | Listar todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un nuevo autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor y sus posts |

#### Ejemplo — Crear autor (POST /authors)

Request:
```json
{
  "name": "Carolina B",
  "email": "carolina@devspark.com",
  "bio": "Desarrolladora backend"
}
```

Response 201:
```json
{
  "data": {
    "id": 1,
    "name": "Carolina B",
    "email": "carolina@devspark.com",
    "bio": "Desarrolladora backend",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

---

### Posts

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/posts` | Listar todos los posts |
| GET | `/posts?published=true` | Listar solo posts publicados |
| GET | `/posts?published=false` | Listar solo borradores |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Listar posts de un autor |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

#### Ejemplo — Crear post (POST /posts)

Request:
```json
{
  "title": "Mi primer artículo",
  "content": "Contenido del artículo...",
  "author_id": 1,
  "published": false
}
```

Response 201:
```json
{
  "data": {
    "id": 1,
    "title": "Mi primer artículo",
    "content": "Contenido del artículo...",
    "author_id": 1,
    "published": false,
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

---

## Manejo de errores

Todos los errores devuelven el mismo formato:

```json
{
  "error": {
    "code": "CODIGO_SEMANTICO",
    "message": "Descripción del error"
  }
}
```

| code | HTTP | Cuándo ocurre |
|------|------|---------------|
| `VALIDATION_ERROR` | 400 | Campo obligatorio ausente o vacío |
| `CONFLICT` | 400 | Email ya registrado |
| `NOT_FOUND` | 404 | Recurso no encontrado por ID |
| `BAD_REQUEST` | 400 | ID con formato inválido (no numérico) |
| `INTERNAL_ERROR` | 500 | Error inesperado del servidor |

---

## Despliegue en Railway

[Railway](https://railway.app) es la plataforma recomendada para desplegar esta API. Permite conectar el repositorio de GitHub y aprovisionar una base de datos PostgreSQL en minutos.

### Pasos para desplegar

**1. Crear cuenta y nuevo proyecto en Railway**

Ir a [railway.app](https://railway.app) → New Project → Deploy from GitHub repo → seleccionar `mini-blog-api`.

**2. Agregar un servicio PostgreSQL**

Dentro del proyecto en Railway: Add Service → Database → PostgreSQL.

Railway crea la DB automáticamente y expone las variables de entorno necesarias.

**3. Configurar las variables de entorno**

En Railway → tu servicio → Variables, agregar:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
PORT=3000
```

> Railway permite referenciar las variables del servicio PostgreSQL directamente con la sintaxis `${{Postgres.VARIABLE}}`.

**4. Ejecutar el setup SQL en la DB de Railway**

En Railway → servicio PostgreSQL → Data → Query, ejecutar el SQL de creación de tablas:

```sql
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
```

**5. Deploy automático**

Railway detecta los cambios en `main` y hace deploy automáticamente en cada push.

### URLs de acceso en Railway

| Tipo | URL | Uso |
|------|-----|-----|
| **Internal URL** | `mini-blog-api.railway.internal` | Comunicación entre servicios dentro de Railway (ej: si agregás un frontend en el mismo proyecto) |
| **Public URL** | `https://mini-blog-api-production.up.railway.app` | Acceso externo — la URL que le das al equipo de front-end |

> La Public URL la generás en Railway → tu servicio → Settings → Networking → Generate Domain.

---

## Ejecutar tests

El proyecto usa el runner de tests nativo de Node.js (`node:test`) sin dependencias externas.

### Correr todos los tests

```bash
node --test
```

### Correr un archivo de test específico

```bash
node --test src/tests/authors.test.js
node --test src/tests/posts.test.js
```

### Qué cubren los tests

| Archivo | Qué testea |
|---------|-----------|
| `authors.test.js` | GET /authors, POST /authors, validaciones de name y email |
| `posts.test.js` | GET /posts, POST /posts, filtro por published, validaciones |

### Ejemplo de salida esperada

```
✔ GET /authors devuelve lista vacía al inicio (3ms)
✔ POST /authors crea un autor correctamente (5ms)
✔ POST /authors falla si falta el email (2ms)
✔ POST /posts falla si author_id no existe (4ms)
```

> Si todavía no tenés los archivos de test creados, podés pedirle al equipo backend que los agregue como próximo paso.

---

## Documentación OpenAPI / Swagger

La documentación interactiva de la API se genera con **Swagger UI** usando el paquete `swagger-ui-express` y un archivo de especificación `openapi.yaml`.

### Instalar dependencias de documentación

```bash
npm install swagger-ui-express yaml
```

### Acceder a la documentación

Con el servidor corriendo, abrir en el navegador:

```
http://localhost:3000/api-docs
```

Desde ahí podés explorar y probar todos los endpoints directamente desde el navegador sin necesidad de Postman.

### Especificación OpenAPI

El archivo de especificación completo está en:

```
mini-blog-api/
└── openapi.yaml
```

> Si el equipo aún no configuró Swagger UI, como alternativa podés importar el archivo `openapi.yaml` directamente en [Swagger Editor](https://editor.swagger.io) para visualizar la documentación.

---

## Ejecutar tests

Durante el desarrollo de `mini-blog-api` se utilizó **Claude (Anthropic)** como asistente de programación. A continuación se detalla de forma transparente cómo y para qué se usó:

| Tarea | Herramienta | Descripción |
|-------|-------------|-------------|
| Diseño de la especificación de endpoints | Claude | Se generó el borrador inicial de los 11 endpoints con sus request/response y casos borde |
| Estructura de carpetas y arquitectura en capas | Claude | Se validó la separación en routes/controllers/services/middleware |
| Código base de servicios, controladores y rutas | Claude | Se generaron los archivos base que luego fueron revisados y adaptados |
| Manejo de errores de PostgreSQL | Claude | Se identificaron los códigos de error PG (23505, 23502, 23503, 22P02) y su mapeo HTTP |
| Generación de este README | Claude | Se redactó la documentación completa del proyecto |

### Criterio de uso

Todo el código generado por IA fue **revisado, comprendido y adaptado** por el equipo antes de ser integrado. No se incorporó ningún fragmento sin entender su funcionamiento. La IA se usó como herramienta de aceleración, no como reemplazo del criterio técnico del desarrollador.

---

## Autor

Desarrollado por el equipo backend de **DevSpark** como base del servicio de contenidos Miniblog.
