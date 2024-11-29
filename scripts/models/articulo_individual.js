import { supabase } from './../Base de datos/supabase.js';

async function cargarProductos() {
    const productosContainer = document.querySelector('.products .grid');
    
    try {
        // Obtener datos de la tabla 'productos'
        const { data: productos, error } = await supabase
            .from('productos')
            .select('*'); // Selecciona todos los registros

        if (error) {
            console.error('Error al cargar productos:', error.message);
            return;
        }

        // Limpiar el contenedor por si tiene contenido previo
        productosContainer.innerHTML = '';

        // Crear e inyectar las tarjetas de productos
        productos.forEach(producto => {
            const tarjetaProducto = document.createElement('div');
            tarjetaProducto.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
            tarjetaProducto.innerHTML = `
                <img src="${producto.images[0] || 'images/default.jpg'}" alt="${producto.nombre}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800">${producto.nombre}</h3>
                    <p class="text-gray-600 mt-2">${producto.descripcion}</p>
                    <span class="text-orange-500 font-bold text-lg mt-4 block">$${producto.precio} MXN</span>
                    <div class="mt-4 flex gap-2">
                        <button class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                            Comprar
                        </button>
                        <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                            Añadir al carrito
                        </button>
                        <button class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                            Wishlist
                        </button>
                    </div>
                </div>
            `;
            productosContainer.appendChild(tarjetaProducto);
        });
    } catch (error) {
        console.error('Error al obtener los objetos:', error.message);
    }
}

// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
