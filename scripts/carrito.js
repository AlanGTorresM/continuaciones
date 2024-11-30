import { supabase } from './Base de datos/supabase.js'; // Importa tu configuración de Supabase

export function mostrarCarrito() {
    const carritoContenido = document.querySelector("#carrito-contenido");
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoContenido.innerHTML = ''; // Limpiamos el contenido previo

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p class="text-gray-600">El carrito está vacío.</p>';
        return;
    }

    carrito.forEach(item => {
        const productoCarrito = document.createElement('div');
        productoCarrito.className = 'flex justify-between items-center border-b pb-2';
        productoCarrito.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${item.images[0] || 'images/default.jpg'}" alt="${item.nombre}" class="w-16 h-16 rounded-lg object-cover">
                <div>
                    <h4 class="text-sm font-semibold">${item.nombre}</h4>
                    <p class="text-xs text-gray-600">Precio unitario: $${item.precio.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="disminuir-cantidad bg-gray-300 text-gray-800 px-2 rounded" data-id="${item.id}">-</button>
                <p class="cantidad text-sm font-semibold">${item.cantidad}</p>
                <button class="aumentar-cantidad bg-gray-300 text-gray-800 px-2 rounded" data-id="${item.id}">+</button>
            </div>
            <div class="text-right">
                <p class="text-sm font-bold text-orange-500">$${(item.precio * item.cantidad).toFixed(2)}</p>
                <button class="text-red-500 text-xs hover:text-red-700 transition eliminar-item" data-id="${item.id}">Eliminar</button>
            </div>
        `;

        // Eventos para botones
        productoCarrito.querySelector('.disminuir-cantidad').addEventListener('click', () => {
            actualizarCantidad(item.id, -1);
        });
        productoCarrito.querySelector('.aumentar-cantidad').addEventListener('click', () => {
            actualizarCantidad(item.id, 1, item.stock); // Pasamos el stock máximo
        });
        productoCarrito.querySelector('.eliminar-item').addEventListener('click', () => {
            eliminarDelCarrito(item.id);
        });

        carritoContenido.appendChild(productoCarrito);
    });
}
async function actualizarCantidad(productId, cantidadCambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(item => item.id === productId);

    if (!producto) return;

    try {
        // Consultar stock en tiempo real desde Supabase
        const { data: productoSupabase, error } = await supabase
            .from('productos')
            .select('stock')
            .eq('id', productId)
            .single();

        if (error) {
            console.error('Error al consultar el stock desde Supabase:', error.message);
            alert('Hubo un error al consultar el stock disponible. Inténtalo de nuevo.');
            return;
        }

        const stockDisponible = productoSupabase.stock;
        const nuevaCantidad = producto.cantidad + cantidadCambio;

        if (nuevaCantidad <= 0) {
            // Si la cantidad es 0 o menor, eliminamos el producto del carrito
            eliminarDelCarrito(producto.id);
            return;
        }

        if (nuevaCantidad > stockDisponible) {
            alert(`Solo hay ${stockDisponible} unidades disponibles de "${producto.nombre}".`);
            return;
        }

        // Actualizar la cantidad en el carrito
        producto.cantidad = nuevaCantidad;

        // Guardar cambios en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizar la interfaz
        mostrarCarrito();
    } catch (err) {
        console.error('Error al actualizar la cantidad:', err.message);
        alert('Hubo un error inesperado. Inténtalo de nuevo.');
    }
}
export function eliminarDelCarrito(productId) {
    // Obtener el carrito actual desde el localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}
