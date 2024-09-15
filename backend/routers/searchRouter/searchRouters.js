const router = require("express").Router()

//searching by name or bloodtype of donor
const SearchDonor = require("../../controllers/searchDonors/searchDonors")
router.get("/findDonors",SearchDonor)


module.exports = router