const express = require('express');
const { handleUpload } = require('../controllers/upload.controller');
const { getMedia } = require('../services/media.services');

const router = express.Router();

router.get('/media', async (req, res, next) => {
  try {
    res.status(200).json({data: await getMedia()})
  } catch (error) {
    res.status(500).json({message: "Hubo un error al traer la data"})
  }
})

router.post('/upload', handleUpload, (req, res) => {
  try {
    // Aquí puedes realizar cualquier procesamiento adicional con los archivos subidos
    // Por ejemplo, puedes guardar información sobre los videos en una base de datos

    return res.status(200).json({ message: 'Archivos subidos con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al procesar la subida de archivos' });
  }
});

module.exports = router;
