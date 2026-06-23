
// Validar si un ID es un entero de 32 bits seguro para PostgreSQL (SERIAL max: 2147483647)
export function isValidPostgresId(id) {
    if (id === undefined || id === null) return false;
    const parsed = Number(id);
    // Evita strings con letras infiltradas ("123a"), decimales ("1.5") y desbordes numéricos (MAX_SAFE_INTEGER / Postgres INT)
    return Number.isInteger(parsed) && 
           String(id).trim() !== "" && 
           !isNaN(parsed) && 
           parsed > 0 && 
           parsed <= 2147483647; 
}

// Regex robusto para emails (Soporta formatos edge complejos y evita inyecciones sintácticas)
export function isValidStrictEmail(email) {
    if (!email || typeof email !== "string") return false;
    const strictRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return strictRegex.test(email) && email.length <= 150;
}

// Filtra propiedades no deseadas (Evita que inyecten campos extra en el req.body)
export function sanitizeObject(body, allowedFields) {
    const sanitized = {};
    const extraFields = [];
    
    // Detectar si mandaron basura extra no mapeada en el contrato de la API
    for (const key in body) {
        if (allowedFields.includes(key)) {
            sanitized[key] = body[key];
        } else {
            extraFields.push(key);
        }
    }
    
    return { sanitized, hasExtraFields: extraFields.length > 0, extraFields };
}