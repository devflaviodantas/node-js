const { DataTypes } = require("sequelize");
const { localhost } = require("../utils/database.js");

const rewards = localhost.define(
	"rewards",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		login: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		rewards: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		redemption: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		creatime: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{
		tableName: "rewards",
		timestamps: false,
	}
);

module.exports = rewards;
