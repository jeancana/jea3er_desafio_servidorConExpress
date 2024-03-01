import express from 'express' //importando la libreria express
import ProductManager from './ProductManager.js' // importando la piezas de codigo hechas previamente para reutilizarlas

// Ejecutando la Libreria Express y Creando un Servidor
const app = express()

// Permitiendo al servidor por leer piezas de Codigo mas complejas
app.use(express.urlencoded({ extended: true }))

// Configuracion de los Servicios de la App
const PORT = 8080

// Instanciando un Objeto de la clase ProducManager para poder trabajarlo
const productManager = new ProductManager()

// leyendo todo los productos que estan guardados en el Archivo productos.json y volviendolo


//--------   CHEQUEANDO RUTA RAIZ ------------------------ http://localhost:8080/
app.get('/', async (req, res) => {
    
    // Mostrando del lado del cliente que la ruta Raiz Funciona
    res.send('Hola desde el servidor - Ruta Raiz ')

})


//--------   TAREA NRO 1: LEYENDO TODOS LOS PRODUCTOS  -------  http://localhost:8080/products 
//--------   TAREA NRO 2: LEYENDO los 5 Primeros productos ---  http://localhost:8080/products?limit=5  

app.get('/products', async (req, res) => {

    // Usando el Metodo getProducts
    const readProducts = await productManager.getProducts()

    //-- Nota: El ejercicio me pide que debo mostrar todos los Productos en un Rango de 0 a limit

    // capturando el dato que viene por Query Params, parseandolo y volviendolo un entero 
    const limit = parseInt(req.query.limit)

    // Usamos la HOF "slice."  para crear el rango de la muestra de 0 a limit
    const productsLimit = readProducts.slice(0, limit)
    
    // Enviando las repuesta requeridas en el ejercicio 
    if (!limit) {
        
        // Si limit no esta definido - devuelve todos los productos
        res.send({ data: readProducts })
        
    } else {

        // sino devuelve los productos buscados en el rango de 0 a limit 
        res.send({ data: productsLimit })

    }
    
})
 
//--------   TAREA NRO 3: LEYENDO solo el producto con el ID 2 --- http://localhost:8080/products/2  
//--------   TAREA NRO 4: Pidiendo Un Id que no Exista  ---------- http://localhost:8080/products/34123123 

app.get('/products/:id', async (req, res) => {

     // Obteniendo de dato "id=2" por URL - Params (el ejercicio me pide que debo mostrar el producto con el id=2)
    const id = parseInt(req.params.id)
    
    //  // Usando el Metodo getProductsById
    const product = await productManager.getProductsById(id)
    
    // Enviando las repuesta requeridas en el ejercicio 
    if (!product) {
        
        return res.send({ error: `El Producto con el ID: ${id} NO existe` })

    } else {

        res.send({ data: product })

    }
    
})

// Poniendo a Escuchar el Servidor 
app.listen(PORT, () => console.log(`Server Up on PORT ${PORT}`))