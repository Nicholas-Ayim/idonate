const router = require("express").Router()

const HospitalSignup = require("../../controllers/hospitalController/hospitalRegister")
const HospitalLogin = require("../../controllers/hospitalController/hospitalLogin")

router.post("/hospitalSignup",HospitalSignup)
router.post("/hospitalLogin",HospitalLogin)
module.exports = router