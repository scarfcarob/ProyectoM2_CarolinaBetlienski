
// Clase utilitaria para lanzar errores operativos personalizados en las capas de servicios o controladores.
export class AppError extends Error {
    constructor(code, message, statusCode = 500, details = null) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true; 
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * MIDDLEWARE CENTRALIZADO DE MANEJO DE ERRORES
 */
function errorHandler(err, req, res, next) {
    
    
    let statusCode = err.statusCode || 500;
    let responseError = {
        code: err.code || "INTERNAL_ERROR",
        message: "Ocurrió un error interno en el servidor." 
    };

    
    if (err.details) {
        responseError.details = err.details;
    }



    if (err.code === "23505") {
        statusCode = 400;
        responseError.code = "CONFLICT";
        responseError.message = "El registro ya existe en el sistema.";
    }

    
    if (err.code === "23503") {
        statusCode = 404;
        responseError.code = "NOT_FOUND";
        responseError.message = "El recurso asociado (ID de referencia) no existe.";
    }

    
    if (err.code === "22003" || err.code === "22P02") {
        statusCode = 400;
        responseError.code = "BAD_REQUEST";
        responseError.message = "Los datos numéricos proporcionados exceden los límites o tienen un formato inválido.";
    }

    
    if (err.isOperational) {
        statusCode = err.statusCode;
        responseError.code = err.code;
        responseError.message = err.message;
    }

    
    
    const timestamp = new Date().toISOString();
    
    if (statusCode >= 500) {
         
        console.error(`[${timestamp}] [CRITICAL] [${req.method} ${req.url}]:`, err.stack);
    } else {
        
        console.warn(`[${timestamp}] [WARN] [${req.method} ${req.url}] [${responseError.code}]: ${responseError.message}`);
    }

    
    return res.status(statusCode).json({
        error: responseError
    });
}

export default errorHandler;













