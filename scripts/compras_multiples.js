import { verificarLogin } from "./login.js";
import {supabase} from "./Base de datos/supabase.js";
verificarLogin();

// Obtener el carrito del localStorage
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Contenedor donde se mostrarán los productos
const productosLista = document.getElementById('productos-lista');
const totalFinal = document.getElementById('total-final');

// Campos sin modificar
document.getElementById('nombre').value = JSON.parse(localStorage.getItem('user')).name;
document.getElementById('correo').value = JSON.parse(localStorage.getItem('user')).email;

// Verificar si el carrito tiene elementos
if (carrito.length > 0) {
    let total = 0;

    // Iterar sobre los productos del carrito
    carrito.forEach(producto => {
        const productoHTML = `
            <div class="flex items-center gap-4 border-b border-gray-300 py-4">
                <img class="w-16 h-16 object-cover rounded-lg" src="${producto.images[0]}" alt="${producto.nombre}">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-800">${producto.nombre}</h3>
                    <p class="text-gray-600">${producto.descripcion}</p>
                    <p class="text-gray-700">Precio unitario: $${producto.precio} MXN</p>
                    <p class="text-gray-700">Cantidad: ${producto.cantidad}</p>
                </div>
                <p class="text-lg font-bold text-green-600">$${producto.precio * producto.cantidad} MXN</p>
            </div>
        `;
        productosLista.insertAdjacentHTML('beforeend', productoHTML);
        total += producto.precio * producto.cantidad;
    });

    // Mostrar el total
    totalFinal.textContent = `$${total} MXN`;
} else {
    productosLista.innerHTML = `<p class="text-gray-500">Tu carrito está vacío.</p>`;
}

// Manejar la finalización de la compra
document.getElementById('formulario-compra').addEventListener('click', async () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío. No puedes finalizar la compra.');
        return;
    }

    try {
        // Procesar cada producto del carrito
        for (const producto of carrito) {
            // Validar stock
            if (producto.cantidad > producto.stock) {
                alert(`No hay suficiente stock para el producto: ${producto.nombre}`);
                return;
            }

            // Actualizar el stock en la base de datos
            const { error: stockError } = await supabase
                .from('productos')
                .update({ stock: producto.stock - producto.cantidad })
                .eq('id', producto.id);

            if (stockError) {
                console.error(`Error al actualizar el stock del producto ${producto.nombre}:`, stockError.message);
                alert(`Hubo un error con el producto ${producto.nombre}. Inténtalo de nuevo.`);
                return;
            }

            // Registrar la transacción
            const idComprador = JSON.parse(localStorage.getItem('user')).id;
            const idVendedor = producto.vendedor_id;
            const conceptoCompra = `Compra de ${producto.cantidad} unidad(es) de ${producto.nombre}`;

            const { error: transaccionError } = await supabase
                .from('transacciones')
                .insert([{
                    id_comprador: idComprador,
                    id_vendedor: idVendedor,
                    concepto: conceptoCompra,
                    direccion: "Dirección del comprador", // Puedes reemplazar por un campo de formulario
                    tipo_transaccion: 'compra',
                    monto: producto.precio * producto.cantidad
                }]);

            if (transaccionError) {
                console.error(`Error al registrar la transacción del producto ${producto.nombre}:`, transaccionError.message);
                alert(`Hubo un error con la transacción del producto ${producto.nombre}. Inténtalo de nuevo.`);
                return;
            }
        }

        // Limpiar el carrito después de la compra
        localStorage.removeItem('carrito');
        alert('¡Compra realizada con éxito!');
        window.location.href = 'index.html'; // Redirigir al inicio u otra página
    } catch (error) {
        console.error('Error al finalizar la compra:', error.message);
        alert('Hubo un error inesperado. Inténtalo de nuevo.');
    }
});
