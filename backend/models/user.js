const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('User', schema);
