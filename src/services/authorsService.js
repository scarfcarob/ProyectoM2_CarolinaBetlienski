
import pool from "../config/db.js";


// Helper que crea errores con formato estándar
function notFound(message) {
    const err = new Error(message);
    err.status = 404;
    err.code = "NOT_FOUND";
    return err;
}


export async function getAll() {
    const result = await pool.query(
        "SELECT id, name, email, bio, created_at FROM authors ORDER BY created_at DESC"
    );
    return result.rows;
}


export async function getById(id) {
    const result = await pool.query(
        "SELECT id, name, email, bio, created_at FROM authors WHERE id = $1",
        [id]
    );
    if (result.rows.length === 0) throw notFound("Autor no encontrado");
    return result.rows[0];
}


export async function create({ name, email, bio }) {
    const result = await pool.query(
        `INSERT INTO authors (name, email, bio)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, bio, created_at`,
        [name, email, bio || null]
    );
    return result.rows[0];
}


export async function update(id, { name, email, bio }) {
    const result = await pool.query(
        `UPDATE authors SET name = $1, email = $2, bio = $3
         WHERE id = $4
         RETURNING id, name, email, bio, created_at`,
        [name, email, bio || null, id]
    );
    if (result.rows.length === 0) throw notFound("Autor no encontrado");
    return result.rows[0];
}


export async function remove(id) {
    const result = await pool.query(
        "DELETE FROM authors WHERE id = $1 RETURNING id",
        [id]
    );
    if (result.rows.length === 0) throw notFound("Autor no encontrado");
}