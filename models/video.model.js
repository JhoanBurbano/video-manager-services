const mongoose = require('mongoose');


const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: {type: String, required: true},
  url: { type: String},
  description: {type: String},
  type: { type: String, required: true},
  size: { type: Number },
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});


const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
