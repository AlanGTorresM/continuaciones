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
            if (producto.stock > 0 && JSON.parse(localStorage.getItem('user'))['id'] != producto.vendedor_id){
                console.log(productos.vendedor_id);
                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
                tarjetaProducto.innerHTML = `
                <img src="${producto.images[0] || 'images/default.jpg'}" alt="${producto.nombre}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800">${producto.nombre}</h3>
                    <p class="text-gray-600 mt-2">${producto.descripcion}</p>
                    <span class="text-orange-500 font-bold text-lg mt-4 block">$${producto.precio} MXN</span>
                    <button class="px-4 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition comprar-btn">
                        Comprar
                    </button>
                </div>
                `;
                tarjetaProducto.querySelector('.comprar-btn').addEventListener('click', () => {
                // Guardar datos del producto en localStorage
                localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                // Redirigir a la página de compra
                window.location.href = 'compras.html';
            });
            productosContainer.appendChild(tarjetaProducto);
            } 
        });
    } catch (error) {
        console.error('Error al obtener los objetos:', error.message);
    }
}


if (document.querySelector('.products')) {
    document.addEventListener('DOMContentLoaded', cargarProductos);
}

if (window.location.pathname.includes('compra.html')) {
    const productoSeleccionado = JSON.parse(localStorage.getItem('productoSeleccionado'));
    if (productoSeleccionado) {
        document.getElementById('product-image').src = productoSeleccionado.images[0] || 'images/default.jpg';
        document.getElementById('product-name').textContent = productoSeleccionado.nombre;
        document.getElementById('product-description').textContent = productoSeleccionado.descripcion;
        document.getElementById('product-price').textContent = `$${productoSeleccionado.precio} MXN`;
    }
}


// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
