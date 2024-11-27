import {supabase} from './Base de datos/supabase.js';
import {User} from './User.js';
const nombre = document.querySelector('#name');
const cellphone = document.querySelector('#cellphone');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submit = document.querySelector('button');

submit.addEventListener('click', async (e) => {
    if(!nombre || !email || !password || !cellphone){
        alert("Porfavor llena todos los campos");
    }
    const user = new User(nombre, email, password, cellphone);
    user.register();
});