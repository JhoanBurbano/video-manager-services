const path = require('path');
const sharp = require('sharp');
const { uploadFile } = require('../services/s3.service');
const Media = require('../models/video.model');
const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');

const runFfmpegPromisified = promisify(ffmpeg);

const handleUpload = async (req, res, next) => {

  const altData = JSON.parse(req.body.data)
  const mediaIds = []

  try {
    if (!req.files.media || Object.keys(req.files.media).length === 0) {
      return res.status(400).json({ message: 'No se han proporcionado archivos' });
    }

    const media = Array.isArray(req.files.media) ? req.files.media : [req.files.media]

    await Promise.all(
      media?.map(async (file, index) => {
        try {
          const _file = await processFile(file)
          const url = await uploadFile({...file, data: _file })
          const newMedia = await new Media({name:  altData.at(index).altName, url, description: altData.at(index).description, size: file.size, type: file.mimetype.startsWith('image/') ? 'image' : 'video', filename: file.name}).save()
          mediaIds.push(newMedia._id)
        } catch (error) {
          console.error(error)
          return  res.status(500).json({ message: 'Error al procesar la subida de archivos' });
        }
      })
    )
    req.body.mediaIds = mediaIds
      return next()
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

      const frameOutputPath = path.join(__dirname, 'temp', 'convert', 'frame.png');
      await runFfmpegPromisified()
        .input(tempFilePath)
        .frames(1)  
        .output(frameOutputPath)
        .run();

      require('fs').unlinkSync(tempFilePath);

      const frameBuffer = require('fs').readFileSync(frameOutputPath);

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