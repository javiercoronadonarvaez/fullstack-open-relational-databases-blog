const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("blogs", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      year: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          minYear(value) {
            const currentYear = new Date().getFullYear();
            if (value < 1991 || value > currentYear) {
              throw new Error(`Year must be between 1991 and ${currentYear}`);
            }
          },
        },
      },
      created_at: {
        type: DataTypes.DATE, // Use DATE for timestamp
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default to current timestamp
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default to current timestamp
      },
    });
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          is: /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/,
        },
      },
      created_at: {
        type: DataTypes.DATE, // Use DATE for timestamp
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default to current timestamp
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default to current timestamp
      },
    });
    await queryInterface.addColumn("blogs", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("blogs");
    await queryInterface.dropTable("users");
  },
};
