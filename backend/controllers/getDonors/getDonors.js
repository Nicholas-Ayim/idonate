const DonorModels = require("../../models/donorModels/donorModel");

const GetDonors = async (req, res) => {
  try {
    //migrateAssignedField()
    const registeredDonors = await DonorModels.find();

    res.status(200).json({ message: "All donors", Donors: registeredDonors });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = GetDonors
