import express from 'express'
const { Router } = express

import {
    productosDao as products,
    carritosDao as cart
} from '../src/dao/index.js'

const app = express()

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const CLIVERCITO = true

const errorProductoSinStock = {'error':'producto sin stock'}
const errorProductoNoExiste = {'error':'producto no existe'}

//Router base /api/productos
const routerProduct = Router()

//Funcionalidad a: GET /:id --> Devuelve un producto segun su ID || para users y admins
routerProduct.get("/:id", (req, res) => {
    let id = req.params.id
    return res.json(products.find(id))
})

routerProduct.get("/", (req, res) => {
    return res.json(products.list)
})

//Funcionalidad b: POST / --> Incorpora productos al listado || solo admins
routerProduct.post("/", mwAdmin, (req, res) => {
    let obj = req.body
    let post = products.insert(obj)
    products.write()
    return res.json(post)
})

//Funcionalidad c: PUT /:id --> Actualiza un producto segun su id || solo admins
routerProduct.put("/:id", mwAdmin, (req, res) => {
    let obj = req.body
    let id = req.params.id
    let put = res.json(products.update(id,obj))
    products.write()
    return put
})

//Funcionalidad d: Borra un producto segun su ID || solo admins
routerProduct.delete("/:id", mwAdmin, (req,res) => {
    let id = req.params.id
    let deleted = res.json(products.delete(id))
    products.write()
    return(deleted)
})


//Router base /api/carrito
const routerCart = Router()
//Funcionalidad extra: GET / --> obtiene el listado de carritos || usuarios y admins
routerCart.get("/", (req, res) => {

    return res.json(cart.list)
})

//Funcionalidad a: POST / --> Crea un carrito y devuelve su id || usuarios y admins
routerCart.post("/", (req, res) => {
    let obj = req.body
    let create = cart.cartCreate()
    if(create>0) {
        cart.write()
    }
    return res.json(create)
})

//Funcionalidad b: DELETE /:id --> Vacia un carrito y lo elimina || usuarios y admins
routerCart.delete("/:id", (req,res) => {
    let id = req.params.id
    let deleted = cart.cartDrop(id)

    if (deleted.error == undefined) {
        cart.write()
    }

    return(res.json(deleted))
})

//Funcionalidad c: GET /:id/productos --> Permite listar todos los productos del carrito || usuarios y admins
routerCart.get("/:id/productos", (req, res) => {
    let id = req.params.id
    let listaProductos = cart.find(id)
    
    if(!listaProductos.productos) {
        return res.json(listaProductos)
    }
    
    return res.json(listaProductos.productos)
    
})

//Funcionalidad d: POST: /:id/productos --> Incorpora productos al carrito por id de carrito? || usuarios y admins
routerCart.post("/:id/productos", (req, res) => {
    let obj = req.body
    let id = req.params.id

    //Validamos si el producto tiene stock
    const prodStock = products.find(obj.id).stock
    
    if(prodStock<=0 || prodStock < obj.cantidad) {
        return res.json(errorProductoSinStock)
    }
    
    if(prodStock==undefined){
        return res.json(errorProductoNoExiste)
    }

    let post = res.json(cart.cartInsert(id,obj))
    cart.write()
    return post
})

//Funcionalidad e: DELETE: /:id/productos/:id_prod --> Elimina un producto del carrito por su id de carrito y de producto
routerCart.delete("/:id/productos/:idprod", (req,res) => {
    let idCart = req.params.id
    let idProd = req.params.idprod
    let deleted = res.json(cart.cartDelete(idCart, idProd))
    cart.write()
    return(deleted)
})

//Configuracion del servidor

app.use(express.static(process.env.PWD + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/productos', routerProduct)
app.use('/api/carrito', routerCart)

//Manejador de errores
app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('Ocurrio un error: '+err)
})

app.use(function(req,res,next) {

    const error = {
        error:-2,
        descripcion:`ruta ${req.path} metodo ${req.method} no implementado.`
    }
    res.status(500).send(error)
})

//Middleware de seguridad
function mwAdmin(req,res,next){
    if(CLIVERCITO){
        next()
    }else{
        const error={
            error:-1,
            descripcion: `Ruta ${req.url} metodo ${req.method} no autorizado.`
        }
        res.status(500).send(error)
    }
}

export default app