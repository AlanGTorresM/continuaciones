import { verificarLogin } from "./login.js";
import {supabase} from "./Base de datos/supabase.js";
verificarLogin();

// Obtener datos del producto desde localStorage
const productoSeleccionado = JSON.parse(localStorage.getItem('productoSeleccionado'));

if (productoSeleccionado) {
    // Rellenar la página con los datos del producto
    document.getElementById('producto-imagen').src = productoSeleccionado.images[0] || 'images/default.jpg';
    document.getElementById('producto-nombre').textContent = productoSeleccionado.nombre;
    document.getElementById('producto-descripcion').textContent = productoSeleccionado.descripcion;
    document.getElementById('producto-precio').textContent = `$${productoSeleccionado.precio} MXN`;
    document.getElementById('stock').textContent = productoSeleccionado.stock; // Mostrar stock disponible
}

// Elementos del formulario
const cantidadInput = document.getElementById('cantidad');
const totalCompra = document.getElementById('total-compra');
const errorCantidad = document.getElementById('error-cantidad');

// Actualizar el total y validar el stock
cantidadInput.addEventListener('input', () => {
    const cantidad = parseInt(cantidadInput.value) || 0;

    if (cantidad > productoSeleccionado.stock) {
        errorCantidad.classList.remove('hidden');
    } else {
        errorCantidad.classList.add('hidden');
    }

    const total = cantidad * productoSeleccionado.precio;
    totalCompra.textContent = `$${total} MXN`;
});

// Manejar el envío del formulario
document.getElementById('formulario-compra').addEventListener('submit', async (event) => {
    event.preventDefault();
    const cantidad = parseInt(cantidadInput.value) || 0;

    // Validar que no exceda el stock
    if (cantidad > productoSeleccionado.stock) {
        alert('La cantidad solicitada excede el stock disponible.');
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;

    console.log('Datos de la compra:', {
        nombre,
        direccion,
        correo,
        cantidad,
        total: cantidad * productoSeleccionado.precio,
        producto: productoSeleccionado
    });

    // Actualizar el stock del producto en la base de datos
    try {
        const { error } = await supabase
            .from('productos')
            .update({ stock: productoSeleccionado.stock - cantidad })
            .eq('id', productoSeleccionado.id);

        if (error) {
            console.error('Error al actualizar el stock:', error.message);
            alert('Hubo un error al procesar tu compra. Inténtalo de nuevo.');
            return;
        }

        alert('¡Compra confirmada! Gracias por tu compra.');
        // Redirigir al usuario a una página de agradecimiento o inicio
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Error en la compra:', err.message);
        alert('Hubo un error inesperado. Inténtalo de nuevo.');
    }
});
