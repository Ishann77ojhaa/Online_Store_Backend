const { test, loginUser, registerUser, forgotpassword, VerifyOTP } = require("../Conroller/Authentication/AuthController")

const router = require("express").Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgotpassword").post(forgotpassword)
router.route("/verifyotp").post(VerifyOTP)
router.route("/").get(test)

module.exports = router
