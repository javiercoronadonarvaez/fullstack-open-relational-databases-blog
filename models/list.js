const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db");

class List extends Model {}

List.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "list",
  }
);

module.exports = List;
