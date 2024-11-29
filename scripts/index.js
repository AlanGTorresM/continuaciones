import { verificarLogin } from './login.js';
import { listenerScroll, listenerClose } from './models/anuncio_control.js';
import { inicio_sesion } from './models/iniciar_Sesion.js';
import User from './clases/user.js';

verificarLogin();

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
        loginButton.addEventListener('click', async (a) => {
            a.preventDefault();
            const email = document.querySelector('#Correo').value.trim();
            const password = document.querySelector('#Password').value.trim();

            if (!email || !password) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            try {
                // Usar el método estático login de la clase User
                const user = await User.login(email, password);
                alert('Inicio de sesión exitoso.');
                console.log('Usuario:', user);

                // Guardar el estado del login en Local Storage
                localStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    name: user.name || 'Usuario',
                }));

                // Redirigir o actualizar la página según sea necesario
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }
});
