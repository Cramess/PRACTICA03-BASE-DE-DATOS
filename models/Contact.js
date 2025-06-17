const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true, unique: true },
  email: {type: String,unique: true,sparse: true,validate: 
    {
      validator: function (value) {
        return value ? validator.isEmail(value) : true;
      },
      message: 'Email no válido'
    }
  },
  direccion: { type: String },
  fechaNacimiento: { type: Date }
});

module.exports = mongoose.model('Contact', ContactSchema);
