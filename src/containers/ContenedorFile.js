const fs = require('fs')
import config from '../config.js'

const errorProducto = {'error' : 'producto no encontrado'}
const errorCarrito = {'error' : 'carrito no encontrado'}

class Contenedor {
    constructor(nombreArchivo) {
        this.id = 0
        this.list = []
        this.filename = `${config.filesystem.path}/${nombreArchivo}`
        this.init()
    }

    init(){
        try{
            const data = fs.readFileSync(this.filename)

            const listaFromFile = JSON.parse(data)

            for (const obj of listaFromFile) {
                this.insert(obj)
            }

            //Buscamos el id mas alto para inicializar el this.id
            const listId = this.list.map(obj => {
                return obj.id
            })
            const maxId = Math.max(...listId)
            this.id=maxId

        } catch(err) {
            console.log("Error al acceder al archivo.")
        }
    }

    insert(obj) {
        obj.id = ++this.id
        obj.timestamp = Date.now()
        this.list.push(obj)

        return obj
        
    }

    find(id){
        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return errorProducto
        }else{
            return object
        }
    }

    update(id, obj){
        const index = this.list.findIndex((objT) => objT.id == id)

        if(index==-1){
            return errorProducto
        }else{
            obj.id = this.list[index].id
            this.list[index] = obj
    
            return obj
        }

    }

    delete(id){

        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return errorProducto
        }else{
            this.list = this.list.filter((obj) => obj.id != id)

            return this.list
        }

    }

    async write(){
        try{
            await fs.promises.writeFile(this.filename,JSON.stringify(this.list))

        } catch (err) {
            console.log('no se pudo escribir el archivo ' + err)
        }
    }

    //For Cart Purposes
    cartCreate(){
        const obj = {}
        //Buscamos el maximo index de carrito 
        const idCarts = this.list.map(obj => {
            return obj.id
        })
        const maxIdCarts = Math.max(...idCarts)

        if(maxIdCarts<0) {
            maxIdCarts = 0
        }

        obj.id = maxIdCarts + 1
        obj.timestamp = Date.now()
        obj.productos= []

        //Pusheamos el cart
        this.list.push(obj)
        return obj.id
    }

    cartDrop(id){

        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return errorCarrito
        }

        this.list = this.list.filter((obj) => obj.id != id)
        
        return this.list

    }

    cartInsert(cartId,obj) {
        //Buscamos el index del id del cart
        const indexCart = this.list.findIndex((objT) => objT.id == cartId)

        if(indexCart == -1 ) {
            return errorCarrito
        }

        if(obj.id == undefined) {
            return errorProducto
        }

        //Convertimos los elementos del obj en numeros
        obj.id = +obj.id
        obj.cantidad = +obj.cantidad

        //Buscamos el index del id del producto en el cart
        const indexProductInCart = this.list[indexCart].productos.findIndex((objT) => objT.id == obj.id)

        if(indexProductInCart != -1) {
            this.list[indexCart].productos[indexProductInCart].cantidad += obj.cantidad
            
        } else {
            obj.timestamp = Date.now()
            //Pusheamos el producto 
            this.list[indexCart].productos.push(obj)
        }
        return obj
            
    }

    cartDelete(cartId,prodId) {
        const cartSearch = this.list.findIndex((obj) => obj.id == cartId)

        if(cartSearch<0){
            return errorCarrito
        }

        const prodSearch = this.list[cartSearch].productos.findIndex((obj) => obj.id == prodId)

        if(prodSearch<0) {
            return errorCarrito
        }

        this.list[cartSearch].productos.splice(prodSearch, 1)

        return prodId
        
    }
}

export default Contenedor