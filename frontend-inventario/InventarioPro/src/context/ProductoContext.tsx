import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { api } from '../config/api';


export type Producto = {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    fotoBase64: string | null;
    codigoBarras?: string | null;
    createdAt: string;


}

type ProductoContextType = {
    productos: Producto[]
    fetchProductos: () => void
    addProducto: (producto: Omit<Producto, 'id' | 'createdAt'>) => Promise<boolean>
    updateProducto: (id: number, producto: Omit<Producto, 'id' | 'createdAt'>) => Promise<boolean>
    deleteProducto: (id: number) => void
}


const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export function ProductoProvider({ children }: { children: ReactNode }) {
    const [productos, setProductos] = useState<Producto[]>([])

    const fetchProductos = async () => {
        try {
            const response = await api.get('/productos')
            setProductos(response.data)

        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor local");
        }
    }
    useEffect(() => {
        fetchProductos();
    }, [])


    const addProducto = async (newProducto: Omit<Producto, 'id' | 'createdAt'>) => {
        try {
            const response = await api.post('/productos', newProducto)
            setProductos([...productos, response.data])
            return true;

        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el producto");
            return false;


        }
    }

    const updateProducto = async (id: number, productoActualizado: Omit<Producto, 'id' | 'createdAt'>) => {
        try {
            const response = await api.put(`/productos/${id}`, productoActualizado)
            setProductos(productos.map(c => c.id === id ? response.data : c))
            return true;

        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar");
            return false;
        }
    }



    const deleteProducto = async (id: number) => {
        try {
            await api.delete(`/productos/${id}`)
            setProductos(productos.filter(c => c.id !== id))

        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar");


        }
    };
    return (
        <ProductoContext.Provider value={{ productos, fetchProductos, addProducto, updateProducto, deleteProducto }}>
            {children}
        </ProductoContext.Provider>
    )

}

export function useProductos() {
    const context = useContext(ProductoContext)
    if (!context) throw new Error("Debe usarse dentro de un provider")
    return context;
}
