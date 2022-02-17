let productosDao
let carritosDao
process.env.DAO = "file"
switch (process.env.DAO) {
    case 'file': 
        const {default: CarritosDaoFile } = await import('./carritos/CarritosDaoFile.js')
        const {default: ProductosDaoFile } = await import('./productos/ProductosDaoFile.js')
        productosDao = new ProductosDaoFile()
        carritosDao = new CarritosDaoFile()
        break
    
    case 'firebase':
        const {default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js')
        const {default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
    
    case 'mongodb':
        const {default: CarritosDaoMongo } = await import('./carritos/CarritosDaoMongo.js')
        const {default: ProductosDaoMongo } = await import('./productos/ProductosDaoMongo.js')
        productosDao = new ProductosDaoMongo()
        carritosDao = new CarritosDaoMongo()
        break
}

export {productosDao, carritosDao}