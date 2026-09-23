import { Router } from "express";
import { obtenerInventarios,crearInventario,actualizarInventario,eliminarInventario } from "../controllers/controllers.js";

const router = Router();

router.get("/",obtenerInventarios);
router.post("/",crearInventario);
router.put("/:id",actualizarInventario);
router.delete("/:id",eliminarInventario);

export default router;