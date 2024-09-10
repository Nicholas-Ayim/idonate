const HospitalModel = require("../../models/hospitalModels/hospitalModel")

const bcrypt = require("bcrypt");

const HospitalSignup = async(req,res)=>{
  try {
    const { HospitalName, address, HospitalContact, HospitalEmail, region, location, PostalCode, password,registeredNumber } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Validation error", message: "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character." });
    }
      //random seven numbers as registration Number
        let HospitalNumber
        const max = 9999999
        const min = 1000000
        HospitalNumber = Math.floor(Math.random() * (max - min + 1) ) + min
      
      const HospitalIdentity = `GHA#${HospitalNumber}`
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create a new donor with the hashed password
    const newHospital = new HospitalModel({
      HospitalName,
      registeredNumber:HospitalIdentity,
      address,
      PostalCode,
      HospitalContact,
      HospitalEmail,
      region,
      location,
      password: hashedPassword
    });


    // Save the donor to the database
    await newHospital.save()
    

    // Remove the password from the response
    const hospitalResponse = newHospital.toObject();
    delete hospitalResponse.password;

    return res.status(201).json({message:"hospital signup successfully",hospitalResponse});
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ error: "Validation error", message: err.message });
    } 
    else if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
      // Duplicate key error (email already exists)
      return res.status(400).json({ error: "Email already exists", message: "The provided email is already registered." });
    } 
    else {
      // Handle other errors
      console.error("Error creating donor:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = HospitalSignup;