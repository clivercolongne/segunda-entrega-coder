import Contenedor from '../../containers/ContenedorMongo.js'

class ProductosDaoMongo extends Contenedor {
    constructor() {
        super('productos', {
            nombre: {type:String, required:true},
            descripcion: {type:String},
            codigo: {type:Number, required:true},
            foto: {type:String},
            precio: {type:Number, required:true},
            stock: {type:Number, required:true},
            id: {type:Number, required:true},
            timestamp: {type:Date, required:true}
        })
    }
}

export default ProductosDaoMongo