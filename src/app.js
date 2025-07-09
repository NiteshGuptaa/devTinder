const express = require("express");

const app = express();

app.use("/", (req, res) =>{
    res.send("Namaste from the Dashbord!");
});

app.use("/hello", (req, res) => {
    res.send("Hello route!");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

app.listen(4000, ()=>{
    console.log("Server is successfully listening on 4000 port...");
});