
import { describe, test, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("📝 Suite de Pruebas: Endpoints de Publicaciones (/posts)", () => {
    let validAuthorId;

    // Con beforeAll preparamos el entorno antes de correr los tests de posts
    beforeAll(async () => {
        // Creamos un autor real en la base de datos para tener un author_id válido
        const res = await request(app)
            .post("/authors")
            .send({
                name: "Autor para Posts",
                email: `escritor.${Date.now()}@devspark.com`,
                bio: "Redactor de pruebas"
            });
        
        validAuthorId = res.body.data.id;
    });

    // ==========================================
    // 🟢 FLUJOS EXITOSOS (Casos de Éxito)
    // ==========================================

    test("GET /posts - Debería retornar todas las publicaciones con estado 200", async () => {
        const res = await request(app).get("/posts");
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("POST /posts - Debería registrar un post exitosamente con estado 201", async () => {
        const res = await request(app)
            .post("/posts")
            .send({
                title: "Iniciando en DevSpark",
                content: "Este es el contenido inicial del miniblog corporativo.",
                author_id: validAuthorId, // Usa el ID del autor creado arriba
                published: true
            });

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.title).toBe("Iniciando en DevSpark");
    });

    // ==========================================
    // 🔴 FLUJOS DE ERROR Y CASOS LÍMITE (Edge Cases)
    // ==========================================

    test("GET /posts - Debería retornar 400 si el query param 'published' es corrupto", async () => {
        const res = await request(app).get("/posts?published=no_se_sabe");

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("POST /posts - Debería rebotar con 400 si el título supera los 200 caracteres de la DB", async () => {
        // Generamos un string kilométrico que pase los 200 caracteres permitidos por el VARCHAR
        const tituloLargo = "a".repeat(205); 

        const res = await request(app)
            .post("/posts")
            .send({
                title: tituloLargo,
                content: "Contenido válido",
                author_id: validAuthorId,
                published: false
            });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
        expect(res.body.error.message).toContain("excede el límite");
    });

    test("POST /posts - Debería retornar 400 si el author_id enviado no es un número entero", async () => {
        const res = await request(app)
            .post("/posts")
            .send({
                title: "Post Inválido",
                content: "Contenido",
                author_id: "un_id_con_letras", // Tipo incorrecto
                published: false
            });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
});