const express = require('express');
const multer = require('multer');
const ArticuloControlador = require('../controllers/articulo');

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null, './images/articulos');
    },

    filename: (req, file, cb) =>{
        cb(null, 'articulo' + Date.now() + file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});


// Rutas de pruebas
router.get('/ruta-de-prueba', ArticuloControlador.prueba)
router.get('/curso', ArticuloControlador.curso)
router.get('/usuario', ArticuloControlador.usuario)

// Rutas de Articulos
router.get('/articulos', ArticuloControlador.listar)
router.post('/articulo', ArticuloControlador.crear)
router.get('/articulo/:id', ArticuloControlador.mostrar)
router.delete('/articulo/:id', ArticuloControlador.eliminar)
router.put('/articulo/:id', ArticuloControlador.editar)

router.post('/imagen/:id', [subidas.single('file0')] , ArticuloControlador.subir)
router.get('/imagen/:fichero', ArticuloControlador.imagen)

router.get('/buscar/:busqueda', ArticuloControlador.buscar)


module.exports = router;