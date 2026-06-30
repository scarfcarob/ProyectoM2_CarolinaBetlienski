
import process from 'node:process';
import app from './src/app.js';
import pool from './src/config/db.js';



// 1. Intentamos cargar el archivo .env (Solo funcionará en desarrollo local)
//try {
  //process.loadEnvFile();
//} catch (error) {
  //console.warn("⚠️ Archivo .env no encontrado. Se usarán los valores por defecto del entorno.");
//}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de DevSpark corriendo en http://localhost:${PORT}`);
});














