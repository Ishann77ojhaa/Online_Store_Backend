
const { CreateProduct } = require("../Conroller/Admin/Product/productcontroller")
const isAuthenticated = require("../Middleware/isAuthenticated")
const Product = require("../Model/ProductModel")

const router = require("express").Router()

router.route("/createproduct").post(isAuthenticated, CreateProduct)

module.exports = router