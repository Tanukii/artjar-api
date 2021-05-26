// --- IMPORTS ---
var bodyParser=require('body-parser');
var rutas=require('./routing');

module.exports=function(servidorExpress){
    
    // - la sesion la manejara el behaviour subject en cliente, nosotros emularemos identity framework en servidor para identificar al usuario -
    // - Teoricamente solo seria necesario el parseo de body y json -
    servidorExpress.use(bodyParser.urlencoded({extended:false}));
    servidorExpress.use(bodyParser.json());
    
    rutas(servidorExpress);

}