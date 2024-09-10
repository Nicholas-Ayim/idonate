const router = require("express").Router()

//searching by name or bloodtype of donor
const SearchDonor = require("../../routers/searchRouter/searchRouters")
router.get("/findDonors",SearchDonor)


module.exports = router