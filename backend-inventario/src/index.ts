import express from "express";
import inventariosRouter from "./routes/inventario.js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }))


app.use("/productos", inventariosRouter)

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto: ", PORT)
})