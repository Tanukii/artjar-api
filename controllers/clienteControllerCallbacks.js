var Provincia=require("../models/provincia");
var Municipio=require("../models/muncipio");
var Cliente=require("../models/cliente");
var Direccion=require("../models/direccion");
var Credenciales=require("../models/credenciales");

var bcrypt=require("bcrypt"); //<----paquete para hashear passwords y comprobar hashes
var mongoose=require("mongoose");

function _crearVistaRegistro(res,mensajesError){

        var _listaprovincias=[];
    
        Provincia.find({},(err,datos)=>{
            if(err){
                console.log(`ERRORES AL RECUPERAR LAS PROVINCIAS DE MONGODB....${err}`);
            } else {
                datos.forEach(prov => {
                                //console.log(prov);
                                 _listaprovincias.push(
                                                        { 
                                                            codprov: prov.CodPro,
                                                             nombreprovincia: prov.NombreProvincia 
                                                        }
                                                        );
                                      }
                                );
                res.status(200).render("Cliente/Registro.hbs",{ layout:null, listaprovs: _listaprovincias, mensajesMostrar: mensajesError });
            }   
        }).sort({NombreProvincia: 1});
    
    }



module.exports={
    registroget: (req,res,next)=>{ _crearVistaRegistro(res,[]); },
    registropost: (req,res,next)=>{
        var _direcProv=new Provincia({CodPro:req.body.codpro});
        var _direcMuni=new Municipio({CodPro:req.body.codpro, CodMun:req.body.codmun});
    
        var _nuevaDir=new Direccion(
            {
            calle: req.body.calle,
            cp: req.body.cp,
            tipodireccion: "Principal"+req.body.nif,
            provincia: _direcProv._id,
            municipio: _direcMuni._id    
            }
        );
    
        _nuevaDir.save((err,resp)=>{
    
                if(!err){
                        //insercion de direccion ok, vamos con cliente y credenciales...
                        console.log("_id de objeto direccion a pasar al cliente... "+_nuevaDir._id);
                        //----- credenciales-----
                        var _miscreds=new Credenciales(
                            {
                                email: req.body.email,
                                login: req.body.login,
                                password: bcrypt.hashSync(req.body.password,10),
                                cliente: new mongoose.Types.ObjectId()
                            }
                        );
                        _miscreds.save((errCreds,resultCreds)=>{
                            if(!errCreds){
                                 //----- cliente----------
                                 var _cliente=new Cliente(
                                     {
                                         _id: _miscreds.cliente,
                                        nombre: req.body.nombre,
                                        apellidos: req.body.apellidos,
                                        nif: req.body.nif,
                                        telefonoContacto: req.body.telefono,
                                        cuentaActiva: false,
                                        credenciales: _miscreds._id,
                                        direcciones: new Array(_nuevaDir._id),
                                        pedidos: new Array()
                                     }
                                 );
                                 _cliente.save((errCli,resultCli)=>{
                                     if(!errCli){
                                        
                                        console.log("Cliente insertado con exito, con sus credenciales y su direccion ppal...");
                                        res.status(200).render("Cliente/RegistroOK.hbs",{ layout: null } );

                                     } else {
                                         console.log(`error al insertar CLIENTE: ${errCli}`);
                                         _crearVistaRegistro(res,[`error al insertar CLIENTE: ${errCli}`]);
                                     }
                                 });
                    
                    
                            } else {
                                console.log(`error al insertar CREDENCIALES: ${errCreds}`);
                                _crearVistaRegistro(res,[`error al insertar CREDENCIALES: ${errCreds}`]);
                            }
                    
                        });
                } else {
                    console.log(`error insercion DIRECCION: ${err}`)
                    _crearVistaRegistro(res,[`error insercion DIRECCION: ${err}`]);
                }
        });
    },
    loginget: (req,res,next)=>{},
    loginpost: (req,res,next)=>{}

}