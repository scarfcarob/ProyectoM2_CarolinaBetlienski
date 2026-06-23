

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

        // Caso Edge: Validar tipos incorrectos en Query params
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
        
        // Caso Edge: Validar tipos correctos enteros para llaves foráneas y desbordes numéricos
        if (!isValidPostgresId(author_id)) {
            return sendValidationError(res, "El campo 'author_id' es obligatorio y debe ser un ID de autor entero y válido.");
        }

        if (title.trim().length > 200) {
            return sendValidationError(res, "El campo 'title' excede el límite de 200 caracteres de la base de datos.");
        }

        // Caso Edge: Forzar coerción limpia de booleanos redundantes
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
































//=======================================================

//import * as postsService from "../services/postsService.js";












//export async function getAll(req, res, next) {
    //try {
        
        //let published = undefined;
        //if (req.query.published === "true") published = true;
        //if (req.query.published === "false") published = false;

        //const posts = await postsService.getAll(published);
        //res.status(200).json({ data: posts });
    //} catch (err) {
        //next(err);
    //}
//}


//export async function getById(req, res, next) {
    //try {
        //const post = await postsService.getById(req.params.id);
        //res.status(200).json({ data: post });
    //} catch (err) {
        //next(err);
    //}
//}


//export async function getByAuthor(req, res, next) {
    //try {
        //const posts = await postsService.getByAuthor(req.params.authorId);
        //res.status(200).json({ data: posts });
    //} catch (err) {
        //next(err);
    //}
//}


//export async function create(req, res, next) {
    //try {
        //const { title, content, author_id, published } = req.body;

        //if (!title || !title.trim()) {
            //return res.status(400).json({
                //error: {
                    //code: "VALIDATION_ERROR",
                    //message: "El campo title es obligatorio"
                //}
            //});
        //}
        //if (!content || !content.trim()) {
            //return res.status(400).json({
                //error: {
                    //code: "VALIDATION_ERROR",
                    //message: "El campo content es obligatorio"
                //}
            //});
        //}
        //if (!author_id) {
            //return res.status(400).json({
                //error: {
                    //code: "VALIDATION_ERROR",
                    //message: "El campo author_id es obligatorio"
                //}
            //});
        //}

        //const post = await postsService.create({
            //title: title.trim(),
            //content: content.trim(),
            //author_id,
            //published
        //});
        //res.status(201).json({ data: post });
    //} catch (err) {
        //next(err);
    //}
//}


//export async function update(req, res, next) {
    //try {
        //const { title, content, published } = req.body;

        //if (!title || !title.trim()) {
            //return res.status(400).json({
                //error: {
                    //code: "VALIDATION_ERROR",
                    //message: "El campo title es obligatorio"
                //}
            //});
        //}
        //if (!content || !content.trim()) {
            //return res.status(400).json({
                //error: {
                    //code: "VALIDATION_ERROR",
                    //message: "El campo content es obligatorio"
                //}
            //});
        //}

        //const post = await postsService.update(req.params.id, {
            //title: title.trim(),
            //content: content.trim(),
            //published
        //});
        //res.status(200).json({ data: post });
    //} catch (err) {
        //next(err);
    //}
//}


//export async function remove(req, res, next) {
    //try {
        //await postsService.remove(req.params.id);
        //res.status(204).send();
    //} catch (err) {
        //next(err);
    //}
//}
