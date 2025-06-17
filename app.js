const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const contactsRoutes = require('./routes/contacts');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
mongoose.connect('mongodb://localhost:27017/agenda')
  .then(() => {})
  .catch(() => {}); 
app.use('/api/contactos', contactsRoutes);
app.listen(3000);
