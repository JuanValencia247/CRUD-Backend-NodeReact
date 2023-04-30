// Importacion de la conexion
const {conexion} = require('./database/conexion');
const express = require('express');
const cors = require('cors')

//Inicializar app
console.log('App de node arrancada');

//Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); //Recibe los datos en formato json
app.use(express.urlencoded({extended:true}));//Recibe los datos de un formulario o los conbierte en formato json

// Crear RUTAS
const rutas_articulo = require('./routes/articulo');

//Cargar las rutas
app.use('/api', rutas_articulo);


// Crear servidor y escuchar peticiones http
app.listen(puerto, () =>{
    console.log("Servidor corriendo en el puerto: " + puerto);
})