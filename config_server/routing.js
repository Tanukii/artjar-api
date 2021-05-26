// --- IMPORTACION DE CONTROLADORES ---
var Registro = require("../controllers/clienteControllerAsyncAwait")

module.exports=function(servidorExpress){

    // servidorExpress.param(
    //     "tercerseg",
    //     (req,res,next,valortercerSeg)=>{
    //         req.tercerseg=valortercerSeg;
    //         next();
    //     }
    // );
    
    
    // servidorExpress.get('/api/getMunicipio/:tercerseg',RESTService.getMunicipios);
    servidorExpress.post('/api/Registro/', Registro.registropost);
}