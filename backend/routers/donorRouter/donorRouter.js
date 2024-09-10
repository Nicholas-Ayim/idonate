const router = require("express").Router()

//###########################

const DonorSignupdb = require("../../controllers/registerDonorController/registerDonor")

//registering donors 
router.post("/donorRegister",DonorSignupdb)

const GetDonors = require("../../controllers/getDonors/getDonors")

//getting all  donors 
router.get("/all/donors",GetDonors)

module.exports = router