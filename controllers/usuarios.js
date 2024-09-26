const usuario = require('../models/usuario')
const {response} = require ('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const {generarJWT} = require('../helpers/jwt')

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })

}

const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

    const usuario = new Usuario(req.body);

    // Aqui encriptaré la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync (password, salt)

    // Aqui guardo el usuario
    await usuario.save()

    // Generacion del JWT
    const token = await generarJWT(usuario.id)

    res.json({
        ok: true,
        usuario,
        token
    })


        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

    

}


const actualizarUsuario = async(req, res = response) => {
    
    // Aqui validare el token y comprobare si el usuario es correcto
    const uid = req.params.id
  

    try {
        
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese ID'
            })
        }

        if (usuarioDB.email === req.body.email) {
            delete campos.email;
        } else{
            const existeEmail = await Usuario.findOne({email: req.body.email})
            if (existeEmail) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Existe un usuario con ese email'
                })
            }
        }

        // Actualizacion
        const campos = req.body;
        delete campos.password 

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true})

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
}