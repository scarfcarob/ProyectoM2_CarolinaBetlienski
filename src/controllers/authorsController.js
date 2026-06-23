
import * as authorsService from "../services/authorsService.js";

import { isValidPostgresId, isValidStrictEmail, sanitizeObject } from "../utils/validationHelper.js";

function sendValidationError(res, message) {
    return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message }
    });
}

export async function getAll(req, res, next) {
    try {
        const authors = await authorsService.getAll();
        res.status(200).json({ data: authors });
    } catch (err) {
        next(err);
    }
}

export async function getById(req, res, next) {
    try {

        if (!isValidPostgresId(req.params.id)) {
            return sendValidationError(res, "El ID debe ser un número entero positivo válido dentro del rango del sistema.");
        }
        const author = await authorsService.getById(req.params.id);
        res.status(200).json({ data: author });
    } catch (err) {
        next(err);
    }
}

export async function create(req, res, next) {
    try {

        const { sanitized, hasExtraFields, extraFields } = sanitizeObject(req.body, ["name", "email", "bio"]);
        if (hasExtraFields) {
            return sendValidationError(res, `Propiedades no permitidas en la solicitud: [${extraFields.join(", ")}]`);
        }

        const { name, email, bio } = sanitized;

        
        if (!name || typeof name !== "string" || !name.trim()) {
            return sendValidationError(res, "El campo 'name' es obligatorio y debe ser un texto válido.");
        }
        if (!email || typeof email !== "string" || !email.trim()) {
            return sendValidationError(res, "El campo 'email' es obligatorio y debe ser un texto válido.");
        }

        
        if (name.trim().length > 100) {
            return sendValidationError(res, "El campo 'name' supera el límite máximo de 100 caracteres.");
        }
        if (!isValidStrictEmail(email.trim())) {
            return sendValidationError(res, "El formato del correo electrónico provisto es inválido o excede los límites.");
        }

        const author = await authorsService.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            bio: bio ? String(bio).trim() : null
        });
        res.status(201).json({ data: author });
    } catch (err) {
        next(err);
    }
}

export async function update(req, res, next) {
    try {
        if (!isValidPostgresId(req.params.id)) {
            return sendValidationError(res, "El ID del autor en la ruta no tiene un formato válido.");
        }

        const { sanitized, hasExtraFields, extraFields } = sanitizeObject(req.body, ["name", "email", "bio"]);
        if (hasExtraFields) {
            return sendValidationError(res, `Modificación rechazada. Campos no admitidos: [${extraFields.join(", ")}]`);
        }

        const { name, email, bio } = sanitized;

        if (!name || typeof name !== "string" || !name.trim()) {
            return sendValidationError(res, "El campo 'name' no puede quedar vacío.");
        }
        if (!email || typeof email !== "string" || !email.trim()) {
            return sendValidationError(res, "El campo 'email' no puede quedar vacío.");
        }
        if (name.trim().length > 100) {
            return sendValidationError(res, "El campo 'name' supera los 100 caracteres.");
        }
        if (!isValidStrictEmail(email.trim())) {
            return sendValidationError(res, "El formato del correo electrónico es inválido.");
        }

        const author = await authorsService.update(req.params.id, {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            bio: bio ? String(bio).trim() : null
        });
        res.status(200).json({ data: author });
    } catch (err) {
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        if (!isValidPostgresId(req.params.id)) {
            return sendValidationError(res, "El ID de autor provisto para eliminación es inválido.");
        }
        await authorsService.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}






