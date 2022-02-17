import app from '../src/server.js'

const PORT = 8000
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor ${error}`))