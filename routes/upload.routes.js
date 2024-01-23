const express = require('express');
const { handleUpload } = require('../controllers/upload.controller');
const { getMedia, deleteMedia } = require('../services/media.services');
const { addMedia } = require('../services/user.services');
const { getId } = require('../services/token.service');

const router = express.Router();

router.get('/media', async (req, res, next) => {
  try {
    res.status(200).json({data: await getMedia()})
  } catch (error) {
    res.status(500).json({message: "Hubo un error al traer la data"})
  }
})

router.delete("/media/:id", async (req, res) => {
  try {
    await deleteMedia(req.params?.id)
    res.json({message: "Se ha eliminado exitosamente el archivo"})
  } catch (error) {
    res.status(500).json({message: "Hubo un error al eliminar la data"})
  }
})

router.post('/upload', handleUpload, async (req, res) => {
  console.log(req.body)

  try {
    await addMedia(getId(req.headers), req.body.mediaIds)
    return res.status(200).json({ message: 'Archivos subidos con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al procesar la subida de archivos' });
  }
});

module.exports = router;
