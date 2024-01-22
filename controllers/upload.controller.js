const path = require('path');
const sharp = require('sharp');
const { uploadFile } = require('../services/s3.service');
const Media = require('../models/video.model');
const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');

const runFfmpegPromisified = promisify(ffmpeg);

const handleUpload = async (req, res) => {
  // console.log('req.files :>> ', req.files.media);
  console.log('req.files :>> ', req.files);

  try {
    // Verificamos si hay archivos en la solicitud
    if (!req.files.media || Object.keys(req.files.media).length === 0) {
      return res.status(400).json({ message: 'No se han proporcionado archivos' });
    }

    const media = Array.isArray(req.files.media) ? req.files.media : [req.files.media]

    await Promise.all(
      media?.map(async (file) => {
        try {
          const _file = await processFile(file)
          const url = await uploadFile({...file, data: _file})
          console.log('file: ', _file)
          await new Media({name: file.name, url, description: file.description}).save()
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

async function processFile(file) {
  try {
    if (file.mimetype.startsWith('image/')) {
      const processedBuffer = await sharp(file.data)
        .resize(800, 600, { fit: 'cover' })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      return processedBuffer;
    } else if (file.mimetype.startsWith('video/')) {
      return file.data;
      const tempFilePath = path.join(__dirname, 'temp', 'convert', 'video.mp4');
      require('fs').writeFileSync(tempFilePath, file.data);

      // Extrae el fotograma utilizando fluent-ffmpeg
      const frameOutputPath = path.join(__dirname, 'temp', 'convert', 'frame.png');
      await runFfmpegPromisified()
        .input(tempFilePath)
        .frames(1)  // Extrae solo un fotograma
        .output(frameOutputPath)
        .run();

      // Puedes borrar el archivo temporal si lo deseas
      require('fs').unlinkSync(tempFilePath);

      // Lee el buffer del fotograma
      const frameBuffer = require('fs').readFileSync(frameOutputPath);

      // Puedes borrar el archivo del fotograma si lo deseas
      require('fs').unlinkSync(frameOutputPath);
      console.log('frameBuffer :>> ', frameBuffer);
      return frameBuffer;
    }
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Error processing file');
  }
}

module.exports = { handleUpload };