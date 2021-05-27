var mongoose=require('mongoose');

var usuarioSchema= new mongoose.Schema(
    {
        id:{ type:String, required: true },
        nickname: { type:String, requited: true, match: /^([0-9a-zA-Z]){8,12}$/ },
        password: { type:String, required: true},
        tier: { type: String, default: true },
        exBucks: { type: Number, required: true}
    }
);
module.exports=mongoose.model("Usuario",usuarioSchema,"usuarios")