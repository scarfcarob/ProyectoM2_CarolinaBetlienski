
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Permite usar funciones como describe, test, expect sin importarlas en cada archivo
    globals: true,
    // Define el entorno de ejecución (Node en lugar de un navegador)
    environment: 'node',
    // Patrón para buscar tus archivos de prueba dentro de la carpeta tests/
    include: ['tests/**/*.test.js']
  },
});