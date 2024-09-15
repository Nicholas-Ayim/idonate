const DonorModel = require("../../models/donorModels/donorModel");

// Function to compute Euclidean distance
async function euclideanDistance(face, faceDb) {
    try {
        // Check if face and faceDb are valid
        if (!face || !faceDb) {
            throw new Error("Face or faceDb descriptor is null or undefined.");
        }

        console.log("face length:", face.length);
        console.log("dbface length:", faceDb.length);

        if (face.length !== faceDb.length) {
            throw new Error("Face descriptors do not match in length.");
        }

        let sum = 0;
        for (let i = 0; i < faceDb.length; i++) {
            sum += (face[i] - faceDb[i]) ** 2;
        }

        return Math.sqrt(sum);
    } catch (error) {
        console.error("Error in Euclidean distance calculation:", error.message);
        throw new Error("Error calculating Euclidean distance");
    }
}

const uploadImage = async (req, res) => {
    const { descriptors, donorId, picture } = req.body;

    try {
        // Find donor by ID
        const donor = await DonorModel.findById(donorId);
        if (!donor) {
            return res.status(404).json({ notFoundMessage: "Donor not found." });
        }

        // Find all donors to compare with
        const donors = await DonorModel.find();

        // Check if there are any donors in the database
        if (donors.length === 0) {
            console.log("No donors in the database.");
            donor.picture = picture;
            donor.descriptors = descriptors.flat(); // Ensure descriptors are flattened

            await donor.save();
            return res.status(200).json({ NewDonorMessage: "No other donors found. New face registered.", donor });
        }

        let bestMatch = null;
        let bestDistance = Infinity; // Set a high initial value for comparison

        for (const otherDonor of donors) {
            // Check if the donor has descriptors
            if (!otherDonor.descriptors || otherDonor.descriptors.length === 0) {
                console.log(`Donor ${otherDonor._id} has no descriptors, skipping.`);
                continue; // Skip this donor if no descriptors are found
            }

            // Compare with each donor's descriptors
            const distance = await euclideanDistance(descriptors[0], otherDonor.descriptors);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = otherDonor; // Store the best matching donor
            }
        }

        const threshold = 0.45
        
        console.log("distance",bestDistance)

        if (bestDistance < threshold) {
            // If the best match is below the threshold, return a match
            console.log("Verified!!!");
            console.log("donor registration fails!")
            console.log("Name of detection:", bestMatch.donorname);

            // Remove the current donor if the face is already registered
            await DonorModel.deleteOne({ _id: donorId });

            return res.status(200).json({ verifyMessage: "FAIL!!,Face Verified As Registered", name: bestMatch.donorname });
        } else {
            console.log("Faces do not match");
            // If no match is found, register the new face
            donor.picture = picture;
            donor.descriptors = descriptors.flat(); // Ensure descriptors are flattened

            await donor.save();
            return res.status(200).json({ successMessage: "New face registered", donor });
        }

    } catch (error) {
        console.error("Error during uploadImage process:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = uploadImage;
