import {verificarLogin} from './login.js'
import {listenerScroll, listenerClose} from './models/anuncio_control.js'
import { inicio_sesion } from './models/iniciar_Sesion.js';
import {supabase} from './Base de datos/supabase.js'

verificarLogin();

// Manejar clic en "Iniciar Sesión"
// Delegar el evento en el `document`
// Manejar clic en "Iniciar Sesión"
document.addEventListener('click', (e) => {
    if (e.target.closest('#iniciar_sesion a')) {
        e.preventDefault();

        if (!document.querySelector('#iniciar_Sesion')) {
            document.body.innerHTML += inicio_sesion();
            listenerScroll();
            listenerClose();
        }

        const loginButton = document.querySelector('#iniciar_Sesion button');
        loginButton.addEventListener('click', async () => {
            const email = document.querySelector('#Correo').value;
            const password = document.querySelector('#Password').value;

            if (!email || !password) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Consultar la tabla 'users' para encontrar el correo
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (data) {
                if (data.password === password) {
                    alert('Inicio de sesión exitoso.');
                    console.log('Usuario:', data);

                    // Guardar el estado del login en Local Storage
                    localStorage.setItem('user', JSON.stringify({
                        id: data.id,
                        email: data.email,
                        name: data.name || 'Usuario'
                    }));
                } else {
                    alert('Contraseña incorrecta.');
                }
            } else {
                alert('El usuario no existe o la contraseña es incorrecta.');
            }
        });
    }
});

