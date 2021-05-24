var Municipio=require('../models/municipio');
var Credenciales=require('../models/credenciales');
var Cliente=require('../models/cliente');

module.exports={
    getMunicipios:async (req,res,next)=>{
        //una vez obtenido el codigo de provincia, hacer consulta a coleccion Municipios
        //de MongoDB y devolver array de objetos al cliente
        try{
            var _listaMunis=await Municipio
                                .find({ CodPro: req.tercerseg })
                                .sort({NombreMunicipio:1});
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(datos);
        } catch(error){
            console.log(`error al obtener la lista de municipios ${error}`)
        }
        
    },
    activarEmail:async (req,res,next)=>{
        //en el segmento :tercersegment de la url va el Email del cliente a activar...
        var _emailActivar= req.tercerseg;
        try{
            var _objetoUpdate=await Credenciales.find({"email":_emailActivar})
                                                .populate("cliente");
            console.log(_objetoUpdate);
            if(_objetoUpdate.cliente.cuentaActiva==false){
                //update del objeto cliente recuperado
                var _resultado=await Cliente.findOneAndUpdate(
                    { "_id":objetoUodate.cliente._id }, //<- parametro filtro para hacer el find sobre coleccion "clientes"
                    { "cuentaActiva":true }, //z- $set del update en mongo: valores a modificar del documento encontrado con el filtro find
                    { "new":true } //<- devolver el objeto una vez hecha la modificacion (por defecto devuelve el objeto sin modificar)
                );
                console.log(_resultado);
                res.setHeader("Content-Type","application/json");
                res.status(200).send(_resultado);
            }

        }catch(error){

        }
    }
}