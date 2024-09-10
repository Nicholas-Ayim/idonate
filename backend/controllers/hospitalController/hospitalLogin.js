const HospitalModel = require("../../models/hospitalModels/hospitalModel");

const bcrypt = require("bcrypt");

const HospitalLogin = async (req, res) => {
  try {
    const { HospitalEmail,password } = req.body;

    //look for email
    const foundHospital = await HospitalModel.findOne({HospitalEmail})

    if(!foundHospital){
        return res.status(400).json({message:"account does not exist!!"})
    }

    //compare password with the one in db based on the email found
    const comparePassword = await bcrypt.compare(password,foundHospital.password)
    
    // Create a new donor with the hashed password
    if(!comparePassword){
        return res.status(200).json({message:"password does not match"})
    }

    // Remove the password from the response
    const hospitalResponse = foundHospital.toObject();
    delete hospitalResponse.password;

    res.status(201).json(hospitalResponse);
  } catch (err) {
    console.error("Error creating donor:", err);
    res.status(500).json({ error: "Internal server error", message:err.message });
  }
};

module.exports = HospitalLogin;