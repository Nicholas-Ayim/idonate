const router = require("express").Router()

const verifyDonators = require("../../controllers/verifyDonators/verifyDonators")
router.post("/donor",verifyDonators)

module.exports = verifyDonators