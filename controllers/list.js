const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");

const { User, List } = require("../models");

router.get("/", async (req, res) => {
  const lists = await List.findAll();
  res.json(lists);
});

router.post("/", async (req, res) => {
  const list = await List.create({ ...req.body });
  res.json(list);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const list = await List.findByPk(req.params.id);

  if (user.dataValues.id === list.dataValues.userId) {
    // console.log("COMING HERE MATE");
    // console.log("User", user);
    // console.log("List", list);
    const read = req.body.read;
    list.read = read;
    await list.save();
    return res.json(list).status(204).end();
  }

  res.status(404).send({
    error:
      "Only the user who added the blog to the list can mark it as read or unread",
  });
});

module.exports = router;
