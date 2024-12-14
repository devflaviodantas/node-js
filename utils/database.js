const { Sequelize } = require("sequelize");
const settings = require("../config/settings.js");

const localhost = new Sequelize({
  dialect: "mysql",
  database: settings.database.localhost.dbname,
  username: settings.database.localhost.username,
  password: settings.database.localhost.password,
  host: settings.database.localhost.host,
  port: settings.database.localhost.port,
  logging: settings.debug,
});

const remote = new Sequelize({
  dialect: "mysql",
  database: settings.database.remote.dbname,
  username: settings.database.remote.username,
  password: settings.database.remote.password,
  host: settings.database.remote.host,
  port: settings.database.remote.port,
  logging: settings.debug,
});

module.exports = { localhost, remote };
