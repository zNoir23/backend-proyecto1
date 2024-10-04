require('dotenv').config();
const express = require('express')
const cors = require('cors')

const {dbConnection} =  require ('./database/config')


// Creacion de servidor
const app = express();

// Configuracion de CORS
app.use(cors())

// Lectura y parseo del body
app.use(express.json())

// Base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))

// Productos
app.use('/api/productos', require('./routes/productos'));


// Lo correré en el puerto 3006
app.listen(process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
})