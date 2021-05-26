var express = require('express');
var mongoose = require('mongoose');
var configPipeline = require('./config_server/middleware');
var servidor = express();
require('dotenv').config();

configPipeline(servidor);

servidor.listen(3000, (err) => {
    if (!err) { console.log(" servidor web express corriendo en puerto 3000 "); }
    else { console.log(`errores al lanzar el servidor ${err}`); }
});


// mongoose.connect(
//     process.env.CONNECTION_MONGO,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     },
//     (err) => {
//         if (err) {
//             console.log("ERROR CONEXION A MONGODB " + err);
//         } else {
//             console.log("... conectados al servidor MONGODB al puerto 27017 ...")
//         }
//     }
// );