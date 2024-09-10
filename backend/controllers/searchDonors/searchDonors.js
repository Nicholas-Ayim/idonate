const Donor = require("../../models/donorModels/donorModel")

const SearchDonor = async (req, res) => {
    try {
        const { name = "", bloodType = "" } = req.query;

        const pipeLine = [
            {
                $project: {
                    name: 1,
                    Dob:1,
                    bloodtype: 1,
                    picture:1
                }
            },
            {
                $match: {
                    name: { $regex: name, $options: "i" },
                    bloodtype: { $regex: blood, $options: "i" }
                }
            }
        ];

        const AllDonors = await Donor.aggregate(pipeLine).exec();

        if (AllDonors.length === 0) {
            return res.status(200).json({ message: "no result found" });
        }
        res.status(200).json({ number: `${AllDonors.length} donors`, Donors: AllDonors });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

module.exports = SearchDonor;
