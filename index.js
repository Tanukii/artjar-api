const express = require('express'),
    mongoose = require('mongoose'),
    middlewareImport = require('./config_server/middleware'),
    app = express();
require('dotenv').config();

middlewareImport(app);

app.listen(3000, (err) => !err ? console.log("Servidor API escuchando en 3000") : console.log("Error servidor "+ err)  );


mongoose.connect(
    process.env.cadenaMongo,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => !err ? console.log("Mongo escuchando en 27017") : console.log("Error " + err)
);