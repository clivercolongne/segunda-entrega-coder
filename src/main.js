
const express = require('express')

const app = express()

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor ${error}`))