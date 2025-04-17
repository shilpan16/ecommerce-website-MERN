const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/product');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const path = require('path');

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Store images in public/images folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file names
  }
});

const upload = multer({ storage }); // Create multer upload instance

// Create product (admin only) - with image upload
router.post("/", verifyTokenAndAdmin, upload.single('img'), async (req, res) => {
  const newProduct = new Product({
    title: req.body.title,
    desc: req.body.desc,
    img: '/images/' + req.file.filename,  // Save relative path for frontend
    categories: req.body.categories,
    price: req.body.price,
    inStock: req.body.inStock
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update product (admin only)
router.put("/:id", verifyTokenAndAdmin, upload.single('img'), async (req, res) => {
  const updateData = {
    ...req.body,
  };

  if (req.file) {
    updateData.img = '/images/' + req.file.filename;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete product (admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product (public)
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
