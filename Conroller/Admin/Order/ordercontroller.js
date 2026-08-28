const Order = require("../../../Model/OrderSchema");

//Get all of orders
exports.getallorders = async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "Items.product",
      model: "Product",
    })
    .populate({
      path: "user",
      model: "User",
    });
  res.status(200).json({
    message: "Orders Fetched Successfully",
    data: orders,
  });
};

//get Single Order
exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;

  //check if order exists or not
  const order = await Order.findById(id).populate(
    {
      path: "Items.product",
      model: "Product",
    }).populate("user", "user_Name");
  if (!order) {
    return res.status(200).json({
      message: "No order with that id",
    });
  }

  res.status(200).json({
    message: "Order Fetched SuccessFully",
    data: order,
  });
};

//update Order Status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderstatus } = req.body;

  const validStatuses = [
    "Pending",
    "Delivered",
    "Cancelled",
    "On the Way",
    "Preparing",
  ];

  if (!validStatuses.includes(orderstatus)) {
    return res.status(400).json({
      message: "Invalid order status or status hasn't been provided",
    });
  }

  // Find order and populate products
  const order = await Order.findById(id).populate("Items.product");

  if (!order) {
    return res.status(404).json({
      message: "No order with that id",
    });
  }

  // Don't update if status is already the same
  if (order.Order_Status === orderstatus) {
    return res.status(400).json({
      message: "Order already has this status",
    });
  }

  // ==========================================
  // DELIVERED → DEDUCT STOCK
  // ==========================================

  if (orderstatus === "Delivered") {

    // First check stock for ALL products
    for (const item of order.Items) {

      const product = item.product;

      if (!product) {
        return res.status(400).json({
          message: "A product in this order no longer exists",
        });
      }

      if (product.Product_StockQTY < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.Product_Name}. Available: ${product.Product_StockQTY}, Required: ${item.quantity}`,
        });
      }
    }

    // If all products have enough stock,
    // now deduct the quantities
    for (const item of order.Items) {

      const product = item.product;

      product.Product_StockQTY -= item.quantity;

      await product.save();
    }
  }

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updatedData = await Order.findByIdAndUpdate(
    id,
    {
      Order_Status: orderstatus,
    },
    {
      returnDocument: "after",
    }
  );

  res.status(200).json({
    message: "Order Status Updated Successfully",
    data: updatedData,
  });
};

//delete order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  //check if order exists or not
  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order with that id",
    });
  }
  await Order.findByIdAndDelete(id);
  res.status(200).json({
    message: "Deleted SuccessFully",
    data: null,
  });
};
