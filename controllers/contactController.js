const Contact = require('../models/Contact');

exports.crearContacto = async (req, res) => {
  try {
    const nuevo = new Contact(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerContactos = async (req, res) => {
  const { search, sort } = req.query;
  const filtro = {};

  if (search) {
    filtro.$or = [
      { nombre: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const contactos = await Contact.find(filtro).sort(sort === 'desc' ? '-nombre' : 'nombre');
    res.json(contactos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerContactoPorId = async (req, res) => {
  try {
    const contacto = await Contact.findById(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'No encontrado' });
    res.json(contacto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarContacto = async (req, res) => {
  try {
    const actualizado = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarContacto = async (req, res) => {
  try {
    const eliminado = await Contact.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
