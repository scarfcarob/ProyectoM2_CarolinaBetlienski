
import express from "express";

import authorsRouter from "./routes/authorsRouter.js";
//import postsRouter from "./routes/postsRouter.js";
import errorHandler from "./middleware/errorHandler.js";



const app = express();

// parsear JSON en el body de cada request
app.use(express.json());

// rutas
app.use("/authors", authorsRouter);
//app.use("/posts", postsRouter);

// errorHandler SIEMPRE al final, después de todas las rutas
app.use(errorHandler);

export default app;





