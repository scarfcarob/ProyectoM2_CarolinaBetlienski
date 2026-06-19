
import { Router } from "express";
import * as authorsController from "../controllers/authorsController.js"





const router = Router();

router.get("/", authorsController.getAll);
router.get("/:id", authorsController.getById);
router.post("/", authorsController.create);
router.put("/:id", authorsController.update);
router.delete("/:id", authorsController.remove);

export default router;













