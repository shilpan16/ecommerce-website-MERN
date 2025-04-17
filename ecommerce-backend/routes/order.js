const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

// Get orders for a user
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all orders (admin only)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update order status (admin)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Example: { status: "shipped" }
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete an order (admin)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Assuming this is in your orders.js route file
// GET order history with pagination
router.get("/history", verifyToken, async (req, res) => {
    const userId = req.user.id; // Get the user ID from the token
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 orders per page
    const skip = (page - 1) * limit; // Calculate the number of orders to skip
    
    try {
      // Get the orders for the user with pagination
      const orders = await Order.find({ userId })
        .skip(skip) // Skip the appropriate number of orders based on the page
        .limit(limit); // Limit the number of orders returned
      
      // Get the total count of orders for the user
      const totalOrders = await Order.countDocuments({ userId });
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalOrders / limit);
  
      res.status(200).json({
        orders,
        totalOrders,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
