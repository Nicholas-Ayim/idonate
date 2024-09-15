const router = require("express").Router()

// const upload = require("../../multer/multer")

//###########################

const DonorSignupdb = require("../../controllers/registerDonorController/registerDonor")

//registering donors 
router.post("/donorRegister",DonorSignupdb)

//saving image into models
const uploadImage = require("../../controllers/registerDonorController/imageUpload")
router.put("/donorRegister/image",uploadImage)


const GetDonors = require("../../controllers/getDonors/getDonors")


//getting all  donors  
router.get("/all/donors",GetDonors)

module.exports = router