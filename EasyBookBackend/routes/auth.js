const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
//Register
router.post("/register", async (req,res) =>{
    try{
        const user = await User.create(req.body);
        res.json({ message: "User registered successfully" });

    }catch(err){
        res.status(400).json({ error: err.message});
    }
});
//Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
  
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) return res.status(401).send("Invalid password");
  
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  
    res.json({ token });
  });
  
  module.exports = router;