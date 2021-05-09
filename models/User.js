const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 8
  },
  favoriteGenre: String,
})
  .plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);