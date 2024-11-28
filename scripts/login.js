import { anuncio } from './models/anuncio.js';
import { listenerScroll, listenerClose } from './models/anuncio_control.js';
import {supabase} from './Base de datos/supabase.js'

export function verificarLogin() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        console.log('Usuario logueado:', user);
        return user; // Devuelve los datos del usuario
    } else {
        // Verifica si ya existe un anuncio antes de agregar uno nuevo
        if (!document.querySelector('.anuncio')) {
            document.body.innerHTML += anuncio();
            listenerScroll();
            listenerClose();
        }

        // Redirige a index.html solo si no estamos ya en esa página
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
}
