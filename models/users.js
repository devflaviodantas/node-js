const { DataTypes } = require("sequelize");
const { localhost, remote } = require("../utils/database.js");
const settings = require("../config/settings.js");

let database;
if (settings.database.remote.require) {
  database = remote;
} else {
  database = localhost;
}

const users = database.define(
  "users",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
    },
    passwd: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    Prompt: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
    },
    answer: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
    },
    truename: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
    },
    idnumber: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "",
    },
    mobilenumber: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    province: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    city: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    phonenumber: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    address: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: "",
    },
    postalcode: {
      type: DataTypes.STRING(8),
      allowNull: true,
      defaultValue: "",
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creatime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    qq: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    passwd2: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
      {
        fields: ["creatime"],
      },
    ],
  }
);

module.exports = users;
