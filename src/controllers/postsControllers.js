
import * as postsService from "../services/postsService.js";

import { isValidPostgresId, sanitizeObject } from "../utils/validationHelper.js";


function sendValidationError(res, message) {
    return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message }
    });
}

export async function getAll(req, res, next) {
    try {
        const { published } = req.query;

        
        if (published !== undefined && published !== "true" && published !== "false") {
            return sendValidationError(res, "El filtro 'published' solo admite los valores string exactos 'true' o 'false'.");
        }

        const filter = published !== undefined ? published === "true" : undefined;
        const posts = await postsService.getAll(filter);
        res.status(200).json({ data: posts });
    } catch (err) {
        next(err);
    }
}

export async function getById(req, res, next) {
    try {
        if (!isValidPostgresId(req.params.id)) {
            return sendValidationError(res, "El ID de la publicación debe ser un número entero de 32 bits válido.");
        }
        const post = await postsService.getById(req.params.id);
        res.status(200).json({ data: post });
    } catch (err) {
        next(err);
    }
}

export async function getByAuthorId(req, res, next) {
    try {
        if (!isValidPostgresId(req.params.authorId)) {
            return sendValidationError(res, "El parámetro authorId debe ser un número entero de 32 bits válido.");
        }
        const posts = await postsService.getByAuthorId(req.params.authorId);
        res.status(200).json({ data: posts });
    } catch (err) {
        next(err);
    }
}

export async function create(req, res, next) {
    try {
        const { sanitized, hasExtraFields, extraFields } = sanitizeObject(req.body, ["title", "content", "author_id", "published"]);
        if (hasExtraFields) {
            return sendValidationError(res, `Campos inyectados no permitidos en posts: [${extraFields.join(", ")}]`);
        }

        const { title, content, author_id, published } = sanitized;

        if (!title || typeof title !== "string" || !title.trim()) {
            return sendValidationError(res, "El campo 'title' es requerido y debe ser texto.");
        }
        if (!content || typeof content !== "string" || !content.trim()) {
            return sendValidationError(res, "El campo 'content' es requerido y debe ser texto.");
        }
        
        
        if (!isValidPostgresId(author_id)) {
            return sendValidationError(res, "El campo 'author_id' es obligatorio y debe ser un ID de autor entero y válido.");
        }

        if (title.trim().length > 200) {
            return sendValidationError(res, "El campo 'title' excede el límite de 200 caracteres de la base de datos.");
        }

        
        const isPublished = published === true || published === "true";

        const post = await postsService.create({
            title: title.trim(),
            content: content.trim(),
            author_id: Number(author_id),
            published: isPublished
        });
        res.status(201).json({ data: post });
    } catch (err) {
        next(err);
    }
}

export async function update(req, res, next) {
    try {
        if (!isValidPostgresId(req.params.id)) {
            return sendValidationError(res, "El ID de la publicación en la ruta es inválido.");
        }

        const { sanitized, hasExtraFields, extraFields } = sanitizeObject(req.body, ["title", "content", "author_id", "published"]);
        if (hasExtraFields) {
            return sendValidationError(res, `Actualización denegada por propiedades extra: [${extraFields.join(", ")}]`);
        }

        const { title, content, author_id, published } = sanitized;

        if (!title || typeof title !== "string" || !title.trim()) {
            return sendValidationError(res, "El campo 'title' no puede ser nulo o vacío.");
        }
        if (!content || typeof content !== "string" || !content.trim()) {
            return sendValidationError(res, "El campo 'content' no puede ser nulo o vacío.");
        }
        if (!isValidPostgresId(author_id)) {
            return sendValidationError(res, "El campo 'author_id' provisto debe ser un ID válido.");
        }
        if (title.trim().length > 200) {
            return sendValidationError(res, "El campo 'title' supera la longitud permitida.");
        }

        const isPublished = published === true || published === "true";

        const post = await postsService.update(req.params.id, {
            title: title.trim(),
            content: content.trim(),
            author_id: Number(author_id),
            published: isPublished
        });
        res.status(200).json({ data: post });
    } catch (err) {
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        if (!isValidPostgresId(req.params.id)) {
            return sendValidationError(res, "El ID proporcionado para eliminar el post no es válido.");
        }
        await postsService.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}


