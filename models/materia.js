var mongoose=require("mongoose");

var esquemaMateria=new mongoose.Schema(
    {
        idMateria:{type: Number, required: true},
        idMateriaPadre: { type: Number, require: true},
        nombreMateria: { type: String, required: true}
    }
);

module.exports=mongoose.model("Materia", esquemaMateria,"materias")