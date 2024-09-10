const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
    name: String,
    descriptor: [Number], // Array of strings for face descriptor
  });
  
  const faceModel = mongoose.model("facemodel",faceSchema)
  module.exports = faceModel