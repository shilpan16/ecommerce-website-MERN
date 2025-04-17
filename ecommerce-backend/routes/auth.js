const router = require('express').Router();
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


// REGISTER
// auth.js - REGISTER
// router.post('/register', async (req, res) => {
//     try {
//       // Ensure the body has the expected fields
//       if (!req.body.username || !req.body.email || !req.body.password) {
//         return res.status(400).json("Missing required fields");
//       }
  
//       const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: CryptoJS.AES.encrypt(req.body.password, process.env.JWT_SECRET).toString(),
//       });
  
//       const savedUser = await newUser.save();
//       res.status(201).json(savedUser);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

router.post('/register', async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Log the incoming request body

    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.JWT_SECRET).toString(),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Success
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // Use email instead of username
    if (!user) return res.status(401).json('Wrong email');

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.JWT_SECRET);
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) return res.status(401).json('Wrong password');

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// LOGIN
// router.post('/login', async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (!user) return res.status(401).json('Wrong username');

//     const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.JWT_SECRET);
//     const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

//     if (originalPassword !== req.body.password) return res.status(401).json('Wrong password');

//     const accessToken = jwt.sign(
//       { id: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '3d' }
//     );

//     const { password, ...others } = user._doc;
//     res.status(200).json({ ...others, accessToken });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });




module.exports = router;