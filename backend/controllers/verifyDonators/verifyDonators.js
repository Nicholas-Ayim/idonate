const DonorModel = require("../../models/donorModels/donorModel");

async function euclideanDistance(uploadFace, dbFace) {
    try {
        // Check if the two lengths match
        if (uploadFace.length !== dbFace.length) {
            console.log("Face data lengths do not match.");
            return;
        }
        let sum = 0;
        for (let i = 0; i < uploadFace.length; i++) {
            // Calculate the Euclidean distance
            sum += (uploadFace[i] - dbFace[i]) ** 2;
        }

        return Math.sqrt(sum);  // Return the Euclidean distance
    } catch (error) {
        console.error("Error in euclideanDistance:", error);
        throw error;  // Rethrow the error for higher-level handling
    }
}

const verifyDonors = async (req, res) => {
    try {
        const { descriptors } = req.body;
        console.log("Descriptors received:", descriptors);

        const Donors = await DonorModel.find();
        console.log("Fetched Donors:", Donors);

        let bestMatch = null;
        let bestDistance = Infinity;

        for (let donor of Donors) {
            console.log("Evaluating donor:", donor);

            if (!donor.descriptors || donor.descriptors.length === 0) {
                console.log(`Donor ${donor._id} has no descriptors, skipping.`);
                continue;  // Skip donors without descriptors
            }

            const distance = await euclideanDistance(descriptors[0], donor.descriptors);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = donor;  // Store the best matching donor
            }
        }

        const threshold = 0.45;  // Adjust this threshold as per your data
        if (bestDistance < threshold) {
            console.log("Verified donor:", bestMatch.donorname);
            return res.status(200).json({ message: "Verification successful", bestMatch });
        } else {
            console.log("Verification failed.");
            return res.status(404).json({ message: "Verification failed, try again!" });
        }

    } catch (error) {
        console.error("Error in verifyDonors:", error);
        return res.status(500).json({ message: error.message });
    }
} 

module.exports = verifyDonors;
