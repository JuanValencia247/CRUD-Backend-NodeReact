const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1/mi_blog'

const conexion = async()=>{
    try{
        //Conexion a la base de datos
        await mongoose.connect(url);

        //Parametros dentro de objeto encaso de salir un error
        //  useNewUrlParser : true
        //  useUnifiedTopoLogy: true
        //  useCreateIndex: true

        console.log('Conexion exitosa');
    }catch (error){
        console.log(error);
        throw new Error('No se a podido conectar a la base de datos');
    }
}

// Exportar la funcion creada para la conexion
module.exports = {
    conexion
}