import { mostrarCarrito } from './../carrito.js';
export function headerIsLoggedIn(nombre) {
    const header = document.querySelector("#navegador");
    header.innerHTML = 
    `
    <nav class="container mx-auto flex justify-between items-center p-6">
        <h1 class="text-2xl font-bold text-orange-400">SHOPSCRIPT</h1>
        <p class="text-2xl font-bold text-orange-400">Hola ${nombre}!</p>
        <ul class="flex space-x-6">
            <li id="carrito" class="text-orange-400 hover:text-green-500 transition-colors"><a href="#">Carrito</a></li>
            <li class="text-orange-400 hover:text-green-500 transition-colors"><a href="paginaPincipal.html">Inicio</a></li>
            <li id="cerrar_sesion" class="text-orange-400 hover:text-green-500 transition-colors"><a href="#">Cerrar sesión</a></li>
            <li class="text-orange-400 hover:text-green-500 transition-colors"><a href="#footer">Contacto</a></li>
        </ul>
    </nav>
    <div id="carrito-modal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg w-96 p-6">
            <h2 class="text-xl font-bold mb-4">Tu carrito</h2>
            <div id="carrito-contenido" class="space-y-4">
                <!-- Productos se agregarán aquí dinámicamente -->
            </div>
            <div class="mt-4 flex justify-between items-center">
                <button id="cerrar-carrito" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cerrar</button>
                <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Finalizar compra</button>
            </div>
        </div>
    </div>
    `;

    const cerrarSesionBtn = document.querySelector("#cerrar_sesion");
    cerrarSesionBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        headerIsNotLoggedIn();
        location.reload();
    });

    // Mostrar y cargar carrito
    const carritoBtn = document.querySelector("#carrito");
    const carritoModal = document.querySelector("#carrito-modal");
    const cerrarCarritoBtn = document.querySelector("#cerrar-carrito");

    carritoBtn.addEventListener('click', () => {
        mostrarCarrito();
        carritoModal.classList.remove('hidden');
    });

    cerrarCarritoBtn.addEventListener('click', () => {
        carritoModal.classList.add('hidden');
    });
}

export function headerIsNotLoggedIn(){
    const header = document.querySelector("#navegador");
    header.innerHTML = 
    `
    <nav class="container mx-auto flex justify-between items-center p-6">
            <h1 class="text-2xl font-bold text-orange-400">SHOPSCRIPT</h1>
            <ul class="flex space-x-6">
                <li class="text-orange-400 hover:text-green-500 transition-colors"><a href="crear_sesion.html">Crear cuenta</a></li>
                <li id="iniciar_sesion" class="text-orange-400 hover:text-green-500 transition-colors"><a href="#">Iniciar Sesión</a></li>
                <li class="text-orange-400 hover:text-green-500 transition-colors"><a href="#footer">Contacto</a></li>
            </ul>
        </nav>
    `;
}