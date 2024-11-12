const Blog = require("./blog");
const User = require("./user");
const List = require("./list");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(User, { through: List });
User.belongsToMany(Blog, { through: List });

module.exports = {
  Blog,
  User,
  List,
};
