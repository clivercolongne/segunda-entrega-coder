import Contenedor from '../../containers/ContenedorFile.js'

class ProductosDaoFile extends Contenedor {
    constructor() {
        super('productos.json')
    }
}

export default ProductosDaoFile