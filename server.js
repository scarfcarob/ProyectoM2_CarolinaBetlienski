
import express from 'express';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
//app.use(express.json());

// Endpoint de salud
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});








