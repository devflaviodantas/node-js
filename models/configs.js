const { DataTypes } = require("sequelize");
const { localhost } = require("../utils/database.js");

const configs = localhost.define(
	"configs",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		server: {
			type: DataTypes.STRING,
		},
		site: {
			type: DataTypes.STRING,
		},
		theme: {
			type: DataTypes.STRING,
		},
		login: {
			type: DataTypes.INTEGER,
		},
		register: {
			type: DataTypes.INTEGER,
		},
		register_rewards: {
			type: DataTypes.INTEGER,
		},
		recover: {
			type: DataTypes.INTEGER,
		},
		confirm_email: {
			type: DataTypes.INTEGER,
		},
		gold: {
			type: DataTypes.INTEGER,
		},
		diamond: {
			type: DataTypes.INTEGER,
		},
		mailer: {
			type: DataTypes.TEXT,
		},
		captcha: {
			type: DataTypes.INTEGER,
		},
		site_key: {
			type: DataTypes.STRING,
		},
		secret_key: {
			type: DataTypes.STRING,
		},
		terms_rules: {
			type: DataTypes.STRING,
		},
		default_language: {
			type: DataTypes.STRING,
		},
		default_currency: {
			type: DataTypes.STRING,
		},
		gold_brl: {
			type: DataTypes.STRING,
		},
		gold_usd: {
			type: DataTypes.STRING,
		},
		gold_eur: {
			type: DataTypes.STRING,
		},
		diamond_brl: {
			type: DataTypes.STRING,
		},
		diamond_usd: {
			type: DataTypes.STRING,
		},
		diamond_eur: {
			type: DataTypes.STRING,
		},
		bonus: {
			type: DataTypes.STRING,
		},
		bonus_additional: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "configs",
		timestamps: false,
	}
);

module.exports = configs;
