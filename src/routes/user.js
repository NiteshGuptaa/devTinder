const express = require("express");
const { userAuth } = require("../middlewares/user");
const { ConnectionRequest } = require("../models/connectionRequest");
const { connections } = require("mongoose");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    // }).populate("fromUserId", ["firstName", "lastName"]);  // both are same

    res.json({
      message: "data fetched successfully!",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName about skills photoURL")
      .populate("toUserId", "firstName lastName about skills photoURL");
    // }).populate("fromUserId toUserId", "firstName lastName about skills"); // both are same

    const data = connections.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );
    // we can to compare two mongoose objectId using equals method also
    // const data = connections.map(row => row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId);

    res.send({ message: "data fetched successfully!", data: data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    limit > 20 ? 20 : limit; // max limit is 20
    skip = (page - 1) * limit;

    // find all connection of logged in user
    // then exclude those users from feed
    // also exclude logged in user from feed
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connections.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } }, // convert set to array (nin -> not in)
        { _id: { $ne: loggedInUser._id } }, // ne -> not equal
      ],
    })
      .select("firstName lastName about skills photoURL")
      .skip(skip)
      .limit(limit); // pagination (byDefault - skip=0, limit=all)

    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
