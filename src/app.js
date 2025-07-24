const express = require("express");
const bcrypt = require("bcrypt");
const { adminAuth } = require("./middlewares/admin");
const { userAuth } = require("./middlewares/user");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

//it's a middleware, express provide us to parse json data & convert it in js Obj (middleware -> app.use())
app.use(express.json());
app.use(cookieParser()); // it is also a middleware , it help to read cookie

app.post("/signUp", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
      res.send("Login successfully!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API - GET /feed - get all users from the database
app.get("/feed", async (req, res) => {
  try {
    // if we pass empty Obj{} inside find we get all data from DB
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong!!");
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    // const user = await User.findByIdAndDelete(userId);  // Both are same
    console.log(user);
    res.send("User deleted successfully!!");
  } catch (error) {
    res.status(400).send("Something went wrong!!");
  }
});

// Update data of the user
// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;
//   try {
//     // it'll update only the things which declered in schema
//     // await User.findByIdAndUpdate({ _id: userId }, data);
//     await User.findByIdAndUpdate( userId, data, {runValidators: true}); // allowing valdation for patch API
//     res.send("User updated successfully!!");
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(400).send("Somthing went wrong!!");
//   }
// });

// Update data of the user by emailId
app.patch("/user", async (req, res) => {
  const { emailId, ...updateData } = req.body;
  // app.patch("/user/:emailId", async (req, res) => {
  // const emailId = req.params?.emailId;
  // const updateData = req.body;
  console.log("PATCH /user called with:", req.body);

  if (!emailId) {
    return res.status(400).send("Email is required!");
  }

  try {
    const ALLOWED_UPDATES = ["about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(updateData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!!");
    }
    const updatedUser = await User.findOneAndUpdate(
      { emailId: emailId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found!");
    }

    res.send("User updated successfully!!");
  } catch (error) {
    console.error("Error updating user:", error); // full error object
    res.status(500).send("Something went wrong!!");
  }
});

// app.listen(4000, ()=>{
//     console.log("Server is successfully listening on 4000 port...");
// });

// Good way : if DB connected successfully, then allow server to access
connectDB()
  .then(() => {
    console.log("database connection is estabtished...");
    app.listen(4000, () => {
      console.log("Server is successfully listening on 4000 port...");
    });
  })
  .catch((err) => {
    console.error("database not be connected!!");
  });
