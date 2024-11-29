import { supabase } from '../Base de datos/supabase.js';
import { verificarLogin } from '../login.js';

verificarLogin();
const tablaProductos = document.getElementById('tabla-productos');
const productForm = document.getElementById('productForm');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('productModal');

// Abrir modal para agregar producto
openModal.addEventListener('click', () => {
    productForm.reset(); // Limpia el formulario
    productForm.removeAttribute('data-product-id'); // Limpia el atributo del ID del producto
    modal.style.display = 'flex';
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal si se hace clic fuera
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Función para cargar productos desde Supabase
async function loadProducts() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || !currentUser.id) {
        console.error('Usuario no autenticado.');
        return;
    }

    const currentUserId = currentUser.id;

    const { data: productos, error } = await supabase
        .from('productos')
        .select('*')
        .eq('vendedor_id', currentUserId);

    if (error) {
        console.error('Error al cargar productos:', error);
        return;
    }

    // Limpia la tabla antes de agregar nuevos datos
    const rows = tablaProductos.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => row.remove());

    // Agrega productos a la tabla
    productos.forEach(producto => {
        const row = tablaProductos.insertRow();

        // Columna de imagen
        const imgCell = row.insertCell(0);
        const img = document.createElement('img');
        img.src = producto.images[0];
        img.alt = "Imagen del producto";
        img.style.width = '50px';
        imgCell.appendChild(img);

        // Columna de nombre
        const nameCell = row.insertCell(1);
        nameCell.textContent = producto.nombre;

        // Columna de acciones
        const actionsCell = row.insertCell(2);

        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600';
        deleteBtn.addEventListener('click', () => deleteProduct(producto.id));
        actionsCell.appendChild(deleteBtn);

        // Botón de modificar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modificar';
        editBtn.className = 'bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 ml-2';
        editBtn.addEventListener('click', () => openEditModal(producto));
        actionsCell.appendChild(editBtn);
    });
}

// Función para abrir el modal y rellenar con los datos del producto seleccionado
function openEditModal(producto) {
    // Rellenar el formulario modal con los datos del producto
    document.getElementById('productName').value = producto.nombre;
    document.getElementById('unitPrice').value = producto.precio;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('description').value = producto.descripcion;

    // Guardar el ID del producto en un atributo del formulario para referencia
    productForm.setAttribute('data-product-id', producto.id);

    // Mostrar el modal
    modal.style.display = 'flex';
}

// Función para subir una imagen a Supabase Storage
async function uploadImage(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(fileName, file);

    if (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }

    const { data: urlData, error: urlError } = supabase.storage
        .from('imagenes')
        .getPublicUrl(data.path);

    if (urlError) {
        console.error('Error al obtener la URL pública:', urlError);
        throw urlError;
    }

    return urlData.publicUrl;
}

// Evento submit del formulario
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || !currentUser.id) {
        alert('Usuario no autenticado.');
        return;
    }

    const formData = new FormData(productForm);

    const productId = productForm.getAttribute('data-product-id');
    const productName = formData.get('productName');
    const unitPrice = parseFloat(formData.get('unitPrice'));
    const stock = parseInt(formData.get('stock'), 10);
    const description = formData.get('description');
    const productImages = formData.getAll('productImage');

    try {
        let imageUrls = [];
        if (productImages.length > 0 && productImages[0].name) {
            imageUrls = await Promise.all(
                productImages.map(image => uploadImage(image))
            );
        }

        const productData = {
            nombre: productName,
            precio: unitPrice,
            stock: stock,
            descripcion: description,
        };

        if (imageUrls.length > 0) {
            productData.images = imageUrls;
        }

        if (productId) {
            const { error } = await supabase
                .from('productos')
                .update(productData)
                .eq('id', productId);

            if (error) throw error;

            alert('Producto modificado correctamente.');
        } else {
            const { error } = await supabase
                .from('productos')
                .insert({
                    ...productData,
                    vendedor_id: currentUser.id,
                });

            if (error) throw error;

            alert('Producto agregado correctamente.');
        }

        productForm.reset();
        modal.style.display = 'none';
        loadProducts();
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        alert('Hubo un error al guardar el producto.');
    }
});

// Función para eliminar un producto
async function deleteProduct(id) {
    const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error al eliminar producto:', error);
        return;
    }

    alert('Producto eliminado.');
    loadProducts();
}

// Carga los productos al iniciar
document.addEventListener('DOMContentLoaded', verificarLogin);
document.addEventListener('DOMContentLoaded', loadProducts);
