const faceModel =require("../models/registerDonor/registerDonor")

const saveFaceDescriptor = async (req, res) => {
  const { name, descriptor } = req.body;


  console.log("values",descriptor.flat())

  try {
    // Save the descriptor in the database
    const face = await faceModel.create({ name, descriptor});

    res.status(200).json(face);
  } catch (error) {
    console.error("Error storing face descriptor:", error.message);
    res.status(500).send("Error storing face descriptor");
  }
};

module.exports = saveFaceDescriptor;
