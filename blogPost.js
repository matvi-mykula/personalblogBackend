const mongoose = require('mongoose');
const post = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  description: String,
  picture: String,
  video: String,
  link: String,
  timeStamp: Date,
});

module.exports = mongoose.model('Post', post);

// const postData = {
//   id: 1,
//   category: 'Coding',
//   title: 'Heart Rate Monitor',
//   description:
//     'This app allows the user to check there heart rate. The user clicks the heart with each beat of their pulse and then the app will after a set amount of time calculate the BPM',
//   picture: 'na',
//   video: null,
//   link: null,
//   timeStamp: null,
// };
