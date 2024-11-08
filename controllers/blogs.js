const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");

const { Blog, User } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

// router.post("/", async (req, res) => {
//   const blog = await Blog.create(req.body);
//   res.json(blog);
// });

// router.post("/", async (req, res) => {
//   const user = await User.findOne();
//   const blog = await Blog.create({ ...req.body, userId: user.id });
//   //const blog = await Blog.create(req.body);
//   res.json(blog);
// });

router.post("/", tokenExtractor, async (req, res) => {
  //const user = await User.findOne();
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  //const blog = await Blog.create(req.body);
  res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    return res.json(req.blog).status(204).end();
  }
  res.status(204).end();
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
