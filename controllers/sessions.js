const { User, Session } = require("../models");
const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");

router.get("/", async (req, res) => {
  const sessions = await Session.findAll();
  res.json(sessions);
});

router.delete("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  console.log("USER FROM TOKEN", user.dataValues.id);
  const session = await Session.findOne({
    where: { userId: user.dataValues.id },
    order: [["updatedAt", "DESC"]],
  });

  await session.destroy();

  res.json(session);
});

module.exports = router;
