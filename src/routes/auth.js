const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const authRouter = express.Router();

authRouter.use(express.json());
authRouter.use(cookieParser());

authRouter.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body; 

    validateSignUpData(req.body);

    // encrypt the passwor
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    // Creating a new instanse of User model
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    console.log(userObj);

    //   const userObj = new User({
    //     firstName: "Akshay",
    //     lastName: "saini",
    //     emailId: "as123@gmail.com",
    //     password: "4575",
    //   });
    await userObj.save();
    res.send("user added successfully!!");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isValidePassword = await bcrypt.compare(password, user.password);
    if (isValidePassword) {
      // Create a JWT token
      // const token = await jwt.sign({ _id: user._id }, "dev@TinderSecretKey", {
      //   expiresIn: "1d",
      // });

      // offloading to schema
      const token = await user.getJWT();

      // add the token to cookie and send the respose back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout successfully!!");
});

module.exports = authRouter;
