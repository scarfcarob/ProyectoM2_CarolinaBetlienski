
import { Router } from "express";
import * as postsController from "../controllers/postsControllers.js";





const router = Router();

router.get("/", postsController.getAll);
router.get("/author/:authorId", postsController.getByAuthorId); 
router.get("/:id", postsController.getById);
router.post("/", postsController.create);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.remove);







export default router;
 
