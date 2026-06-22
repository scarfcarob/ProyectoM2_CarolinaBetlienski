

function errorHandler(err, req, res, next) {

    console.error(err);

    // Email duplicado — PostgreSQL code 23505
    if (err.code === "23505") {
        return res.status(400).json({
            error: { code: "CONFLICT", message: "El email ya está registrado" }
        });
    }

    
    if (err.code === "23502") {
        return res.status(400).json({
            error: { code: "VALIDATION_ERROR", message: "Hay campos obligatorios sin completar" }
        });
    }

    
    if (err.code === "23503") {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "El author_id no corresponde a ningún autor existente" }
        });
    }


    if (err.code === "22P02") {
        return res.status(400).json({
            error: {
                code: "BAD_REQUEST",
                message: "El formato del ID proporcionado no es válido. Debe ser un número entero."
            }
        });
    }

    
    if (err.status) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message }
        });
    }

    
    return res.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" }
    });
}

export default errorHandler;