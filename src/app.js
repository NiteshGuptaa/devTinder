const express = require("express");
const { adminAuth } = require("./middlewares/admin");
const { userAuth } = require("./middlewares/user");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signUp", async (req, res) => {
  const userObj = new User({
    firstName: "Akshay",
    lastName: "saini",
    emailId: "as123@gmail.com",
    password: "4575",
  });

  try {
    await userObj.save();
    res.send("user added successfully!!");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
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
