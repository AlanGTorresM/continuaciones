import { supabase } from './../Base de datos/supabase.js';

const tablaProductos = document.getElementById('tabla-productos');
const productForm = document.getElementById('productForm');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('productModal');

// Abrir modal
openModal.addEventListener('click', () => {
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
    const currentUser = JSON.parse(localStorage.getItem('user')); // Analiza la cadena JSON almacenada
    if (!currentUser || !currentUser.name) {
        console.error('Usuario no autenticado.');
        return;
    }

    const currentUserId = currentUser.name; // Accede al nombre del usuario
    console.log(currentUserId); // Muestra en la consola para depuración

    const { data: productos, error } = await supabase
        .from('productos')
        .select('*')
        .eq('vendedor_id', currentUserId); // Filtrar por ID del usuario actual

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
        img.src = producto.image_url || ''; // Asegúrate de tener un campo 'image_url' en tu tabla
        img.alt = "Imagen del producto";
        img.style.width = '50px';
        imgCell.appendChild(img);

        // Columna de nombre
        const nameCell = row.insertCell(1);
        nameCell.textContent = producto.nombre;

        // Columna de acciones
        const actionsCell = row.insertCell(2);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600';
        deleteBtn.addEventListener('click', () => deleteProduct(producto.id));
        actionsCell.appendChild(deleteBtn);
    });
}

// Función para subir una imagen a Supabase Storage
async function uploadImage(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('imagenes') // Bucket de imagenes
        .upload(fileName, file);

    if (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }

    // Obtén la URL pública de la imagen subida
    const { data: urlData } = supabase.storage
        .from('imagen')
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// Evento submit del formulario
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentUser = localStorage.getItem('user'); // Asegúrate de que el usuario esté identificado
    if (!currentUser) {
        alert('Usuario no autenticado.');
        return;
    }

    const formData = new FormData(productForm);

    const productName = formData.get('productName');
    const unitPrice = parseFloat(formData.get('unitPrice'));
    const stock = parseInt(formData.get('stock'), 10);
    const description = formData.get('description');
    const productImages = formData.getAll('productImage'); // Soporte para múltiples imágenes

    try {
        // Subir imagen al Storage (puedes iterar para múltiples imágenes)
        const imageUrls = [];
        for (const image of productImages) {
            const imageUrl = await uploadImage(image);
            imageUrls.push(imageUrl);
        }

        // Guardar información del producto en la tabla
        const { error } = await supabase
            .from('productos') // Cambia 'productos' por el nombre de tu tabla
            .insert({
                nombre: productName,
                precio: unitPrice,
                existencias: stock,
                descripcion: description,
                image_url: imageUrls[0], // Guarda la primera imagen como principal
                vendedor_id: currentUser,
            });

        if (error) {
            throw error;
        }

        alert('Producto agregado correctamente.');
        productForm.reset();
        modal.style.display = 'none';
        loadProducts(); // Recarga la tabla de productos
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Hubo un error al agregar el producto. Revisa la consola para más detalles.');
    }
});

// Función para eliminar un producto
async function deleteProduct(id) {
    const { error } = await supabase
        .from('productos') // Cambia 'productos' por el nombre de tu tabla
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error al eliminar producto:', error);
        return;
    }

    alert('Producto eliminado.');
    loadProducts(); // Recarga los productos para actualizar la tabla
}

// Carga los productos al iniciar
document.addEventListener('DOMContentLoaded', loadProducts);
