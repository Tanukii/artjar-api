var mongoose=require('mongoose');

var esquemaCliente= new mongoose.Schema(
    {
        nombre:{ type:String, required: true },
        apellidos: { type:String, requited: true },
        nif: { type:String, required: true, match: /^[0-9]{8}[A-Z]$/, default: "00000000A" },
        cuentaActiva: { type: Boolean, default: false },
        telefonoContacto: { type: String, required: true, match: /^[6-9][0-9]{8}$/, default:"912345678" },
        credenciales:{ type: mongoose.Schema.Types.ObjectId, ref: "Crededenciales" }, //<- necesitamos referencia a modelo Credenciales
        direcciones: [ //<- array de _ids de objetos de tipo Direccion
            {
            type: mongoose.Schema.Types.ObjectId, ref: "Direccion"
            }
        ], //<- necesitamos referencia a modelo Direccion
        pedidos:[{}] //<- necesitamos referencia a modelo Pedido
    }
);
module.exports=mongoose.model("Cliente",esquemaCliente,"clientes")