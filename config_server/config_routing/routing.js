var rutasCliente=require('./rutasCliente/routeCliente');
var rutasTienda=require('./rutasTienda/routeTienda');
var rutasREST=require('./rutasServicioRestful/routeREST.js');

module.exports=function(servidorExpress){

    servidorExpress.use('/api',rutasREST);
}