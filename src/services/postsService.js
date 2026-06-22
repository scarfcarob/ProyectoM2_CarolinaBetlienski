
import pool from "../config/db.js";



function notFound(message) {
    const err = new Error(message);
    err.status = 404;
    err.code = "NOT_FOUND";
    return err;
}


export async function getAll(published) {
    if (published !== undefined) {
        const result = await pool.query(
            "SELECT * FROM posts WHERE published = $1 ORDER BY created_at DESC",
            [published]
        );
        return result.rows;
    }
    const result = await pool.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
    );
    return result.rows;
}


export async function getById(id) {
    const result = await pool.query(
        "SELECT * FROM posts WHERE id = $1",
        [id]
    );
    if (result.rows.length === 0) throw notFound("Post no encontrado");
    return result.rows[0];
}


export async function getByAuthor(authorId) {
    const result = await pool.query(
        "SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC",
        [authorId]
    );
    
    return result.rows;
}


export async function create({ title, content, author_id, published = false }) {
    const result = await pool.query(
        `INSERT INTO posts (title, content, author_id, published)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, content, author_id, published]
    );
    return result.rows[0];
}


export async function update(id, { title, content, published }) {
    const result = await pool.query(
        `UPDATE posts SET title = $1, content = $2, published = $3
         WHERE id = $4
         RETURNING *`,
        [title, content, published, id]
    );
    if (result.rows.length === 0) throw notFound("Post no encontrado");
    return result.rows[0];
}


export async function remove(id) {
    const result = await pool.query(
        "DELETE FROM posts WHERE id = $1 RETURNING id",
        [id]
    );
    if (result.rows.length === 0) throw notFound("Post no encontrado");
}
