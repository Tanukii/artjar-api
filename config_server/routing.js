// --- IMPORTACION DE CONTROLADORES ---
var userController = require("../controllers/userController")
var imageController = require("../controllers/imageController")

const path = require('path');
const multer = require('multer');

let upload = multer({dest: 'private/uploads'});
    

module.exports=function(app){

    // --- SEGMENTOS URL ---
    // - segmento para nickname -
    app.param(
        "nick",
        (req,res,next,nickValue)=>{
            req.nick=nickValue;
            next();
        }
    );

    // --- RUTAS CLIENTE ---
    // - Ruta para comprobar nombre de usuario -
    app.get('/api/CheckNickname/:nick',userController.checkNickname);

    // - Ruta para registro -
    app.post('/api/Registro/', userController.registroPost);

    // - Ruta para login -
    app.post('/api/Login/', userController.loginPost);

    // - Ruta para comprobar si el usuario esta logueado -
    app.post('/api/CheckLoged/', userController.checkLog);



    // --- RUTAS IMAGENES ---
    // - Ruta para la subida de imagen -
    app.post('/api/subirImagen/', upload.fields([{ name: 'foto', maxCount: 1 }]), imageController.procesarImagen);
}