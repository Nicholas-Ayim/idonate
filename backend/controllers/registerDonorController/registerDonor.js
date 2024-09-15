const Donor = require("../../models/donorModels/donorModel");
require("dotenv").config();



const DonorSignupdb = async (req, res) => {
  const { donorname, dob, bloodtype} = req.body

  try {
   
    console.log("body",donorname,dob,bloodtype)
    //save into our database
    const dbResponse = await Donor.create({
      donorname,
      dob,
      bloodtype,
      // descriptors,
      // picture

    })

    return res.status(200).json({message:"successfully registered donator",data:dbResponse})

  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: err.message });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }
};

module.exports = DonorSignupdb;
