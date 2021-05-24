var mongoose=require('mongoose');

var esquemaCredenciales=new mongoose.Schema(
    {
        login:{ type:String, required: true },
        email:{ type: String, required: true, match:/^.*@.*\.(es|com|edu)$/ },
        password: { type:String, required:true },
        cliente:{ type: mongoose.Schema.Types.ObjectId, ref: "Cliente" } //<- a partir de unas credenciales puedo recuperar un Cliente por su _id
    }
);

module.exports=mongoose.model("Credenciales",esquemaCredenciales,"credenciales");