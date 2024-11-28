import { supabase } from './Base de datos/supabase.js';

const nombre = document.querySelector('#name');
const cellphone = document.querySelector('#cellphone');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submit = document.querySelector('button');

async function insertUserDirectly(name, cellphone, email, password) {
    // Validación básica
    if (!name || !cellphone || !email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Crear objeto del usuario
    const newUser = {
        name: name,
        cellphone: cellphone,
        email: email,
        password: password,
        is_logged_in: false,
        is_seller: false,
        wishlist: [],
        products_bought: [],
        cart: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    try {
        const {data} = await supabase.from('users').insert([newUser]);
    
        if (error) {
            console.error('Error al registrar el usuario:', error);
            alert('Error al registrar el usuario');
            return;
        }
    
        console.log('Datos recibidos de Supabase:', data);
    
        if (data && data.length > 0) {
            const userToStore = {
                id: data[0].id,
                name: data[0].name,
                email: data[0].email,
            };
    
            console.log('Guardando en localStorage:', userToStore);
            localStorage.setItem('user', JSON.stringify(userToStore));
            alert('Usuario registrado exitosamente');
        }
    } catch (err) {
        console.error('Error inesperado:', err);
        alert('Error inesperado: ' + err.message);
    }
    
}

// Manejar el evento de clic en el botón
submit.addEventListener('click', async () => {
    const nameValue = nombre.value.trim();
    const cellphoneValue = cellphone.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // Llamar a la función para insertar datos directamente
    await insertUserDirectly(nameValue, cellphoneValue, emailValue, passwordValue);
});
