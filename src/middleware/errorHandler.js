

// Este middleware captura todos los errores que los controladores
// le pasen con next(error) y los devuelve en formato estándar
function errorHandler(err, req, res, next) {

    console.error(err);

    // Email duplicado — PostgreSQL code 23505
    if (err.code === "23505") {
        return res.status(400).json({
            error: {
                code: "CONFLICT",
                message: "El email ya está registrado"
            }
        });
    }

    // Campo requerido ausente — PostgreSQL code 23502
    if (err.code === "23502") {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Hay campos obligatorios sin completar"
            }
        });
    }

    // author_id inexistente — PostgreSQL code 23503
    if (err.code === "23503") {
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: "El author_id no corresponde a ningún autor existente"
            }
        });
    }

    // Error personalizado lanzado desde los servicios (ej: ID no encontrado)
    if (err.status) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message
            }
        });
    }

    // Cualquier otro error no controlado
    return res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "Error interno del servidor"
        }
    });
}

export default errorHandler;