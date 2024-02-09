const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
userRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    next(error);
  }
});
userRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    if (!body.username || !body.password) {
      response
        .status(400)
        .json({ error: "username or password is not provided" });
      return;
    }
    if (body.username.length < 3 || body.password.length < 3) {
      response
        .status(400)
        .json({ error: "username or password length must be 3 atleast" });
      return;
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});
module.exports = userRouter;
