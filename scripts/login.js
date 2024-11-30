import { anuncio } from './models/anuncio.js';
import { listenerScroll, listenerClose } from './models/anuncio_control.js';
import User from './clases/user.js';
import { headerIsLoggedIn, headerIsNotLoggedIn } from './models/header.js';

export function verificarLogin() {
    const userBrowser = JSON.parse(localStorage.getItem('user'));

    if (userBrowser) {
        try{
        const userSupa = User.validate(userBrowser["email"]);
        if(userBrowser["id"] == userSupa["id"] && userBrowser["name"] == userSupa["name"] && userBrowser["email"] == userSupa["email"]) {
            alert("LAS CREDENCIALES NO CONCUERDAN");
            localStorage.removeItem('user');
            return;
        }
        headerIsLoggedIn(userBrowser["name"]);
        console.log('Usuario logueado:', userBrowser);
        return userBrowser; // Devuelve los datos del usuario
        } catch (error) {
            alert(error.message);
            localStorage.removeItem('user');
            return;
        }
    } else {
        headerIsNotLoggedIn();
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
