const { DataTypes } = require("sequelize");
const { localhost } = require("../utils/database.js");

const accounts = localhost.define(
	"accounts",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		userid: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		temp_password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		truename: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cpf: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gender: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		ip: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
		},
		adm: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
		diamond: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: "0",
		},
		currency: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
		creatime: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "accounts",
		timestamps: false,
	}
);

module.exports = accounts;
