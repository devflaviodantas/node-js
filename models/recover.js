const { DataTypes } = require("sequelize");
const { localhost } = require("../utils/database.js");

const recover = localhost.define(
  "recover",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "recover",
    timestamps: false,
  }
);

module.exports = recover;
