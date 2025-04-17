const router = require("express").Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

const MAX_CART_ITEMS = 10;

// ✅ Create a new cart (with item limit)
router.post("/", verifyToken, async (req, res) => {
  const { products } = req.body;

  if (products.length > MAX_CART_ITEMS) {
    return res.status(400).json(`You can only add up to ${MAX_CART_ITEMS} products to the cart.`);
  }

  const newCart = new Cart({
    userId: req.user.id,
    products,
  });

  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Update cart (with item limit check)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const { products } = req.body;

  if (products.length > MAX_CART_ITEMS) {
    return res.status(400).json(`You can only add up to ${MAX_CART_ITEMS} products to the cart.`);
  }

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Delete a cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(200).json("Cart has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get a user's cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get all carts (admin only)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/checkout", verifyToken, async (req, res) => {
    try {
      const userCart = await Cart.findOne({ userId: req.user.id });
  
      if (!userCart) {
        return res.status(404).json("Cart not found.");
      }
  
      // Calculate total price
      let totalPrice = 0;
      for (const product of userCart.products) {
        const productDetails = await Product.findById(product.productId);
        if (!productDetails) {
          return res.status(404).json(`Product not found: ${product.productId}`);
        }
        totalPrice += productDetails.price * product.quantity;
      }
  
      // Create an order
      const newOrder = new Order({
        userId: req.user.id,
        products: userCart.products,
        totalPrice,
        status: "pending",
      });
  
      const savedOrder = await newOrder.save();
  
      // Optionally clear the cart after checkout
      await Cart.findOneAndDelete({ userId: req.user.id });
  
      res.status(200).json({ order: savedOrder, message: "Checkout successful!" });
    } catch (err) {
      console.error("Checkout Error:", err);
      res.status(500).json("Internal Server Error");
    }
  });

  
 // Get user's order history
router.get("/history", verifyToken, async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.id });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.put("/:id/status", verifyTokenAndAdmin, async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status }, // e.g., { status: "shipped" }
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  

module.exports = router;