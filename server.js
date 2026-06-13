
import express from 'express';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());







app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



