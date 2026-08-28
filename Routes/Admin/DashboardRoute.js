const { getDashboardStats } = require("../../Conroller/Admin/Dashboard/dashboardController");
const isAuthenticated = require("../../Middleware/isAuthenticated")
const restrictTo = require("../../Middleware/restrictTo")
const catchAsync = require("../../Services/catchAsync")

const router = require("express").Router();


router.route("/")
.get(isAuthenticated, restrictTo("Admin"), catchAsync(getDashboardStats));

module.exports = router;