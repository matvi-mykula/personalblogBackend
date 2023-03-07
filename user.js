const mongoose = require('mongoose');
const user = new mongoose.Schema({
  user: String,
  password: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model('User', user);
