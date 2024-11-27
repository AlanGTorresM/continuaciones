import {anuncio} from './models/anuncio.js';
import {listenerScroll, listenerClose} from './models/anuncio_control.js'
import { inicio_sesion } from './models/iniciar_Sesion.js';
import {supabase} from './Base de datos/supabase.js'
// Mostrar anuncio principal
document.body.innerHTML += anuncio();
if (document.querySelector(".anuncio")) {
    listenerScroll();
    listenerClose(); // Activar cierre para este anuncio
}

// Manejar clic en "Iniciar Sesión"
// Delegar el evento en el `document`
document.addEventListener('click', (e) => {
    // Verificar si el clic fue en el enlace de "Iniciar Sesión"
    if (e.target.closest('#iniciar_sesion a')) {
        e.preventDefault(); // Evitar la redirección

        // Agregar formulario de inicio de sesión solo si no existe ya
        if (!document.querySelector('#iniciar_Sesion')) {
            document.body.innerHTML += inicio_sesion();
            listenerScroll();
            listenerClose(); // Activar cierre para el formulario
        }
        //Validar información en supabase
        const loginButton = document.querySelector('#iniciar_Sesion button');
        loginButton.addEventListener('click', async ()=>{
            const email = document.querySelector('#Correo').value;
                const password = document.querySelector('#Password').value;

                if (!email || !password) {
                    alert('Por favor, completa todos los campos.');
                    return;
                }

                // Consultar la tabla 'users' para encontrar el correo
                const {data} = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single(); // Devuelve un único resultado

                if (data) {
                    // Validar la contraseña
                    if (data.password === password) { // Cambia según cómo almacenes la contraseña
                        alert('Inicio de sesión exitoso.');
                        console.log('Usuario:', data);
                    } else {
                        alert('Contraseña incorrecta.');
                    }
                } else {
                    alert('El usuario no existe o la contraseña es incorrecta.');
                }
        });
    }
});
