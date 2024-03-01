
import { promises as fs } from 'fs'

export default class ProductManager {

    // Privatizando la propiedad producto 
    #products

    constructor() {
        this.#products = []
        this.path = './productos.json'
    }

    // Creando el Id Auto Incrementable
    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    // Realizando la validacion de los Datos 
    #validateProduct = (title, description, price, thumbnail, code, stock) => {

        if (!title || !description || !price || !thumbnail || !code || !stock) {

            return `En el objeto ${title}: Faltan Campos por Cargar`

        } else {

            const found = this.#products.find(item => item.code === code)
            if (!found) return true
            return `En el objeto ${title}: codigo Duplicado`

        }


    }


    //  ******* Haciendo el C.R.U.D *******

    // <<<< CREATE  >>>>

    // Creando el Metodo agregar Productos en el Archivo productos.json
    addProduct = async (title, description, price, thumbnail, code, stock) => {

        // Validando los datos 
        if (this.#validateProduct(title, description, price, thumbnail, code, stock) === true) {

            // Agregando productos al array 
            this.#products.push(

                {
                    id: this.#generateId(),
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock
                }
            )

            // Escribiendo los productos en el archivo productos.json
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, '\t'))

        } else {

            console.log(this.#validateProduct(title, description, price, thumbnail, code, stock))

        }

    }


    //<<< READ >>>> 

    // Creando un Metodo que lea lo contenido en el Archivo productos.json 
    #readProducts = async () => {

        try {

            // Si el Archivo productos.json tiene Productos leelo y devuelvo el contenido 
            let contenido = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(contenido)

        } catch (err) {

            return err.message

        }

    }

    // READ NRO.1 
    // Metodo para leer Todos los Productos contenidos en en el Archivo productos.json
    getProducts = async () => {

        let showProducts = await this.#readProducts()
        return (showProducts)
    }

    // READ NRO.2 
    // Metodo para leer 1 producto Ubicado por ID
    getProductsById = async (id) => {

        console.log(id)
        const product = await this.#readProducts()
        const respuesta = product.find( product => product.id === id )
        
        if (!respuesta) {

            return 'Id No encontrado'

        } else {

            return respuesta
        }

    }

    // <<<< UPDATE >>>>
    // Creando el Metodo para Actualizar un Producto en el Archivo productos.json
    // Nota: Aplicamos Spread Operator Directamente en la arrow function con los parametros del objeto a actualizar
    updateProducts = async ({ id, ...producto }) => {

        // Eliminamos el Producto a Actualizar del Archivo "productos.json"
        this.deleteProductsById(id)

        // Los productos que no se Eliminaron se guardan en una nueva variable 
        let oldProducts = this.#readProducts()
        //console.log(oldProducts)

        // Creamos un Nuevo Array de Objetos con el Producto Actualizado MAS los oldProducts
        // juntamos mediante todo en un NUEVO array mediante un spread operator
        let updateProducts = [{ id, ...producto }, ...oldProducts]
        console.log(updateProducts)

        // Pisando el archivo "productos.json" - con las actualizaciones
        await fs.writeFile(this.path, JSON.stringify(updateProducts, null, '\t'))

    }


    // <<<< DELETE >>>>
    // Creando el Metodo para Borrar un Producto del Archivo "productos.json"
    deleteProductsById = async (id) => {

        // Leyendo todo los Productos que estan en "productos.json"
        let showProducts = this.#readProducts()

        // Aplicando un filter Invertido a showProducts para Borrar el Producto Seleccionado
        let filterProduct = showProducts.filter((producto) => producto.id != id)

        // Verificando q elimino del Array el producto indicado con el ID
        //console.log(filterProduct)

        // Pisando el archivo "productos.json"
        await fs.writeFile(this.path, JSON.stringify(filterProduct, null, '\t'))
    }


}


// CORRER EL EJERCICIO CON LA SIGUIENTE RUTA: 
// node ./classProductManagerVol3.js


// Instanciando un Objeto de la clase ProductManager
//const productManager = new ProductManager()

// Tareas del Desafio: 

// 1 - Si dentro de "productos.json" No existen productos devuelvo un Array vacio
//console.log(productManager.getProducts())

// 2 - Creando Productos con Persistencia en el Archivo "productos.json"

/*
productManager.addProduct('Sandia','fruta', 100, 'URL - WEB', '104', 7000)
productManager.addProduct('Manzana', 'fruta', 200, 'URL - WEB', '105', 8000)
productManager.addProduct('Pera', 'fruta', 300, 'URL - WEB', '106', 9000)
 */


// 3 - Mostrando por Consola todos los Productos Contenidos en el Archivo "productos.json"
//console.log(productManager.getProducts())

// 4 - Mostrando por Consola 1 producto Ubicado por su ID
//console.log(productManager.getProductsById(2))

// 5 - Actualizando un Producto del archivo "productos.json"
/* productManager.updateProducts(

    {
        "id": 3,
        "title": "Pera-Actualizada",
        "description": "fruta",
        "price": 50000,
        "thumbnail": "URL - WEB",
        "code": "106",
        "stock": 9000
    }
) */

// 6 - Borrando un Producto del Archivo "productos.json"
//console.log(productManager.deleteProductsById(1))











