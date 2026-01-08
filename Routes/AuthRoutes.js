const { test, loginUser, registerUser } = require("../Conroller/Authentication/AuthController")

const router = require("express").Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/").get(test)

module.exports = router