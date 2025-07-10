const express = require("express");

const app = express();

// app.use("/", (req, res) =>{  //! it will override the paths
//     res.send("Namaste from the Dashbord!");
// });

//! order of routes is very important

// this is match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

// This will only handle GET call to /user
app.get("/user", (req, res) =>{
    res.send({firstName: "Nitesh", lastName: "Kumar"})
})

app.post("/user", (req, res) =>{
    // saving data to DB
    res.send("Data successfully saved to database!")
})





app.listen(4000, ()=>{
    console.log("Server is successfully listening on 4000 port...");
});