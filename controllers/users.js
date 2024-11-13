const bcrypt = require("bcrypt");
const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");

const { User, Blog, List } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

// router.post("/", async (req, res) => {
//   const user = await User.create(req.body);
//   res.json(user);
// });

router.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

router.put("/:username", tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    const body = req.body;
    user.username = body.username;
    user.disabled = body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

// router.put("/:username", async (req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: req.params.username,
//     },
//   });
//   if (user) {
//     const body = req.body;
//     // user.username = body.username;
//     // user.disabled = body.disabled;
//     user.admin = body.admin;
//     await user.save();
//     res.json(user);
//   } else {
//     res.status(404).end();
//   }
// });

// router.get("/:id", async (req, res) => {
//   const user = await User.findByPk(req.params.id);
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404).end();
//   }
// });

router.get("/:id", async (req, res) => {
  const where = {};

  if (req.query.read) {
    console.log("READ Detected", req.query.read);
    where.read = req.query.read;
  }

  console.log("WHERE READ", where);

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: {
          attributes: ["id", "read"],
          where,
        },
      },
    ],
    attributes: {
      exclude: [
        "id",
        "admin",
        "disabled",
        "passwordHash",
        "createdAt",
        "updatedAt",
      ],
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.destroy();
  return res.json(user).status(204).end();
});

module.exports = router;
