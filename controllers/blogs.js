const { Op } = require("sequelize");
const router = require("express").Router();
const { tokenExtractor, blogFinder } = require("../utils/middleware");

const { Blog, User, Session } = require("../models");

router.get("/", async (req, res) => {
  const searchConditions = [];

  if (req.query.search) {
    searchConditions.push(
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    );
  }

  const blogs = await Blog.findAll({
    //attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where: searchConditions.length > 0 ? { [Op.or]: searchConditions } : {},
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  console.log("CURRENT TOKEN", req.token);
  const user = await User.findByPk(req.decodedToken.id);
  if (user.disabled) {
    return res.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  const session = await Session.findOne({
    where: { userId: user.dataValues.id, token: req.token, active: true },
    order: [["updatedAt", "DESC"]],
  });

  console.log("Session Info", session);

  if (!session || !session.active) {
    return res.status(401).json({
      error: "Session inactive. Please log in with a valid token",
    });
  }

  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  //const user = await User.findByPk(req.decodedToken.id);
  //   console.log("DECODED USER", user);
  //   console.log("Requested Blog", req.blog);
  console.log("CURRENT TOKEN", req.token);
  const user = await User.findByPk(req.decodedToken.id);
  if (user.disabled) {
    return res.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  const session = await Session.findOne({
    where: { userId: user.dataValues.id, token: req.token, active: true },
    order: [["updatedAt", "DESC"]],
  });

  console.log("Session Info", session);

  if (!session || !session.active) {
    return res.status(401).json({
      error: "Session inactive. Please log in with a valid token",
    });
  }

  if (user.dataValues.id === req.blog.dataValues.userId) {
    await req.blog.destroy();
    return res.json(req.blog).status(204).end();
  }

  res
    .status(400)
    .send({ error: "Only the user who created the blog can delete it" });
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    const likes = req.body.likes;
    req.blog.likes = likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
