const catchAsync = require("../../Services/catchAsync")
const { CreateProduct, deleteproduct, editproduct, updateProductStatus, updateStockAndPrice } = require("../../Conroller/Admin/Product/productcontroller")
const isAuthenticated = require("../../Middleware/isAuthenticated")
const restrictTo = require("../../Middleware/restrictTo")
const Product = require("../../Model/ProductModel")
const {multer, storage } = require("../../Middleware/MulterConfig")
const { getproducts, getproduct } = require("../../Conroller/Global/globalController")
const Upload = multer({storage : storage})
const router = require("express").Router()

router.route("/")
.post(isAuthenticated, restrictTo("Admin"), Upload.single('productImage') , catchAsync(CreateProduct))
.get(catchAsync(getproducts))

router.route("/:id")
.get(catchAsync(getproduct))
.delete( isAuthenticated, restrictTo("Admin"), catchAsync(deleteproduct))
.patch(isAuthenticated, restrictTo("Admin"), Upload.single('productImage') , catchAsync(editproduct))

router.route("/status/:id")
.patch(isAuthenticated, restrictTo("Admin"), catchAsync(updateProductStatus))

router.route("/stockprice/:id")
.patch(isAuthenticated, restrictTo("Admin"), catchAsync(updateStockAndPrice))

module.exports = router
