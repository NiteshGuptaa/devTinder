const express = require("express");
const { adminAuth } = require("./middlewares/admin");
const { userAuth } = require("./middlewares/user");

const app = express();

// app.use("/", (req, res) =>{  //! it will override the paths
//     res.send("Namaste from the Dashbord!");
// });

//! order of routes is very important

//? this is match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//     res.send("Hello from the server!");
// });

//? This will only handle GET call to /user
// app.get("/user", (req, res) =>{
//     res.send({firstName: "Nitesh", lastName: "Kumar"})
// })



//! middleware (Handle auth. middlewares for all GET, POST, ... requests)
// app.use("/admin", (req, res, next) => {
//   console.log("Admin auth. is getting checked!!");
//   const tokan = "xyz";
//   const isAdminAuthorized = tokan === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized Admin!");
//   } else {
//     next();
//   }
// })
   //?  OR
// app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) =>{
    res.send("User data send!")
})

app.get("/admin/getAllData", adminAuth, (req, res) =>{
    res.send("All data...")
})

app.get("/admin/deleteUser", adminAuth, (req, res) =>{
    res.send("User deleted!")
})




app.listen(4000, ()=>{
    console.log("Server is successfully listening on 4000 port...");
});