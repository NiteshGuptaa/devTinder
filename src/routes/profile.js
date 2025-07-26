const express = require('express');
const { userAuth } = require('../middlewares/user');

const profileRouter = express.Router();

profileRouter.use(express.json());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) =>{
    const data = req.body;

    validateUserChange(data);
})

module.exports = profileRouter;