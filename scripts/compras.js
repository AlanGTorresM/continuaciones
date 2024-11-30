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

// Rellenar los datos del comprador en el formulario
document.getElementById('nombre').value = JSON.parse(localStorage.getItem('user')).name;
document.getElementById('correo').value = JSON.parse(localStorage.getItem('user')).email;

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

    const total = cantidad * productoSeleccionado.precio;

    console.log('Datos de la compra:', {
        nombre,
        direccion,
        correo,
        cantidad,
        total,
        producto: productoSeleccionado
    });

    try {
        // 1. Actualizar el stock del producto
        const { error: stockError } = await supabase
            .from('productos')
            .update({ stock: productoSeleccionado.stock - cantidad })
            .eq('id', productoSeleccionado.id);

        if (stockError) {
            console.error('Error al actualizar el stock:', stockError.message);
            alert('Hubo un error al procesar tu compra. Inténtalo de nuevo.');
            return;
        }

        // 2. Registrar la transacción del comprador
        const idComprador = JSON.parse(localStorage.getItem('user')).id;
        const idVendedor = productoSeleccionado.vendedor_id;
        const conceptoCompra = `Compra de ${cantidad} unidad(es) de ${productoSeleccionado.nombre}`;
        const conceptoVenta = `Venta de ${cantidad} unidad(es) de ${productoSeleccionado.nombre}`;

        const { error: transaccionCompraError } = await supabase
            .from('transacciones')
            .insert([{
                id_comprador: idComprador,
                id_vendedor: idVendedor,
                concepto: conceptoCompra,
                direccion: direccion,
                tipo_transaccion: 'compra',
                monto: total
            }]);

        if (transaccionCompraError) {
            console.error('Error al registrar la transacción de compra:', transaccionCompraError.message);
            alert('Hubo un error al registrar la transacción de compra. Inténtalo de nuevo.');
            return;
        }

        // 3. Registrar la transacción del vendedor
        const { error: transaccionVentaError } = await supabase
            .from('transacciones')
            .insert([{
                id_comprador: null, // Opcional: indica que no aplica para el vendedor
                id_vendedor: idVendedor,
                concepto: conceptoVenta,
                direccion: direccion,
                tipo_transaccion: 'venta',
                monto: total
            }]);

        if (transaccionVentaError) {
            console.error('Error al registrar la transacción de venta:', transaccionVentaError.message);
            alert('Hubo un error al registrar la transacción de venta. Inténtalo de nuevo.');
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

