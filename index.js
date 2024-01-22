const express = require('express');
const uploadRoutes = require('./routes/upload.routes');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(cors())

require('./services/db.services')

// Configuración para servir archivos estáticos
app.use(fileUpload());

// Configuración de rutas
app.use('/api', uploadRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
