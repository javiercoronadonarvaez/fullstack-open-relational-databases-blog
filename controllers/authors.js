const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: [
        "author",
        "id",
        "url",
        "title",
        "likes",
        "userId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        "author",
        [Blog.sequelize.fn("COUNT", Blog.sequelize.col("title")), "articles"],
        [Blog.sequelize.fn("SUM", Blog.sequelize.col("likes")), "numLikes"],
      ],
    },
    group: ["author"],
    order: [["articles", "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
