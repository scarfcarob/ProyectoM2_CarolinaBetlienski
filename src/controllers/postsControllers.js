
import * as postsService from "../services/postsService.js";





export async function getAll(req, res, next) {
    try {
        
        let published = undefined;
        if (req.query.published === "true") published = true;
        if (req.query.published === "false") published = false;

        const posts = await postsService.getAll(published);
        res.status(200).json({ data: posts });
    } catch (err) {
        next(err);
    }
}


export async function getById(req, res, next) {
    try {
        const post = await postsService.getById(req.params.id);
        res.status(200).json({ data: post });
    } catch (err) {
        next(err);
    }
}


export async function getByAuthor(req, res, next) {
    try {
        const posts = await postsService.getByAuthor(req.params.authorId);
        res.status(200).json({ data: posts });
    } catch (err) {
        next(err);
    }
}


export async function create(req, res, next) {
    try {
        const { title, content, author_id, published } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo title es obligatorio"
                }
            });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo content es obligatorio"
                }
            });
        }
        if (!author_id) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo author_id es obligatorio"
                }
            });
        }

        const post = await postsService.create({
            title: title.trim(),
            content: content.trim(),
            author_id,
            published
        });
        res.status(201).json({ data: post });
    } catch (err) {
        next(err);
    }
}


export async function update(req, res, next) {
    try {
        const { title, content, published } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo title es obligatorio"
                }
            });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo content es obligatorio"
                }
            });
        }

        const post = await postsService.update(req.params.id, {
            title: title.trim(),
            content: content.trim(),
            published
        });
        res.status(200).json({ data: post });
    } catch (err) {
        next(err);
    }
}


export async function remove(req, res, next) {
    try {
        await postsService.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
