const mongoose = require("mongoose");
const { isEmail } = require("validator");

// Define the Donor schema
const contactsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });
const HospitalSchema = new mongoose.Schema({
registeredNumber:{
        type:String,
        required:true
    },
  HospitalName: {
    type: String,
    required: true,
    unique:true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  PostalCode:{
    type:String,
    required:true,
    validate:{
        validator: (input)=>{
                    return /^(GA|AK|BS|BT|AH|WB|OD|NE|SD|UE|UW|EN|VT|NT|WS|TT|ER|CE)-\d{4}-\d{4}$/.test(input);
        },
        message:msg=>"Please enter a valid POSTAL CODE to proceed registration"
    }
  },
  
  HospitalContact: {
    type: [contactsSchema],
    //type:String,
    required: true
  },
  HospitalEmail: {
    type: String,
    required: true,
    validate: [isEmail, 'Invalid email'],
    trim: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  region: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Ahafo',
      'Ashanti',
      'Bono',
      'Bono East',
      'Central',
      'Eastern',
      'Greater Accra',
      'Northern',
      'North East',
      'Oti',
      'Savannah',
      'Upper East',
      'Upper West',
      'Volta',
      'Western',
      'Western North'
    ]
  },
  location:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (input) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(input);
      },
      message: props => 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.'
    }
  }
}, {
  timestamps: true
});

// Create the Donor model
const HospitalModel = mongoose.model('HOSPITAL-MODEL', HospitalSchema);

module.exports = HospitalModel;