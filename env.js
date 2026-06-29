
import process from 'node:process';


if (process.env.NODE_ENV !== 'production') {
  try {
    process.loadEnvFile('.env');
    console.log("ℹ️ Entorno de Desarrollo Local: Cargando variables desde .env");
  } catch (error) {
    console.warn("⚠️ Archivo .env no encontrado localmente.");
  }
}