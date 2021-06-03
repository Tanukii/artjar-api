// --- IMPORTS ---
var bodyParser=require('body-parser');
var rutas=require('./routing');

module.exports=function(app){
    
    // - la sesion la manejara el behaviour subject en cliente, nosotros emularemos identity framework en servidor para identificar al usuario -
    // - Teoricamente solo seria necesario el parseo de body y json -
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    // - COnfiguracion de CORS para permitir peticiones con Angular
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
    
    rutas(app);

}