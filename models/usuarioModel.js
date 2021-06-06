var mongoose=require('mongoose');

var usuarioSchema= new mongoose.Schema(
    {
        idUser:{ type:String, required: true, unique: true },
        nickname: { type:String, requited: true, match: /^([0-9a-zA-Z]){8,12}$/, unique: true },
        password: { type:String, required: true},
        tier: { type: String, default: true },
        exBucks: { type: Number, required: true}
    }
);
module.exports=mongoose.model("Usuario",usuarioSchema,"usuarios")