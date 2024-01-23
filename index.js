require('dotenv').config()
const express = require('express');
const uploadRoutes = require('./routes/upload.routes');
const authRoutes = require('./routes/auth.routes');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
require('./services/db.services')

app.use(fileUpload());

app.use('/api/auth', authRoutes)
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
