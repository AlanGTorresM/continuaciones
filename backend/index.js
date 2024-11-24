const elementos = require("./elementos")
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // Necesario para manejar req.body


//Esta ruta es general para todos los usuarios
app.get("/productos", (req, res) => {
  //Posiblemente obtener los productos de una API o de una base de datos???
  productos = {
    data: [{
      nombre: "aaa",
      precio: 20,
      descripcion: "AAAA"
    },
    {
      nombre: "bbbb",
      precio: 50,
      descripcion: "BBBBBB"
    },
    {
      nombre: "ccccc",
      precio: 500,
      descripcion: "CCCCCCCCCC"
    }
    ]
  }
  res.send(productos);
});


// Ruta POST
app.post("/carrito", async (req, res) => {
  // curl -X POST http://localhost:3000/carrito -H "Content-Type: application/json" -d '{"id": 324}'
  let id = req.body["id"] //Buscar en una base de datos la id y obtener el carrito desde ahi
  let content = elementos.ObtenerCarrito(id)

  res.send(content); // Devuelve los datos recibidos
});


app.get("/", async (req, res) => {
  //Ejemplo de uso
  let data = await // Esperamos la respuesta
    fetch('http://localhost:3000/productos')
      .then(response => response.json())
      .catch(error => console.error('Error:', error)); // Maneja errores
  data = data["data"]
  console.log(data)
  let txt = ""
  data.forEach(element => {
    txt += elementos.ElementoPaginaPrincipal(element)
  });

  res.send(txt);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

