export function inicio_sesion(){
    return `<div id="iniciar_Sesion" class="anuncio absolute bg-orange-200 bg-opacity-80 w-4/5 h-4/5 left-16 top-12 p-6 rounded-lg shadow-lg text-center flex flex-col justify-center items-center">
        <form class="w-full max-w-sm">
            <fieldset class="border border-gray-300 rounded-lg p-4">
                <legend class="text-lg font-semibold text-orange-600">Iniciar Sesión!</legend>
                
                <div class="mb-4">
                    <label for="Correo" class="block text-sm font-medium text-gray-700 mb-1">Ingresa tu correo:</label>
                    <input type="email" id="Correo" placeholder="--Aquí tu correo--"
                        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                </div>
                
                <div class="mb-4">
                    <label for="Password" class="block text-sm font-medium text-gray-700 mb-1">Ingresa tu contraseña:</label>
                    <input type="password" id="Password" placeholder="Aquí tu contraseña"
                        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                </div>
                
                <button type="submit"
                    class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    Iniciar Sesión
                </button>
            </fieldset>
        </form>
    </div>`;
}