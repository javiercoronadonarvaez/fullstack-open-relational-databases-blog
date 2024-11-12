const Blog = require("./blog");
const User = require("./user");
const List = require("./list");
const Membership = require("./membership");

User.hasMany(Blog);
Blog.belongsTo(User);
// Blog.sync({ alter: true });
// User.sync({ alter: true });
Blog.belongsToMany(List, { through: Membership });
User.belongsToMany(List, { through: Membership });
List.belongsToMany(Blog, { through: Membership });
List.belongsToMany(User, { through: Membership });

module.exports = {
  Blog,
  User,
  List,
  Membership,
};
