
import express from 'express';
import pool from './src/config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());



// deficion de una ruta
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
}); 



// Probando Arrays en rutas - Obtener todos los posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Obtener un post especifico por su ID
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ mensaje: 'Post no encontrado' });
  }

  res.json(post);
});


// Crear un nuevo post para probar guardar datos en el array
app.post('/posts', (req, res) => {
  const nuevoPost ={
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
  }; 

  posts.push(nuevoPost);
  res.status(201).json(nuevoPost);
}); 




// Array simulando una base de datos en memoria
let authores =[
  {id: 1, name: 'Ana Garcia', email: 'ana.garcia@example.com', bio: 'Desarrolladora full-stack apasionada por Node.js}'},
  
  {id:2, name: 'Carlos Ruiz', email: 'carlos@example.com', bio: 'Escritor tecnico especializado en Base de Daros'},

  {id:3, name: 'Maria Lopez', email: 'maria.lopez@example.com', bio: 'Ingeniera de Software con foco en APIs y REST'}

]

let posts = [
  {id: 1, title: 'Introduccion a Node.js', content: 'Node.js es un runtime de Javascript....', author_id: 1, published: true},

  {id: 2, title: 'PostgreSQL vs MySQL', content: 'Ambas bases de datos tienen ventajas', author_id: 2, published: true},

  {id: 3, title: 'APIs RESTful', content: 'REST es un estilo arquitectonico', author_id: 1, published: true},

  {id: 4, title: 'Manejo de errores en Express', content: ' El manejo apropiado de errores', author_id: 3, published: false },

  {id: 5, title: 'Async/Await explicado', content: 'Las promesas simplifican el codigo asincrono', author_id: 3, published: false}

];


// Middleware de manejo de errores antes del Listener
app.use((req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal!" });
});

 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
