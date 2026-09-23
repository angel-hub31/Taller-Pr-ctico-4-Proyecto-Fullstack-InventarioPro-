import { type Request, type Response } from "express";
import prisma from "../database/prisma.js";

export const obtenerInventarios = async (req: Request, res: Response) => {
    try {
        const inventarios = await prisma.producto.findMany();
        res.json(inventarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener inventarios" });
    }
}

export const crearInventario = async (req: Request, res: Response) => {
    const { nombre, precio, categoria, fotoBase64,codigoBarras } = req.body;

    try {
        const nuevoInventario = await prisma.producto.create({
            data: {
                nombre,
                precio,
                categoria,
                fotoBase64,
                codigoBarras,
            }
        });
        res.status(201).json(nuevoInventario);
    } catch (error) {
        console.log("Fallo al guardar en DB:", error);
        res.status(500).json({ error: "Error al crear inventario" });
    }
}

export const actualizarInventario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, precio, categoria, fotoBase64, codigoBarras } = req.body;

    try {
        const inventarioActualizado = await prisma.producto.update({
            where: { id: Number(id) },
            data: {
                nombre,
                precio,
                categoria,
                fotoBase64,
                codigoBarras,
            }
        });
        res.json(inventarioActualizado);
    } catch (error) {
        res.status(404).json({ error: "Inventario no encontrado" });
    }
}

export const eliminarInventario = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.producto.delete({
            where: { id: Number(id) }
        });
        res.json({ exito: "Inventario eliminado" });
    } catch (error) {
        res.status(404).json({ error: "Inventario no encontrado" });
    }
}