require('dotenv').config();
const express = require('express')
const cors = require('cors')

const {dbConnection} =  require ('./database/config')


// Creacion de servidor
const app = express();

// Configuracion de CORS
app.use(cors())

// Base de datos
dbConnection();

// Rutas
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola'
    })

});


// Lo correré en el puerto 3006
app.listen(process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
})