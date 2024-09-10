const Donor = require("../../models/donorModels/donorModel");

async function euclideanDistance(face, dbFace) {
  try {
    // Check if the two arrays' lengths are equal
    if (face.length !== dbFace.length) {
      const message = "Face recognition does not match";
      return message;
    }

    // Initialize sum and loop through the two arrays to calculate the distance
    let sum = 0;
    for (let i = 0; i < face.length; i++) {
      sum += (dbFace[i] - face[i]) ** 2;
    }
    sum = Math.sqrt(sum);

    return sum;
  } catch (error) {
    const message = "Failed while looking for face";
    return message;
  }
}

const DonorSignupdb = async (req, res) => {
  try {
    const { name, Dob, picture, bloodtype, descriptors } = req.body;

    // Check if the user's picture already exists by fetching all donors
    const userFound = await Donor.find();

    // Perform Euclidean distance to track registered donors
    for (let donor of userFound) {
      const distance = await euclideanDistance(descriptors, donor.descriptors);

      // If distance is close enough (e.g. < 0.6), assume the face is already registered
      if (distance && distance < 0.6) {
        return res.status(400).json({ message: "Face already registered" });
      }
    }

    // Create new donor if no face matches
    const newDonor = await Donor.create({
      name,
      Dob,
      picture,
      bloodtype,
      descriptors,
    });

    return res.status(201).json({
      message: "New face registered",
      newDonor,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ error: "Validation error", message: err.message });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
      // Duplicate key error (email already exists)
      return res.status(400).json({ error: "Email already exists", message: "The provided email is already registered." });
    } else {
      // Handle other errors
      console.error("Error creating donor:", err);
      return res.status(500).json({ error: "Internal server error", message: "Network delay or internal issue." });
    }
  }
};

module.exports = DonorSignupdb;
