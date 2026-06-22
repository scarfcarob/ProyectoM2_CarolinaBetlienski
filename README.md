
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
- [Endpoints disponibles](#endpoints-disponibles)
- [Manejo de errores](#manejo-de-errores)
- [Despliegue en producción](#despliegue-en-producción)

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

## Despliegue en producción

### Variables de entorno en producción

No subir el archivo `.env` al repositorio. Configurar las variables directamente en el servidor o plataforma de despliegue (Railway, Render, AWS, etc.):

```
DB_HOST=host-produccion
DB_PORT=5432
DB_NAME=mini_blog_prod
DB_USER=usuario_prod
DB_PASSWORD=password_seguro
PORT=3000
```

### Pasos para desplegar

```bash
# 1. Clonar el repo en el servidor
git clone https://github.com/devspark/mini-blog-api.git
cd mini-blog-api

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno en el servidor

# 4. Crear las tablas en la DB de producción
# (ejecutar el SQL de la sección de instalación)

# 5. Arrancar el servidor
node server.js
```

### Recomendaciones para producción

- Usar **PM2** para mantener el proceso activo y reiniciarlo ante fallos:

```bash
npm install -g pm2
pm2 start server.js --name mini-blog-api
pm2 save
```

- Configurar un **proxy inverso** con Nginx para exponer el puerto 80/443.
- Usar **SSL/TLS** (Let's Encrypt) para HTTPS.
- Nunca exponer las credenciales de la DB en el código fuente.

---

## Autor

Desarrollado por el equipo backend de **DevSpark** como base del servicio de contenidos Miniblog.


