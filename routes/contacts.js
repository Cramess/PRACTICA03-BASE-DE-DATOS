const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const mongoose = require('mongoose');
function esEmailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      filter = {
        $or: [
          { nombre: regex },
          { email: regex }
        ]
      };
    }
    const contactos = await Contact.find(filter).sort({ nombre: 1 });
    res.json(contactos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los contactos' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const contacto = await Contact.findById(req.params.id);
    if (!contacto) return res.status(404).json({ message: 'No encontrado' });
    res.json(contacto);
  } catch (err) {
    res.status(500).json({ message: 'ID inválido' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, email, direccion, fechaNacimiento } = req.body;
    if (!nombre || !telefono) {
      return res.status(400).json({ message:'son obligatorios'});
    }
    const existeTelefono = await Contact.findOne({ telefono });
    if (existeTelefono) {
      return res.status(400).json({ message:'Teléfono ya registrado'});
    }
    if (email) {
      if (!esEmailValido(email)) {
        return res.status(400).json({ message:'Formato inválido'});
      }
      const existeEmail = await Contact.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({ message: 'Email ya registrado' });
      }
    }
    const nuevoContacto = new Contact({ nombre, telefono, email, direccion, fechaNacimiento });
    await nuevoContacto.save();
    res.status(201).json(nuevoContacto);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { nombre, telefono, email, direccion, fechaNacimiento } = req.body;
    const contacto = await Contact.findById(req.params.id);
    if (!contacto) return res.status(404).json({ message: 'No encontrado' });
    if (telefono && telefono !== contacto.telefono) {
      const existeTelefono = await Contact.findOne({ telefono });
      if (existeTelefono) {
        return res.status(400).json({ message: 'Teléfono ya en uso' });
      }
    }
    if (email && email !== contacto.email) {
      if (!esEmailValido(email)) {
        return res.status(400).json({ message: 'Email inválido' });
      }
      const existeEmail = await Contact.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({ message: 'Email ya en uso' });
      }
    }
    contacto.nombre = nombre || contacto.nombre;
    contacto.telefono = telefono || contacto.telefono;
    contacto.email = email || contacto.email;
    contacto.direccion = direccion || contacto.direccion;
    contacto.fechaNacimiento = fechaNacimiento || contacto.fechaNacimiento;
    await contacto.save();
    res.json(contacto);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Contact.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Contacto no encontrado' });
    res.json({ message: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
});
module.exports = router;
