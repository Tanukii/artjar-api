
//los valores de configuracion como claves API, etc se han
//de meter en variables de entorno donde se ejecuta el MONO-THREAD
//del proceso de node
//esto se ejecuta atraves del objeto porcess
var mailjet=require('node-mailjet')
            .connect(
                process.env.API_KEY_MAILJET,
                process.env.SECRET_KEY_MAILJET
);

module.exports.enviarEmail=async function(ToCliente,NombreCliente,Subject,Body){

    //objeto q define el mensaje(s) a mandar con el cliente de correo
    //tiene la unica propiedad: "Messages" q es un array de objetos de tipo Message

    var _emailAMandar={
        "Message":[
            {
                "From":{
                    "Email": process.env.CORREO_MAILJET, //<- mail registrado para poder enviar emails
                    "Name": "Administrador de Agapea3.com"
                },
                "To": [
                    {
                        "Email": ToCliente,
                        "Name": NombreCliente
                    }
                ],
                "Subject": Subject,
                "TextPart":"",
                "HtmlPart": Body
            }
        ]
    };
    // mandamos mensaje atraves del cliente de correo con la variable: "mailjet"
    // te devuelve un objeto de tipo PROMISE q se ejecuta en segundo plano
    /*
    mailjet.post("send",{"version":"v3.1"})
            .request(_emailAMandar)
            .then(
                (resultadoEnvio)=>{
                    console.log(resultadoEnvio);
                }
            )
            .catch(
                (erroresEnvio)=>{
                    console.log(erroresEnvio);
                }
            );
    */
    // ----- Con ASYNC/AWAIT -----
    try{
        var resultadoEnvio=await mailjet.post("send",{"version":"v3.1"}).request(_emailAMandar);
        console.log(resultadoEnvio);
    }catch(error){
        console.log(error);
    }
}