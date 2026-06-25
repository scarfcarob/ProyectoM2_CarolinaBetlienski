
import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js"; // Importa tu configuración centralizada de Express

describe("👥 Suite de Pruebas: Endpoints de Autores (/authors)", () => {

    // ==========================================
    // 🟢 FLUJOS EXITOSOS (Casos de Éxito)
    // ==========================================
    
    test("GET /authors - Debería retornar una lista de autores con estado 200", async () => {
        const res = await request(app).get("/authors");
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("POST /authors - Debería registrar un nuevo autor exitosamente con estado 201", async () => {
        // Usamos un email aleatorio para evitar conflictos con la restricción UNIQUE de tu BD
        const randomEmail = `developer.${Date.now()}@devspark.com`;
        
        const res = await request(app)
            .post("/authors")
            .send({
                name: "Esteban Trabajo",
                email: randomEmail,
                bio: "Back-end Engineer en DevSpark"
            });

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.name).toBe("Esteban Trabajo");
    });

    // ==========================================
    // 🔴 FLUJOS DE ERROR Y CASOS LÍMITE (Edge Cases)
    // ==========================================

    test("POST /authors - Debería rebotar la petición con 400 si se inyectan propiedades no permitidas (Caso Edge 5)", async () => {
        const res = await request(app)
            .post("/authors")
            .send({
                name: "Intruso",
                email: "intruso@devspark.com",
                isAdmin: true, // 👈 Propiedad basura no mapeada
                hack: "DROP TABLE authors;"
            });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
        expect(res.body.error.message).toContain("Propiedades no permitidas");
    });

    test("GET /authors/:id - Debería retornar 400 si el ID es gigante y desborda los bits de la DB (Caso Edge 4)", async () => {
        const idGigante = "9999999999999999"; // Excede el límite de un entero de 32 bits
        
        const res = await request(app).get(`/authors/${idGigante}`);

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
        expect(res.body.error.message).toContain("rango del sistema");
    });

    test("GET /authors/:id - Debería retornar 404 si el ID es válido pero no pertenece a ningún autor", async () => {
        const idInexistente = 99999; // Formato numérico correcto, pero no real
        
        const res = await request(app).get(`/authors/${idInexistente}`);

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe("NOT_FOUND");
    });
});