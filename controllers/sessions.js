const { User, Session } = require("../models");
const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");

// router.get("/", async (req, res) => {
//   const users = await User.findAll({
//     attributes: { exclude: ["passwordHash"] },
//     include: {
//       model: Session,
//       //attributes: { exclude: ["userId"] },
//     },
//   });
//   res.json(users);
// });

router.get("/", tokenExtractor, async (req, res) => {
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
  //   session.active = false;
  await session.destroy();

  //   console.log("ALL SESSIONS", sessions);
  //   console.log("SINGLE SESSION", session);

  res.json(session);
});

module.exports = router;
