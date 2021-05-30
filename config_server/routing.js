// --- IMPORTACION DE CONTROLADORES ---
var userController = require("../controllers/userController")

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
    
    
    // app.get('/api/getMunicipio/:tercerseg',RESTService.getMunicipios);
    // - Ruta para comprobar nombre de usuario -
    app.get('/api/CheckNickname/:nick',userController.checkNickname);
    // - Ruta para registro -
    app.post('/api/Registro/', userController.registroPost);
    // - Ruta para comprobar si el usuario esta logueado -
    app.post('/api/CheckLoged/', userController.checkLog);
}