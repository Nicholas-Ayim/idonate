const router = require("express").Router()

const PaginatedDonors = require("../../controllers/paginate/paginate")

router.get("/donors", PaginatedDonors)
module.exports = router