var mongoose=require('mongoose');
//-----nos vamos a definir el ESQUEMA conta el que se
//va a mapear cada documento de la coleccion provincias de mongoDB
//1 documento de la coleccion = 1 objeto javascript creado con las props q tiene este esquema
//los objetos q cumplen este esquema van a atener estas propiedades:
// -CodProv <- codigo que identifica a la provincia
// - NombreProvincia <- nombre de la provincia completo


var esquemaProvincia=new mongoose.Schema(
    {
        CodPro:{ type: Number, required: true },
        NombreProvincia:{ type: String, required: true }
    }
);

//exporto el modelo de objetos a crear
//1º parametro <- nombre de los objetos a crear
//2º parametro <- esquema q se usa para crear esos objetos a partir de documentos de mongodb
//3º parametro <- nombre de la coleccion desde la que se recuperan esos documentos
//4º redireccion
module.exports=mongoose.model("Provincia",esquemaProvincia,"provincias");
