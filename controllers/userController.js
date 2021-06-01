// --- Importacion de modelos ---
const usuarioModel = require("../models/usuarioModel");

const uuid = require("uuid"),
    bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    jwt = require("jsonwebtoken");
    

module.exports = {
    checkNickname: async (req, res, next) => {

        // - Comprobacion de si un nickname ya esta en uso -
        try {
            let _returnMongo = await usuarioModel.find({ nickname: req.nick.toLowerCase() });
            _returnMongo.length === 0 ? res.status(200).send() : res.status(400).send()
        } catch (err) {
            console.log("Error en recuperacion de nickname " + err)
        }
    },
    checkLog: async (req, res, next) => {
        try {
            let _tokenDecoded = jwt.verify(req.body.jwt, process.env.secretJWT);
            if (_tokenDecoded.exp > Math.floor(Date.now() / 1000)) {
                res.setHeader("Content-Type", "application/json");
                res.status(200).send({ res: true, exp:false });
            } else {
                res.setHeader("Content-Type", "application/json");
                res.status(200).send({ res: false, exp: true });
            }
        } catch (err) {
            console.log(err);
            res.setHeader("Content-Type", "application/json");
            res.status(200).send({ res: false, exp:false });
        }
    },
    registroPost: async (req, res, next) => {
        // - Llegada de datos por body -
        // - Encriptado de contraseña -
        let _hashPass = bcrypt.hashSync(req.body.password, 15)
        // generamos el objeto del usuario y lo asociamos al schema de mongoose -
        let _newUser = {
            idUser: uuid.v4(),
            nickname: req.body.nickname.toLowerCase(),
            password: _hashPass,
            tier: 'Cliente',
            exBucks: 500
        }

        let _userSchema = new usuarioModel(_newUser);

        // --- Inserccion en BD ---
        try {
            await _userSchema.save();
        } catch (error) {
            let respuesta = { "Error": "Hubo un error " };
            console.log(error);
            res.setHeader("Content-Type", "application/json");
            res.status(500).send(respuesta);
        }

        // --- Creacion de token y respuesta
        delete _newUser['password'];
        let _jwtUser = jwt.sign(_newUser, process.env.secretJWT, { expiresIn: "1h" });
        let respuesta = {
            userData: _newUser,
            jwt: _jwtUser
        };

        res.setHeader("Content-Type", "application/json");
        res.status(200).send(respuesta);
    },
    loginPost: async (req, res, next) => {
        try {
            let _returnMongo = await usuarioModel.find({ nickname: req.body.nickname.toLowerCase() });
            if (_returnMongo.length === 1) {
                let _passHash = _returnMongo[0].password;
                if (bcrypt.compareSync(req.body.password, _passHash)) {
                    // - Passwords coinciden, creo y devuelvo token -
                    let _newUser = {
                        idUser: _returnMongo[0].idUser,
                        nickname: _returnMongo[0].nickname,
                        tier: _returnMongo[0].tier,
                        exBucks: _returnMongo[0].exBucks
                    }

                    let _jwtUser = jwt.sign(_newUser, process.env.secretJWT, { expiresIn: "1h" });
                    let respuesta = {
                        userData: _newUser,
                        jwt: _jwtUser
                    };

                    res.setHeader("Content-Type", "application/json");
                    res.status(200).send(respuesta);
                } else {
                    // - Passwords no coinciden, devuelvo error -
                    res.status(404).send();
                }
            } else {
                // - No se encontro Usuario, devuelvo error -
                res.status(400).send();
            }
        } catch (err) {
            console.log(err)
        }

    }

}