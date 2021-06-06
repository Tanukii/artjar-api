var mongoose=require('mongoose');

var imagenSchema= new mongoose.Schema(
    {
        idImagen:{ type:String, required: true },
        idUsuario: { type:String, requited: true },
        nickUsuario: { type:String, requited: true },
        rutaOrig: { type:String, required: true},
        rutaRes: { type: String, default: true },
        precioOrig: { type: Number, required: true},
        porPagar: { type: Number, required: true}
    }
);
module.exports=mongoose.model("Imagen",imagenSchema,"imagenes")