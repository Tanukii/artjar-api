// --- Importacion de modelos ---

const uuid = require("uuid"),
    mongoose = require("mongoose"),
    jwt = require("jsonwebtoken");
    

module.exports = {
    procesarImagen: async (req, res,  next) => {
        console.log(req.body);
        //console.log(req.files);
        res.status(200).send();
        
    }

}