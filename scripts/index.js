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
            const emailField = document.querySelector('#Correo');
            const passwordField = document.querySelector('#Password');
            const email = emailField.value.trim();
            const password = passwordField.value.trim();

            limpiarErrores();

            let isValid = true;

            if (!email) {
                crearMensajeError(emailField, 'El correo electrónico es obligatorio.');
                isValid = false;
            } else if (!validarEmail(email)) {
                crearMensajeError(emailField, 'El correo electrónico no tiene un formato válido.');
                isValid = false;
            }

            if (!password) {
                crearMensajeError(passwordField, 'La contraseña es obligatoria.');
                isValid = false;
            }

            if (!isValid) return;

            try {
                const user = await User.login(email, password);
                alert('Inicio de sesión exitoso.');

                localStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    name: user.name || 'Usuario',
                }));

                window.location.href = 'paginaPincipal.html';
            } catch (error) {
                crearMensajeError(loginButton, error.message);
            }
        });
    }
});

function crearMensajeError(campo, mensaje) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = mensaje;
    mensajeError.className = 'error-message text-red-500 text-sm mt-1';
    campo.parentNode.insertBefore(mensajeError, campo.nextSibling);
}

function limpiarErrores() {
    const mensajesError = document.querySelectorAll('.error-message');
    mensajesError.forEach(mensaje => mensaje.remove());
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
