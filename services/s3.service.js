require('dotenv').config()
const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
  } = require('@aws-sdk/client-s3');
  

  const { AWS_BUCKET, AWS_BUCKET_REGION, AWS_PUBLIC_ACCESS_KEY, AWS_SECRET_KEYS} = process.env
  const QR_PATH = 'projects/VIDEOMANAGER/media/'; // Reemplaza 'tu_qr_path' con tu ruta de QR
  
  const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: AWS_PUBLIC_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEYS,
    },
  });
  
  async function uploadFile(file) {
    console.log('file.body :>> ', file.data);
    const uploadParams = {
      Bucket: AWS_BUCKET,
      Key: `${QR_PATH}${file.name}`,
      Body: file.data,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
      ACL: 'public-read',
    };
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    return getAWSPath(file.name);
  }
  
  async function deleteFile(filename) {
    const path = `${QR_PATH}${filename}`;
    console.log('path', path);
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET,
      Key: path,
    });
    await client.send(command);
  }
  
  function getAWSPath(name) {
    return `https://${AWS_BUCKET}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${QR_PATH}${name}`;
  }
  
  module.exports = {
    uploadFile,
    deleteFile,
    getAWSPath,
  };
  