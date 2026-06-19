
import process from 'node:process';
import app from './src/app.js';

import pool from './src/config/db.js';





// Cargar las variables de entorno de forma nativa (.env por defecto)
try {
  process.loadEnvFile();
} catch (error) {
  console.warn("⚠️ Archivo .env no encontrado. Se usarán los valores por defecto locales.");
}

// Configuración del puerto asignado por el entorno o el puerto local por defecto
const PORT = process.env.PORT || 3000;

// Inicialización del listener del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor de DevSpark corriendo en http://localhost:${PORT}`);
});

