var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var hBars=require('express-handlebars');

var session=require("express-session"); 

var mongoDbStore=require("connect-mongodb-session")(session);
var _mystore=new mongoDbStore({
    uri: process.env.CONNECTION_MONGODB, 
    collection: "variablesSesionClientes"
});

var rutas=require('./config_routing/routing');

module.exports=function(servidorExpress){
    
    servidorExpress.use(bodyParser.urlencoded({extended:false}));
    servidorExpress.use(bodyParser.json());

    servidorExpress.use(
        session(
            {
                secret: process.env.SECRETKEY_SESSION_ID, //<- clave de cifrado del session-id q va en la cookie al navegador
                resave: false, //<- no generar session-id en cookie constantemente si ya esta creada
                saveUninitialized: true,
                store: _mystore, //<- nombre de variable donde se define el backend para almacenar las variables de sesion de los clientes
                cookie: {
                    path:"/",
                    httpOnly: true,
                    maxAge: 360000,
                    secure: false
                }// <- parametros de la cookie en el cliente donde se almacena el session-id cifrado q le manda el servidor
            }
        )
    );

    //4º modulo middleware de ENRUTAMIENTO (routing), en funcion de la URL q meta el cliente q vista tengo q
    //generar y q accion a ejecutar contra el servidor de BD MONGODB
    rutas(servidorExpress);

}