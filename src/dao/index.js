let productosDao
let carritosDao

switch (process.env.DAO) {
    case 'file': 
        const {default: CarritosDaoFile } = await import('../dao/carritos/CarritosDaoFile.js')
        const {default: ProductosDaoFile } = await import('../dao/productos/ProductosDaoFile.js')
        productosDao = new ProductosDaoFile()
        carritosDao = new CarritosDaoFile()
        break
    
    case 'firebase':
        const {default: CarritosDaoFirebase } = await import('../dao/carritos/CarritosDaoFirebase.js')
        const {default: ProductosDaoFirebase } = await import('../dao/productos/ProductosDaoFirebase.js')
        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
    
    case 'mongodb':
        const {default: CarritosDaoMongo } = await import('../dao/carritos/CarritosDaoMongo.js')
        const {default: ProductosDaoMongo } = await import('../dao/productos/ProductosDaoMongo.js')
        productosDao = new ProductosDaoMongo()
        carritosDao = new CarritosDaoMongo()
        break
}

export {productosDao, carritosDao}