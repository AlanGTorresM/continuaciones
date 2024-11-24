export function ElementoPaginaPrincipal(element) {
  return `Tenemos el producto: ${element.nombre} El cual tiene un precio de: ${element.precio}<br>`;
}


export function ObtenerCarrito(id) {
  return `SELECT nombre,precio,descripcion FROM carritos WHERE id=${id}` //Ejemplo de solicitud SQL
}
