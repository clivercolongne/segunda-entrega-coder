import Contenedor from '../../containers/ContenedorMongo.js'

class CarritosDaoMongo extends Contenedor {
    constructor() {
        super('carritos', {
            id: {type:Number, required:true},
            timestamp: {type:Date, required:true},
            productos: {type: []}
        })
    }

}

export default CarritosDaoMongo