const mongoose = require('mongoose');
const pictureFolder = new mongoose.Schema({
  id: String,
  entries: [{ filePath: { type: String, required: true } }],
});

module.exports = mongoose.model('PictureFolder', pictureFolder);
