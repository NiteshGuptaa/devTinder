const express = require('express');
const { userAuth } = require('../middlewares/user');

const profileRouter = express.Router();

profileRouter.use(express.json());

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});


module.exports = profileRouter;