const DonorModels = require("../../models/donorModels/donorModel");

const PaginateDonors = async (req, res) => {
  try {
    // Extract page and limit from query parameters and provide default values if not present
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the starting index of the results for the given page
    const startIndex = (page - 1) * limit;

    // Get the total number of documents in the collection
    const totalDataLength = await DonorModels.countDocuments();

    // Calculate the total number of pages based on the total documents and the limit
    const totalPages = Math.ceil(totalDataLength / limit);

    // Fetch the documents for the current page
    const HospitalData = await DonorModels.find()
      .limit(limit)
      .skip(startIndex);

    // Respond with the paginated data
    res.status(200).json({
      pagination: {
        pageNumber: page,
        startAt: startIndex,
        totalPages: totalPages,
        totalData: totalDataLength,
      },
      DonorData,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = PaginateDonors;
