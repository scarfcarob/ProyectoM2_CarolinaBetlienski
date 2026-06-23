

export function isValidPostgresId(id) {
    if (id === undefined || id === null) return false;
    const parsed = Number(id);
    return Number.isInteger(parsed) && 
           String(id).trim() !== "" && 
           !isNaN(parsed) && 
           parsed > 0 && 
           parsed <= 2147483647; 
}


export function isValidStrictEmail(email) {
    if (!email || typeof email !== "string") return false;
    const strictRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return strictRegex.test(email) && email.length <= 150;
}


export function sanitizeObject(body, allowedFields) {
    const sanitized = {};
    const extraFields = [];
    
    
    for (const key in body) {
        if (allowedFields.includes(key)) {
            sanitized[key] = body[key];
        } else {
            extraFields.push(key);
        }
    }
    
    return { sanitized, hasExtraFields: extraFields.length > 0, extraFields };
}