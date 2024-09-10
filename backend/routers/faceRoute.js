const registerDonor = require("../controllers/registerDonor")
const verifyDonor = require("../controllers/verifyDonor")

const router = require("express").Router()

//check router 
router.post("/api/store-face",registerDonor)
router.post("/api/verify-face",verifyDonor)

module.exports = router