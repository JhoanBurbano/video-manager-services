const { v4: uuidv4 } = require('uuid');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs/promises'); // Utilizamos fs.promises para operaciones asíncronas
const { uploadFile } = require('../services/s3.service');
const Media = require('../models/video.model');

const handleUpload = async (req, res) => {
  // console.log('req.files :>> ', req.files.media);
  console.log('req.files :>> ', req.files);

  try {
    // Verificamos si hay archivos en la solicitud
    if (!req.files.media || Object.keys(req.files.media).length === 0) {
      return res.status(400).json({ message: 'No se han proporcionado archivos' });
    }

    // const processedFiles = await processFiles(req.files.media);

    // Puedes realizar cualquier procesamiento adicional con los archivos subidos
    // Por ejemplo, guardar información sobre los archivos en una base de datos

    const media = Array.isArray(req.files.media) ? req.files.media : [req.files.media]

    // const _media = new Media({});

    await Promise.all(
      media?.map(async (file) => {
        try {
          const url = await uploadFile(file)
          await new Media({name: file.altName, url, description: file.description}).save()
        } catch (error) {
          console.error(error)
          return  res.status(500).json({ message: 'Error al procesar la subida de archivos' });
        }
      })
    )

    res.status(200).json({ message: 'Archivos subidos con éxito', processedFiles: req.files.media.length, media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la subida de archivos' });
  }
};

async function processFiles(files) {
  console.log('files :>> ', files);
  const processedFiles = [];

  await Promise.all(
    Object.values(files).map(async (file) => {
      console.log('Longitud del búfer:', file.data.length);
      const uniqueSuffix = uuidv4();
      const filename = `${file.name}-${uniqueSuffix}${path.extname(file.name)}`;
      const filePath = path.join(__dirname, 'uploads', filename);

      if (file.mimetype.startsWith('image/')) {
        // Procesar y optimizar la imagen usando Sharp
        const processedBuffer = await sharp(file.data).resize(800, 600).toBuffer();
        await fs.writeFile(filePath, processedBuffer);
        processedFiles.push({ filename, mimetype: file.mimetype });
      } else if (file.mimetype.startsWith('video/')) {
        // Comprimir y convertir videos usando fluent-ffmpeg-promises
        const videoOutputPath = path.join(__dirname, 'uploads', `${uniqueSuffix}.mp4`);
        await ffmpeg()
          .input(file.data)
          .videoCodec('libx264')
          .audioCodec('aac')
          .output(videoOutputPath)
          .run();
        processedFiles.push({ filename: `${uniqueSuffix}.mp4`, mimetype: 'video/mp4' });
      }
    })
  );

  return processedFiles;
}


module.exports = { handleUpload };