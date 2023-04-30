const { validar } = require("../helpers/validar");
const Articulo = require("../models/Articulo"); //Importando los modelos
const fs = require("fs"); //Importacion de libreri de fileSistem
const path = require('path');//Cogue un archivo para poder enviarlo

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "soy una accion de pruebas",
  });
};

const curso = (req, res) => {
  return res.status(200).send({
    curso: "Master en React",
    autos: "jc",
  });
};

const usuario = (req, res) => {
  return res.send("<h1>hola</h1>");
};

////////////////////////////////////////////////////////////////////////////////////////
// Crear articulos
const crear = (req, res) => {
  // Recoger parametros por post a guardar
  let parametros = req.body;

  // Validar datos
  try {
    validar(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  // Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  // Asignar valores a objeto basado en el modelo (manula o automatico)
  //articulo.titulo = parametros.titulo

  // Guardar el articulo en la base de datos
  articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se a guardado el articulo",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con exito",
    });
  });
};

////////////////////////////////////////////////////////////////////////////////////////
// Listar articulos
const listar = (req, res) => {
	// setTimeout (() =>{
	  let consulta = Articulo.find({}).exec((error, articulo) => {
    if (error || !articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se an encontrado articulos!",
      });
    }

    return res.status(200).send({
      status: "success",
      articulo,
    });
  });	
	// }, 3000)
};

//////////////////////////////////////////////////////////////////////////////////////////
// Listar articulos por ID
const mostrar = (req, res) => {
  // Recoger un id por la url
  let id = req.params.id;

  // Buscar el articulo
  Articulo.findById(id, (error, articulo) => {
    if (error || !articulo) {
      return req.status(404).json({
        status: "error",
        mensaje: "No se Ha encontrado el articulo ",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo,
    });
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Eliminar articulo
const eliminar = (req, res) => {
  let articuloId = req.params.id;

  Articulo.findByIdAndDelete({ _id: articuloId }, (error, articuloBorrado) => {
    if (error || !articuloBorrado) {
      return res.status(404).json({
        status: "error",
        articulo: articuloBorrado,
        mensaje: "No se elimino ningun articulo",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articuloBorrado,
      mensaje: "Articulo eliminado exitosamente!",
    });
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////
// Actualizar articulo
const editar = (req, res) => {
  //Recoger id del articulo a editar
  let articuloId = req.params.id;

  //Recoger datos del body
  let parametros = req.body;

  // Validar datos
  try {
    validar(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Buscar y actualizar articulo
  Articulo.findOneAndUpdate(
    { _id: articuloId },
    parametros,
    { new: true },
    (error, articuloActualizado) => {
      if (error || !articuloActualizado) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error al actualizar",
        });
      }

      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        mensaje: "Articulo actualizado exitosamente!",
      });
    }
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
// Subir imagen
const subir = (req, res) => {
  //Configurar multer

  //Recoger el fichero de imagen subido
  if (!req.file && !req.file) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion invalida",
    });
  }

  //Nombre del archivo
  let archivo = req.file.originalname;

  //Extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];

  //Comprobar extension correcto
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    //Borrar archivo y dar rrespuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen invalida",
      });
    });
  } else {
    //Si todo va bien, actualizar el articulo
    //Recoger id del articulo a editar
    let articuloId = req.params.id;

    //Buscar y actualizar articulo
    Articulo.findOneAndUpdate(
      { _id: articuloId },
      { imagen: req.file.filename },
      { new: true },
      (error, articuloActualizado) => {
        if (error || !articuloActualizado) {
          return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar",
          });
        }
        //Devolver respuesta
        return res.status(200).json({
          status: "success",
          articulo: articuloActualizado,
          mensaje: "Articulo actualizado exitosamente!",
        });
      }
    );
  }
};

const imagen = (req, res) =>{
  let fichero = req.params.fichero;
  let ruta_fisica = "./images/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) =>{
    if(existe){
      return res.sendFile(path.resolve(ruta_fisica));
    }else{
      return res.status(404).json({
        status: "error",
        mensaje: "la imagen no existe"
      });
    }
  })
}

////////////////////////////////////////////////////////////////////////
// Buscar articulos
const buscar = (req, res) =>{
  //Sacar el string de busqueda
  let busqueda = req.params.busqueda;

  //Find OR
  Articulo.find({ "$or":[
    {"titulo": {"$regex": busqueda, "$options": "i"}},
    {"contenido": {"$regex": busqueda, "$options": "i"}},
  ]})
  .sort({fecha: -1})
  .exec((error, articulosEncontrados) => {
    if(error || !articulosEncontrados || !articulosEncontrados.length <= 0){
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articulosEncontrados
    })

  });

  //Orden

  //Ejecutar consulta
}
module.exports = {
  prueba,
  curso,
  usuario,
  crear,
  listar,
  mostrar,
  eliminar,
  editar,
  subir,
  imagen,
  buscar
};
