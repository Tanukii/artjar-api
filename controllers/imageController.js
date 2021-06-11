// --- Importacion de modulos ---
const Jimp = require("jimp"),
    mongoose = require("mongoose"),
    jwt = require("jsonwebtoken")
    jimp = require('jimp')
    fileSys = require('fs');
    
// - Importacion de modelos
const imagenModel = require("../models/imagenModel");

module.exports = {
    procesarImagen: async (req, res,  next) => {
        // - Comprobacion de Token -

        try {
            let _tokenDecoded = jwt.verify(req.body.jwt, process.env.secretJWT);
            if (_tokenDecoded.exp > Math.floor(Date.now() / 1000)) {
                // -Verificacion Correcta, se procesa la imagen -

                // - Copiado y Borrado de imagen a carpetas -
                let _format = req.files.foto[0].originalname.split('.')[1]

                let _rutaOrig = `private/original/${req.files.foto[0].filename}.${_format}`;
                let _rutaRes = `private/resize/${req.files.foto[0].filename}_res.${_format}`;

                fileSys.copyFileSync(req.files.foto[0].path, _rutaOrig);
                

                // - Redimensionado de la imagen -
                let _img = await Jimp.read(_rutaOrig);
                _img.resize(250,Jimp.AUTO);
                _img.write(_rutaRes);
                
                // - Insercion en base de datos -
                let _newImage = new imagenModel({
                    idImagen: req.files.foto[0].filename, // Id que asigna multer
                    idUsuario: _tokenDecoded.idUser, // Id alojado en token decodificado
                    nickUsuario: _tokenDecoded.nickname, // Nick alojado en token decodificado
                    rutaOrig: _rutaOrig, // Ruta del original
                    rutaRes: _rutaRes, // Ruta con resolucion cambiada
                    precioOrig: req.body.precio, // Precio original
                    porPagar: req.body.precio, // Cantidad que falta por pagar
                    isUnlocked: false
                });

                await _newImage.save();

                res.setHeader("Content-Type", "application/json");
                res.status(200).send({ res: true, exp:false });
            }
            //fileSys.unlinkSync(req.files.foto[0].path);

        } catch (err) {
            // - Error en el proceso -
            if(err.expiredAt){
                // - Token expirado -
                //fileSys.unlinkSync(req.files.foto[0].path);
                res.setHeader("Content-Type", "application/json");
                res.status(400).send({ res: false, exp: true });
            }else{
                //fileSys.unlinkSync(req.files.foto[0].path);
                console.log(err);
                res.setHeader("Content-Type", "application/json");
                res.status(400).send({ res: false, exp:false });
            }
            
        }
        // - Borrado de imagen a fuera de todo para que ejecute siempre -
        fileSys.unlinkSync(req.files.foto[0].path);
    }

}