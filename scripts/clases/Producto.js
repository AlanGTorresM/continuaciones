/* Ya no se ocupo!!! */
import User from './users.js';
import { supabase } from './Base de datos/supabase.js';
class Producto {
    static id = 1;

    constructor(nombre, precio, descripcion, stock, vendedor) {
        if (!(vendedor instanceof User)) {
            throw new Error('El vendedor debe ser una instancia de la clase User');
        }

        this.id = Producto.id++;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.stock = stock;
        this.images = [];
        this.vendedorId = vendedor.id; // Guardar el ID del vendedor
        this.vendedorName = vendedor.name; // Guardar el nombre del vendedor (opcional)
    }
}
