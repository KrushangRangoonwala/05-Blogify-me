const { Router } = require("express");
const routeInstance = Router();

const User = require("../model/userSchema");

routeInstance.get("/logout", (req,res) => {
  res.clearCookie("token").redirect("/");
});

routeInstance
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    try{
      const token = await User.matchPasswordAndreturnToken(email, password);
      console.log(token);
      return res.cookie("token",token).redirect("/");
    }catch{
      return res.render("signin",{
        error : true
      });
    }
  });

routeInstance
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(async (req, res) => {
    console.log(req.body);
    // const newUser = new User(req.body);
    // const savedUser = await newUser.save();
    // return res.status(201).json(savedUser);
    const { fullName, email, password } = req.body;
    await User.create({ fullName, email, password });
    return res.redirect("/signin");
  });

module.exports = routeInstance;