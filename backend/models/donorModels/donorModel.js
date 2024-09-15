const mongoose = require("mongoose");

// Define the Donor schema
const DonorSchema = new mongoose.Schema({
  donorname: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: String,
    required: true,
    trim: true,
  },
  bloodtype: {
    type: String,
    trim: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    default: "no details"
  },
  picture: {
    type: String,
    default: null,  // Set to null if no picture is provided
    trim: true,  // Add trim to prevent leading/trailing spaces
  },
  descriptors: {
    type: [Number],  // Array of arrays of numbers for facial descriptors
  }
}, {
  timestamps: true
});

// Create the Donor model
const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;
