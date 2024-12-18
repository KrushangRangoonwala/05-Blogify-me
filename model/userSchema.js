const mongoose = require("mongoose");
const { createHmac  ,randomBytes } = require("crypto");
const { generateToken } = require("../service/jwtAuthentication");
const { response } = require("express");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    userProfile: {
      type: String,
      default: "images/Profile-PNG-Photo.png",
    },
  },
  { timestamps: true }
);

//pre-save hook
userSchema.pre("save", function(next){
    if (!this.isModified('password')) return next();
    const salt = randomBytes(16).toString();
    const hasedPassword = createHmac('sha256', salt)
               .update(this.password)
               .digest('hex');
    this.salt=salt;
    this.password=hasedPassword;
    console.log(this);
    next();
});

// "matchPasswordAndreturnToken" is a function which runs on User model
userSchema.static("matchPasswordAndreturnToken", async function(email,password) {
  const user = await User.findOne({ email });
  if(!user) throw new Error ("User not found");
  const newHasedPassword = createHmac('sha256', user.salt)
               .update(password)
               .digest('hex');
  if(newHasedPassword !== user.password) throw new Error ("Email or password is incorrect");
  const token = generateToken(user);
  return token;
});

// Compile the model AFTER defining the pre-save hook
const User = mongoose.model("user", userSchema); 

module.exports = User;
