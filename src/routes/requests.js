const express = require('express');
const { userAuth } = require('../middlewares/user');
const { ConnectionRequest } = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.use(express.json());

// requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) =>{
//     const user = req.user;

//     console.log("sending a connection request!");
    
//     res.send(user.firstName + " sent the connection request!")
// })

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) =>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignore"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalide status type: ", status });
        }

        const isValideUser = await User.findById( toUserId );
        if(!isValideUser){
            return res.status(404).send("Invalide user!")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            // fromUserId, toUserId

            // checking for both
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send("Connection Request already Exists!")
        }
        
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.send({
            message: req.user.firstName + " Connection Request Sent Successfully!",
            data
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) =>{
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalide status type:", status})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            return res.status(404).send("No Connection request found!")
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).send({
            message: `Connection Request ${status} successfully!`,
            data
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})


module.exports = requestRouter;
