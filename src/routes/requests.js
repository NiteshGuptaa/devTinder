const express = require('express');
const { userAuth } = require('../middlewares/user');

const requestRouter = express.Router();

requestRouter.use(express.json());

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) =>{
    const user = req.user;

    console.log("sending a connection request!");
    
    res.send(user.firstName + " sent the connection request!")
})


module.exports = requestRouter;