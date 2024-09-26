const {response} = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt')

const usuario = require('../models/usuario');


const login = async(req, res = response) => {

    const { email, password} = req.body;

    try {

        //Para verificar email
        const usuarioDB = await Usuario.findOne({email})

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo no se encontro'
            })
        }

        //Para verificar Contraseña
        const validPassword =  bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            })
        }

        // Generacion del JWT
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            token,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Problema con el servidor'
        })
    }

}


module.exports = {
    login,
}