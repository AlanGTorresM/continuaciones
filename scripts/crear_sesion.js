import User from './clases/user.js'; // Importar la clase User

// Seleccionar elementos del DOM
const nombre = document.querySelector('#name');
const cellphone = document.querySelector('#cellphone');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submit = document.querySelector('button');

// Manejar el evento de clic en el botón
submit.addEventListener('click', async (e) => {
    e.preventDefault();
  
    const nameValue = nombre.value.trim();
    const cellphoneValue = cellphone.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
  
    if (!nameValue || !cellphoneValue || !emailValue || !passwordValue) {
        alert("Todos los campos son obligatorios.");
        return;
    }
  
    try {
        const user = new User(nameValue, emailValue, passwordValue, cellphoneValue);
        const registeredUser = await user.register();
  
        // Guardar información básica en localStorage, incluyendo el ID
        const userToStore = {
            id: registeredUser.id,
            name: registeredUser.name,
            email: registeredUser.email,
        };
  
        console.log("Guardando en localStorage:", userToStore);
        localStorage.setItem("user", JSON.stringify(userToStore));
  
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert("Hubo un error al registrar el usuario. Por favor, intenta de nuevo.");
    }
  });