const mongoose = require('mongoose');

const musicSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  //dateCreation: { type: Date, required: true },
  cover: { type: String, required: true },
  userId: { type: String, required: true },
  artist: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, required: false },
  favorited: { type: Boolean, required: true },
  numberLikes: { type: Number, required: true },
  numberStreams: { type: Number, required: true },
  
});

module.exports = mongoose.model('Music', musicSchema);