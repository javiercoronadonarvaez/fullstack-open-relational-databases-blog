const Blog = require("./blog");
const User = require("./user");
const List = require("./list");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(User, { through: List });
User.belongsToMany(Blog, { through: List });

User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  List,
  Session,
};
