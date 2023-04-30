const {Schema, model, trusted} = require('mongoose');

const ArticuloSchema = Schema({
    titulo:{
        type: String,
        required: trusted
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: 'default.png'
    }
});

module.exports = model('Articulo', ArticuloSchema, 'articulos')