const { sequelize } = require("../utils/db");
const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["author", "id", "url", "title", "likes", "userId"],
      include: [
        "author",
        [Blog.sequelize.fn("COUNT", sequelize.col("title")), "articles"],
        [Blog.sequelize.fn("SUM", sequelize.col("likes")), "numLikes"],
      ],
    },
    group: ["author"],
    order: [["articles", "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
