# ProyectoWeb2

## 

## Introducción
El desarrollo de toda esta página web se basa en 4 componentes clave "HTML, CSS, JAVASCRIPT Y SUPABASE".
Tratamos de mantener un orden dentro de los archivos para seccionar lo que es CSS y SCRIPTS.
Cada carpeta contiene archivos correspondientes a sus nombres, tratamos de hacer que no existiera desperdicio,
pero al hacer cosas distintas en diferentes momentos sin poder comunicarnos hay cosas que no se llegan a usar.
Una de esas cosas es la clase de productos, que originalmente nos servia como de referencia para su entidad
dentro de la base de datos.
De ahí en fuera todo fue muy bien aprovechado y de cierta forma optimizado. Buscamos tecnologías como lo es tailwindcss
y supabase para este proyecto. Por ende hicimos uso de Node, pero fue muy poco, ya que solo lo utilizamos para descargar esas 2 librerías.

La lógica de la pagina principal se basa en index.html, de ahí se pueden llegar a absolutamente todas las paginas que existen dentro de este proyecto. Toda la lógica backend aunque cumple con los requisitos, si se despliega con un fin
comercial, existirian muchos problemas de seguridad. A continuación los mencionaremos

## Consideraciones al hacer el proyecto
Con el uso de Node para este proyecto, realmente fue muy poco, solo fue utilizado para tailwind y supabase. Con node,
pudimos haber logrado mayor seguridad utilizando variables de entorno y no poner en nuestros scripts las credenciales
de nuestro servidor. A su vez que corremos un riesgo al dejar todas estas credenciales en un repositorio público.
Tambien cabe aclarar que queriamos hacer uso de fetchs y métodos HTTPS para la comunicación cliente-servidor, pero como tal SUPABASE ya lo hace y nos da errores en caso de que querramos hacerlo. Nuestro modelo inicial se encuentra en nuestras primeras versiones de nuestro repositorio backend en el que manejabamos los métodos, usabamos puertos y JSON para el consumo de datos.

## Supabase
La API de supabase fue muy efectiva en el desarrollo del consumo de datos y almacenamiento de estos, el unico problema
que encontramos fue que esta API como tal, no permite que nosotros mandemos objetos JSON directamente en sus parametros,
sino que mediante el uso de objetos se los pasabamos a sus parametros, que implicitamente los convertian en JSON.
Todas las credenciales estan dentro de la carpeta Base de datos, esta API constaba de 3 cosas, la primera era la llave que
nos brindaba supabase al crear el proyecto, la segunda era la url publica que de igual forma nos la daba supabase.
y finalmente lo más importante el método que crea el cliente, este une la llave publica con la URL.
Esta es la unica cosa que importaba realmente en el proyecto, ya que con esta nos daba el acceso a todo nuestro servidor
gratuito de supabase.
Aquí realizamos 3 tablas (users, productos y transacciones) las cuales son sumamente importantes para el desarrollo de todo el proyecto. De igual forma tuvimos que crear un bucket para almacenar todas las imagenes y hacer pruebas.
Algo que cabe notar es que aquí existe mucha seguridad con usuarios, JWT, SMTP, etc. Pero nosotros por desconocimiento de estos temas y por tiempo tuvimos que deshabilitar y trabajar sin seguridad alguna.

Todo lo que pertenece a los métodos http como lo son GET, POST, PUT, PATCH, DELETE tratamos de buscar en la documentación de supabase para que nosotros nos comunicaramos con nuestras bases de datos. Sin embargo en la documentación se menciona que estos métodos ya existen dentro de supabase y que cualquier implementación que trataramos de hacer nosotros supabase nos la rechazaria, puesto que dentro de su librería ya tiene los métodos correspondientes.

https://supabase.com/docs/guides/api/creating-routes?queryGroups=language&language=javascript

## Index.html
Esta es la pagina principal, con la que el usuario empieza, la programamos de cierta forma que en caso de no leer en el local storage un "user", salga un mensaje diciendo que el usuario no esta en una sesión. Si le das el click al boton te abrira un anuncio de iniciar sesión, si le das click a cualquier lado de la página se va a cerrar.
Tambien es importante saber que la barra de navegación es un script inyectado, dependiendo si en el local storage existe o no un usuario.
La barra si cambia dependiendo de si hay sesión o no. Esta parte del código se encuentra en el script de login.js, que hace uso de otro script que se encuentra de los modelos que usamos para inyectar código HTML dentro de las paginas, este otro script se llama header.js y ahí se puede observar los 2 modelos que existen para nuestra barra de navegación.

## Crear_sesion.html
Esta pagina es un simple formulario en el que una vez creado un usuario te redirige al index.html
El guardado de datos se lleva acabo en el script crear_sesion.js

## Vendedor.html
Es una pagina exclusiva para el vendedor. Cabe aclarar que aquí ya existen validaciones para que no cualquiera entre a esta parte, la primera es comparar el usuario del localStorage con el usuario que existe en supabase para ver si efectivamente existe ese usuario, y tambien saber si estan bien sus credenciales.
El de abajo es un JSON que se guarda en el local Storage y le permite saber a la pagina de quien va a ver su lista de productos a la venta. Solo y solamente si se cumple la condición que la verificación sea correcta

{"id":48,"email":"ejemplo2@gmail.com","name":"ejemplo2"}

Ya una vez efectuadas las validaciones, existe un CRUD para agregar un producto en el que acepta su información y permite el guardado de una imagen, que se guardara en un bucket de imagenes. Una vez agregado se actualiza la pagina y muestra sus productos en forma de tablas.
### Punto importante
como se menciono con anterioridad, la API de supabase ya viene con sus métodos de fetch. Pero aún así no simboliza que tuvimos que guardar la información nada mas así. No, sino que nos pidio un objetos que contuviera claves y valores.
Ejemplos

const productData = {
            nombre: productName,
            precio: unitPrice,
            stock: stock,
            descripcion: description,
        };
Aunque como tal no es un JSON, supabase pide un objeto construido de esa forma para poder convertirlo en un JSON

## Compras.html
Esta es una pagina que al iguar que vendedor.html busca si o si una validación del usuario registrado en el local storage, dentro de su script articulo_individual.js se hace la inyección de html para mostrar todos los productos que estan en venta y que estan en stock, a su vez de que sean productos en el que el usuario actual no haya publicado

## articulo_individual.html
Fue nuestra primera versión, en la que podiamos ver como se vería la pagina si clickeabamos en un producto.
Esta en el desarrollo quedo obsoleta, pero fue muy util para la inyeccion de html para el script articulo_individual.html