export function headerIsLoggedIn(nombre){
    const header = document.querySelector("#navegador");
    header.innerHTML = 
    `
    <nav class="container mx-auto flex justify-between items-center p-6">
                <h1 class="text-2xl font-bold text-orange-400">SHOPSCRIPT</h1>
                <p class="text-2xl font-bold text-orange-400">Hola ${nombre}!</p>
                <ul class="flex space-x-6">
                    <li class="text-orange-400 hover:text-green-500 transition-colors"><a href="paginaPincipal.html">Inicio</a></li>
                    <li id="cerrar_sesion" class="text-orange-400 hover:text-green-500 transition-colors"><a href="#">Cerrar sesión</a></li>
                    <li class="text-orange-400 hover:text-green-500 transition-colors"><a href="#footer">Contacto</a></li>
                </ul>
            </nav>
    `;
    const cerrarSesionBtn = document.querySelector("#cerrar_sesion");
    cerrarSesionBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        headerIsNotLoggedIn();
        location.reload();
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