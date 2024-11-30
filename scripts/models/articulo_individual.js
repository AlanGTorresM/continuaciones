import { supabase } from './../Base de datos/supabase.js';


async function cargarProductos() {
    const productosContainer = document.querySelector('.products .grid');

    try {
        const { data: productos, error } = await supabase
            .from('productos')
            .select('*');

        if (error) {
            console.error('Error al cargar productos:', error.message);
            return;
        }

        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            if (producto.stock > 0 && JSON.parse(localStorage.getItem('user'))['id'] != producto.vendedor_id) {
                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
                tarjetaProducto.innerHTML = `
                <img src="${producto.images[0] || 'images/default.jpg'}" alt="${producto.nombre}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800">${producto.nombre}</h3>
                    <p class="text-gray-600 mt-2">${producto.descripcion}</p>
                    <span class="text-orange-500 font-bold text-lg mt-4 block">$${producto.precio} MXN</span>
                    <div class="flex gap-4 mt-4">
                        <button class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition comprar-btn">
                            Comprar
                        </button>
                        <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition carrito-btn">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
                `;

                // Redirigir a compra
                tarjetaProducto.querySelector('.comprar-btn').addEventListener('click', () => {
                    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                    window.location.href = 'compras.html';
                });

                // Agregar al carrito
                tarjetaProducto.querySelector('.carrito-btn').addEventListener('click', () => {
                    agregarAlCarrito(producto);
                });

                productosContainer.appendChild(tarjetaProducto);
            }
        });
    } catch (error) {
        console.error('Error al obtener los objetos:', error.message);
    }
}

// Función para agregar al carrito
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
        existe.cantidad += 1; // Incrementar cantidad si ya está en el carrito
    } else {
        carrito.push({ ...producto, cantidad: 1 }); // Agregar nuevo producto
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`"${producto.nombre}" ha sido agregado al carrito.`);
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
