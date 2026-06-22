
import process from 'node:process';
import app from './src/app.js';
import pool from './src/config/db.js';



try {
  process.loadEnvFile();
} catch (error) {
  console.warn("⚠️ Archivo .env no encontrado. Se usarán los valores por defecto locales.");
}


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    //console.log(`🚀 Servidor de DevSpark corriendo en http://localhost:${PORT}`);
});

