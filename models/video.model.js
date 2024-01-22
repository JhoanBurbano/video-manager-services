const mongoose = require('mongoose');


const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: {type: String, required: true},
  url: { type: String},
  description: {type: String},
  type: { type: String, required: true},
  size: { type: Number }
});


const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
