const User = require("../../../Model/UserModel");
const Order = require("../../../Model/OrderSchema");
const Product = require("../../../Model/ProductModel");

class Dashboard {
  async getStats() {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.countDocuments({
      Order_Status: "Delivered",
    });

    const pendingOrders = await Order.countDocuments({
      Order_Status: "Pending",
    });

    const preparingOrders = await Order.countDocuments({
      Order_Status: "Preparing",
    });

    const onTheWayOrders = await Order.countDocuments({
      Order_Status: "On the Way",
    });

    const cancelledOrders = await Order.countDocuments({
      Order_Status: "Cancelled",
    });

    // ================= REVENUE =================

    const revenueResult = await Order.aggregate([
      {
        $match: {
          Order_Status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$Total_Amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;


    // ================= PAYMENT OVERVIEW =================

    const paymentResult = await Order.aggregate([
      {
        $match: {
          Order_Status: "Delivered",
        },
      },
      {
        $group: {
          _id: "$Payment_Details.method",

          revenue: {
            $sum: "$Total_Amount",
          },

          orders: {
            $sum: 1,
          },
        },
      },
    ]);

    let khaltiRevenue = 0;
    let khaltiOrders = 0;

    let codRevenue = 0;
    let codOrders = 0;

    paymentResult.forEach((payment) => {

      if (payment._id === "Khalti") {
        khaltiRevenue = payment.revenue;
        khaltiOrders = payment.orders;
      }

      if (payment._id === "COD") {
        codRevenue = payment.revenue;
        codOrders = payment.orders;
      }

    });


    return {
      totalUsers,
      totalProducts,
      totalOrders,

      deliveredOrders,
      pendingOrders,
      preparingOrders,
      onTheWayOrders,
      cancelledOrders,

      totalRevenue,

      khaltiRevenue,
      khaltiOrders,

      codRevenue,
      codOrders,
    };
  }
}


const dashboard = new Dashboard();


exports.getDashboardStats = async (req, res) => {

  try {

    const stats = await dashboard.getStats();

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      data: stats,
    });

  } catch (error) {

    console.log("DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Something went wrong",
    });

  }

};