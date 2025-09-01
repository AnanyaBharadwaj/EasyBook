const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: String,
    email: {type:String, unique: true},
    password: String,
});

userSchema.pre("save",function (next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

module.exports = mongoose.model("User", userSchema);