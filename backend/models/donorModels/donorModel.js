const mongoose = require("mongoose");

// Define the Donor schema
const DonorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  Dob: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  bloodtype: {
    type: String,
    required: true,
    trim: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  picture:{
    type:String,
    required:true,
    trim:true
  },
  descriptors:[Number]
 
}, {
  timestamps: true
});

// Create the Donor model
const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;
