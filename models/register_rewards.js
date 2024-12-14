const { DataTypes } = require("sequelize");
const { localhost } = require("../utils/database.js");

const register_rewards = localhost.define(
	"register_rewards",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "register_rewards",
		timestamps: false,
	}
);

module.exports = register_rewards;
