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
                <img src="${item.images[0] || 'images/default.jpg'}" alt="${item.nombre}" class="rounded-lg object-cover">
                <div>
                    <h4 class="text-sm font-semibold">${item.nombre}</h4>
                    <p class="text-xs text-gray-600">Cantidad: ${item.cantidad}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-bold text-orange-500">$${(item.precio * item.cantidad).toFixed(2)}</p>
                <button class="text-red-500 text-xs hover:text-red-700 transition eliminar-item" data-id="${item.id}">Eliminar</button>
            </div>
        `;

        // Evento para eliminar producto
        productoCarrito.querySelector('.eliminar-item').addEventListener('click', () => {
            eliminarDelCarrito(item.id);
        });

        carritoContenido.appendChild(productoCarrito);
    });
}
export function eliminarDelCarrito(productId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productId);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito(); // Recargar el carrito
}
