var express=require('express');
var router=express.Router();


var RESTService=require("../../../controllers/RESRServiceController");
//parametro que se pasa como un segmento de la URL para obtener info de municipios
//Requiere configuracion tal que asi
router.param(
    "tercerseg",
    (req,res,next,valortercerSeg)=>{
        req.tercerseg=valortercerSeg;
        next();
    }
);


router.get('/getMunicipio/:tercerseg',RESTService.getMunicipios);
router.get('/ActivarCuenta/:tercerseg', RESTService.activarEmail);
    

module.exports=router;