// --- Importacion de modelos ---
const usuarioModel = require("../models/usuarioModel");

// var Municipio=require("../models/municipio");
// var Cliente=require("../models/cliente");
// var Direccion=require("../models/direccion");
// var Credenciales=require("../models/credenciales");

const uuid = require("uuid"),
    bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    jwt = require("jsonwebtoken");


// function _crearVistaRegistro(res,mensajesError){

//     var _listaprovincias=[];

//     Provincia.find({},(err,datos)=>{
//         if(err){
//             console.log(`ERRORES AL RECUPERAR LAS PROVINCIAS DE MONGODB....${err}`);
//         } else {
//             datos.forEach(prov => {
//                             //console.log(prov);
//                              _listaprovincias.push(
//                                                     { 
//                                                         codprov: prov.CodPro,
//                                                          nombreprovincia: prov.NombreProvincia 
//                                                     }
//                                                     );
//                                   }
//                             );
//             res.status(200).render("Cliente/Registro.hbs",{ layout:null, listaprovs: _listaprovincias, mensajesMostrar: mensajesError });
//         }   
//     }).sort({NombreProvincia: 1});

// }

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

// module.exports={
//     registroget: (req,res,next)=>{},
//     registropost: async (req,res,next)=>{
//         var _direcProv=new Provincia({CodPro:req.body.codpro});
//         var _direcMuni=new Municipio({CodPro:req.body.codpro, CodMun:req.body.codmun});

//         var _nuevaDir=new Direccion(
//             {
//             calle: req.body.calle,
//             cp: req.body.cp,
//             tipodireccion: "Principal"+req.body.nif,
//             provincia: _direcProv._id,
//             municipio: _direcMuni._id    
//             }
//         );

//         var _miscreds=new Credenciales(
//             {
//                 email: req.body.email,
//                 login: req.body.login,
//                 password: bcrypt.hashSync(req.body.password,10),
//                 cliente: new mongoose.Types.ObjectId()
//             }
//         );

//         try {
//             var _resultinserDirec=await _nuevaDir.save();
//             var _resutinserCreds=await _miscreds.save();
//             var _cliente=new Cliente(
//                 {
//                     _id: _miscreds.cliente,
//                     nombre: req.body.nombre,
//                     apellidos: req.body.apellidos,
//                     nif: req.body.nif,
//                     telefonoContacto: req.body.telefono,
//                     cuentaActiva: false,
//                     credenciales: _miscreds._id,
//                     direcciones: new Array(_nuevaDir._id),
//                     pedidos: new Array()
//                 }
//             );
//             var _resultinserCli=await _cliente.save();
//             //envio email con la funcion importada del modulo:clienteMailjet
//             var _mensajeHTML=``;
//             enviarEmail(
//                 _miscreds.email,
//                 _cliente.nombre,
//                 "Proceso de registro de usuario en Agapea.com OKs, activa la cuenta",
//                 _mensajeHTML
//             );
//             res.status(200).render("Cliente/RegistroOK.hbs",{ layout: null } );     
//         } catch (error) {

//         }

//     },
//     loginget: (req,res,next)=>{
//         res.status(200).render("Cliente/Login.hbs", { layout: null });
//     },
//     loginpost: async (req,res,next)=>{
//         var _emai=req.body.email;
//         var _password=req.body.password;
//         try{

//             //tengo q comprobar 
//             //- 1º la cuenta esta ACTIVADA o NO, sino mandar una vista q le muestre al usuario el mensaje
//             // "...compruebe su email para activar la cuenta, sino ha recibido su email pulse aqui..."
//             //2º -el email y el hash de la password del formulario del login coinciden con el 
//             // almacenado en el correspondiente documento de la coleccion "credenciales" de mongo
//             var _creds =awaitCredenciales.findOne({"email":_email});

//             //comparo con el hash
//             if(bcrypt.compareSync(_password,_credsTesteo.password)){
//                 //crear variable de sesion con datos del cliente y redireccionar al
//                 //index de la tienda para q comience a comprar
//                 var _cliente=await Cliente.findOne({"_id": credencialesTesteo.cliente});

//                 console.log(`cliente q va a la variable de sesion: ${_cliente}`)
//                 req.session.cliente=_cliente;

//                 res.status(200).redirect("Tienda/Libros");
//             }else{
//                 console.log("Password Erronea");
//                 res.status(200).render("Cliente/Login.hbs", { layout: null}); //, mensajeError="Login Fallido, intentelo de nuevo..." 
//             }
//         }catch(error){
//             console.log(`error al hacer login y comparar credenciales ${error}`);
//             res.status(200).render("Cliente/Login.hbs", { layout: null}); //, mensajeError="Email y/o Password erroneos..." 
//         }

//     }

// }