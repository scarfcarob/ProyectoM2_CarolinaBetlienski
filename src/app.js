
import express from "express";
import authorsRouter from "./routes/authorsRouter.js";
import postsRouter from "./routes/postsRouter.js";
import errorHandler from "./middleware/errorHandler.js";



const app = express();


app.use(express.json());


app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

// errorHandler después de todas las rutas
app.use(errorHandler);

export default app;





