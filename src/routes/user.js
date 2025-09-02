const express = require("express");
const { userAuth } = require("../middlewares/user");
const { ConnectionRequest } = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) =>{
    try {
        const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", "firstName lastName");
    // }).populate("fromUserId", ["firstName", "lastName"]);  // both are same

    res.json({message:"data fetched successfully!" , data: connectionRequests})
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
    
})


module.exports = userRouter;