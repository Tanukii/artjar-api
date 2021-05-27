// --- IMPORTS ---
var bodyParser=require('body-parser');
var rutas=require('./routing');

module.exports=function(servidorExpress){
    
    // - la sesion la manejara el behaviour subject en cliente, nosotros emularemos identity framework en servidor para identificar al usuario -
    // - Teoricamente solo seria necesario el parseo de body y json -
    servidorExpress.use(bodyParser.urlencoded({extended:false}));
    servidorExpress.use(bodyParser.json());

    // - COnfiguracion de CORS para permitir peticiones con Angular
    servidorExpress.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
    
    rutas(servidorExpress);

}