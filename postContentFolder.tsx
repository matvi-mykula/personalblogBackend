// const mongoose = require('mongoose');
// const contentFolder = new mongoose.Schema({
//   id: String,
//   pictures: [{ filePath: { type: String, required: true } }],
//   videos: [{ filePath: { type: String, required: true } }],
//   link: [{ filePath: { type: String, required: true } }],
// });

const mongoose = require('mongoose');
const contentFolder = new mongoose.Schema({
  id: String,
  pictures: { type: Array, of: String },
  videos: { type: Array, of: String },
  links: { type: Array, of: String },
});
module.exports = mongoose.model('ContentFolder', contentFolder);
