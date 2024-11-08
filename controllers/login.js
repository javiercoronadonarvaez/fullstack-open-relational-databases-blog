const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../utils/config");
const User = require("../models/user");

router.post("/", async (request, response) => {
  //const body = request.body;
  const { username, password } = request.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  // const passwordCorrect = body.password === "secret";
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  } else {
    console.log("");
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, userId: user.id });
});

module.exports = router;
