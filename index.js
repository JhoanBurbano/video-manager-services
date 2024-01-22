require('dotenv').config()
const express = require('express');
const uploadRoutes = require('./routes/upload.routes');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())

require('./services/db.services')

app.use(fileUpload());

app.use('/api', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
