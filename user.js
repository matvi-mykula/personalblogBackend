import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const user = new Schema({
  user: String,
  password: String,
  isAdmin: Boolean,
});
const User = model('User', user);

export { User };
