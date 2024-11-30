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
document.getElementById('formulario-compra').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
        alert('El carrito está vacío. No puedes finalizar la compra.');
        return;
    }
    const idComprador = JSON.parse(localStorage.getItem('user')).id;

    try {
        

        for (const producto of carrito) {
            const direccion = document.getElementById('direccion').value;
            const idVendedor = producto.vendedor_id;
            // Validar stock actual
            const { data: productoSupabase, error: stockFetchError } = await supabase
                .from('productos')
                .select('stock')
                .eq('id', producto.id)
                .single();

            if (stockFetchError) {
                console.error(`Error al consultar el stock del producto ${producto.nombre}:`, stockFetchError.message);
                alert(`Hubo un error al validar el stock del producto ${producto.nombre}. Inténtalo de nuevo.`);
                return;
            }

            const stockDisponible = productoSupabase.stock;

            if (producto.cantidad > stockDisponible) {
                alert(`No hay suficiente stock para el producto: ${producto.nombre}. Stock disponible: ${stockDisponible}.`);
                return;
            }

            // Actualizar el stock en la base de datos
            const { error: stockUpdateError } = await supabase
                .from('productos')
                .update({ stock: stockDisponible - producto.cantidad })
                .eq('id', producto.id);

            if (stockUpdateError) {
                console.error(`Error al actualizar el stock del producto ${producto.nombre}:`, stockUpdateError.message);
                alert(`Hubo un error al procesar el producto ${producto.nombre}. Inténtalo de nuevo.`);
                return;
            }

            // Registrar transacción para el comprador
            const conceptoCompra = `Compra de ${producto.cantidad} unidad(es) de ${producto.nombre}`;
            const { error: compraError } = await supabase
                .from('transacciones')
                .insert([{
                    id_comprador: idComprador,
                    id_vendedor: idVendedor,
                    concepto: conceptoCompra,
                    direccion: direccion,
                    tipo_transaccion: 'compra',
                    monto: producto.precio * producto.cantidad
                }]);

            if (compraError) {
                console.error(`Error al registrar la transacción de compra para el producto ${producto.nombre}:`, compraError.message);
                alert(`Hubo un error al registrar la transacción de compra para el producto ${producto.nombre}. Inténtalo de nuevo.`);
                return;
            }

            // Registrar transacción para el vendedor
            const conceptoVenta = `Venta de ${producto.cantidad} unidad(es) de ${producto.nombre}`;
            const { error: ventaError } = await supabase
                .from('transacciones')
                .insert([{
                    id_comprador: idComprador,
                    id_vendedor: producto.vendedor_id,
                    concepto: conceptoVenta,
                    direccion: direccion,
                    tipo_transaccion: 'venta',
                    monto: producto.precio * producto.cantidad
                }]);

            if (ventaError) {
                console.error(`Error al registrar la transacción de venta para el producto ${producto.nombre}:`, ventaError.message);
                alert(`Hubo un error al registrar la transacción de venta para el producto ${producto.nombre}. Inténtalo de nuevo.`);
                return;
            }
        }

        // Limpiar el carrito después de procesar todo
        localStorage.removeItem('carrito');
        alert('¡Compra realizada con éxito!');
        window.location.href = 'index.html'; // Redirigir al inicio o página de confirmación

    } catch (error) {
        console.error('Error al finalizar la compra:', error.message);
        alert('Hubo un error inesperado. Inténtalo de nuevo.');
    }
});

