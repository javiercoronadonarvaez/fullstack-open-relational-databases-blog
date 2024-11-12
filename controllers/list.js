const router = require("express").Router();
// const { tokenExtractor } = require("../utils/middleware");

const { List } = require("../models");

// router.get("/", async (req, res) => {
//   const searchConditions = [];

//   if (req.query.search) {
//     searchConditions.push(
//       { title: { [Op.iLike]: `%${req.query.search}%` } },
//       { author: { [Op.iLike]: `%${req.query.search}%` } }
//     );
//   }

//   const blogs = await Blog.findAll({
//     //attributes: { exclude: ["userId"] },
//     include: {
//       model: User,
//       attributes: ["name"],
//     },
//     where: searchConditions.length > 0 ? { [Op.or]: searchConditions } : {},
//     order: [["likes", "DESC"]],
//   });
//   res.json(blogs);
// });

router.post("/", async (req, res) => {
  const blog = await List.create({ ...req.body });
  res.json(blog);
});

// const blogFinder = async (req, res, next) => {
//   req.blog = await Blog.findByPk(req.params.id);
//   next();
// };

// router.get("/:id", blogFinder, async (req, res) => {
//   if (req.blog) {
//     res.json(req.blog);
//   } else {
//     res.status(404).end();
//   }
// });

// router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
//   const user = await User.findByPk(req.decodedToken.id);
//   //   console.log("DECODED USER", user);
//   //   console.log("Requested Blog", req.blog);
//   if (user.dataValues.id === req.blog.dataValues.userId) {
//     await req.blog.destroy();
//     return res.json(req.blog).status(204).end();
//   }

//   res
//     .status(400)
//     .send({ error: "Only the user who created the blog can delete it" });
// });

// router.put("/:id", blogFinder, async (req, res) => {
//   if (req.blog) {
//     const likes = req.body.likes;
//     req.blog.likes = likes;
//     await req.blog.save();
//     res.json(req.blog);
//   } else {
//     res.status(404).end();
//   }
// });

module.exports = router;
