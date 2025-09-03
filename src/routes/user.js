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

userRouter.get("/user/connections", userAuth, async (req, res) =>{
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName about skills").populate("toUserId", "firstName lastName about skills");
        // }).populate("fromUserId toUserId", "firstName lastName about skills"); // both are same        

        const data = connections.map(row => row.fromUserId._id.toString() === loggedInUser._id.toString() ? row.toUserId : row.fromUserId);
        // we can to compare two mongoose objectId using equals method also
        // const data = connections.map(row => row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId);

        res.send({message: "data fetched successfully!", data: data})
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})


module.exports = userRouter;