
import * as authorsService from "../services/authorsService.js";



// GET /authors
export async function getAll(req, res, next) {
    try {
        const authors = await authorsService.getAll();
        res.status(200).json({ data: authors });
    } catch (err) {
        next(err);
    }
}

// GET /authors/:id
export async function getById(req, res, next) {
    try {
        const author = await authorsService.getById(req.params.id);
        res.status(200).json({ data: author });
    } catch (err) {
        next(err);
    }
}

// POST /authors
export async function create(req, res, next) {
    try {
        const { name, email, bio } = req.body;

        // validaciones antes de tocar la DB
        if (!name || !name.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo name es obligatorio"
                }
            });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo email es obligatorio"
                }
            });
        }

        const author = await authorsService.create({
            name: name.trim(),
            email: email.trim().toLowerCase(), // sanitizamos el email
            bio
        });
        res.status(201).json({ data: author });
    } catch (err) {
        next(err);
    }
}

// PUT /authors/:id
export async function update(req, res, next) {
    try {
        const { name, email, bio } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo name es obligatorio"
                }
            });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "El campo email es obligatorio"
                }
            });
        }

        const author = await authorsService.update(req.params.id, {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            bio
        });
        res.status(200).json({ data: author });
    } catch (err) {
        next(err);
    }
}

// DELETE /authors/:id
export async function remove(req, res, next) {
    try {
        await authorsService.remove(req.params.id);
        res.status(204).send(); // 204 = sin body
    } catch (err) {
        next(err);
    }
}
