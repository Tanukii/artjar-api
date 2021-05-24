var mongoose=require('mongoose');

var esquemaDireccion=new mongoose.Schema(
    {
        tipoDireccion: { type:String, required: true },
        calle: { type: String, required: true },
        cp: { type: String, required: true, match: /^[0-9]{5}$/ },
        provincia:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Provincia"
        },
        municipio:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Municipio"
        }
    }
);

module.exports=mongoose.model("Direccion",esquemaDireccion,"direcciones");