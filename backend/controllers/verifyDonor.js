const faceModel = require("../models/registerDonor/registerDonor")

// Euclidean Distance function with threshold check
async function euclideanDistance(currentFace, dbFace) {
  if (currentFace.length !== dbFace.length) {
    console.log("No faces match in terms of dimension");
    return Infinity;  // Return a high value to indicate mismatch
  } else {
    let sum = 0;
    // Perform the Euclidean distance calculation
    for (let i = 0; i < currentFace.length; i++) {
      sum += (currentFace[i] - dbFace[i]) ** 2;  // Accumulate the square of differences
    }
    // Return the square root of the sum to get the Euclidean distance
    const distance = Math.sqrt(sum);
    console.log("Distance:", distance);
    return distance; // Return the distance value
  }
}

const verifyFace = async (req, res) => {
  try {
    const { descriptor } = req.body;
    const faceModelFound = await faceModel.find(); // Retrieve all face descriptors from the DB

    let bestMatch = null;
    let bestDistance = Infinity; // Set a high initial value for comparison

    // Use a for...of loop to ensure async logic works correctly
    for (const data of faceModelFound) {
      const distance = await euclideanDistance(descriptor, data.descriptor);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = data; // Store the best match so far
      }
    }

    const threshold = 0.6;

    if (bestDistance < threshold) {
      console.log("Verified!!!");
      console.log("Name of detection:", bestMatch.name);
      return res.status(200).json({ message: "Face verified", name: bestMatch.name });
    } else {
      console.log("Faces do not match");
      return res.status(400).json({ message: "Face does not match" });
    }

  } catch (error) {
    console.log("Verification failed:", error.message);
    return res.status(500).json({ failure: "Internal error", message: error.message });
  }
};

module.exports = verifyFace;
