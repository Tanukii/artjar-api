var Materia=require("../models/materia");

// --- cargo la lista de materias troncales para pasarselo a la vista parcial del layout donde van todas las vistas del {{body}}
var _listamateriasPadre=[];
try{
    var result = Materia.find({"idMateriaPadre":0});
    _result.forEach(
        materia => {
            _listamateriasPadre.push(
                {
                    idMateria: materia.idMateria,
                    nombreMateria: materia.nombreMateria
                }
            )
        }
    );
    
} catch (error){
 console.log(`error al obtener lista materias: ${error}`);
}



module.exports={
    getLibros: async (req,res,next)=>{
        //... en segmento :idMateria va el idMateria de los libros a Mostrar, si vale 0 indica
        //q es la pagina inicial(se muestran ofertas, libros mas vendidos, etc)

        //recuperar los libros asociados a esa idMateria y mostrarlos en vista Libros.hbs
        //q tienen en layout definido en Layouts <- __Layout.hbs
        res.status(200).render("Tienda/Libros.hbs", {conjuntomaterias: _listamateriasPadre}); //<- no pasamos el layout por que viene de default
    }
}