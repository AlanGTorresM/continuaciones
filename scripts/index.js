//supabase
//FesAragon2004.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import {anuncio} from './models/anuncio.js';
import {listenerScroll, listenerClose} from './models/anuncio_control.js'
import { inicio_sesion } from './models/iniciar_Sesion.js';
const supabaseUrl = "https://kuwcitnkpoolemvawwel.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1d2NpdG5rcG9vbGVtdmF3d2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwOTEwNjUsImV4cCI6MjA0NzY2NzA2NX0.NXZ1Y7SWRTPYBDC_bSXz1JJCkTzY5Hroe4X8ws3BeZY";


// Crear cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// /*                          PRUEBAS PARA VER SI CONECTA CON SUPABASE                         */
// async function pruebaConexion() {
//     try {
//         console.log('Intentando conectar con Supabase...');
//         const { data, error } = await supabase.from('users').select('*');
//         if (error) {
//             console.error('Error de Supabase:', error.message);
//         } else {
//             console.log('Conexión exitosa. Datos obtenidos:', data);
//         }
//     } catch (err) {
//         console.error('Error inesperado:', err);
//     }
// }
// pruebaConexion();

// // Obtener datos de sesión
// async function datosConexion() {
//     try {
//         console.log('Intentando obtener datos de sesión...');
//         const { data, error } = await supabase.from('users').select('*');
//         if (error) {
//             console.error('Error al obtener datos de sesión:', error.message);
//         } else {
//             console.log('Datos de sesión obtenidos:', data);
//         }
//     } catch (err) {
//         console.error('Error inesperado:', err);
//     }
// }
// datosConexion();

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
