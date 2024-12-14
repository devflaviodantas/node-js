const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

if (!fs.existsSync("logs")) {
	fs.mkdirSync("logs");
}

// Function to strip ANSI escape codes
const stripAnsi = (str) => {
	return str.replace(/\u001b\[[0-9]{1,2}m/g, "");
};

const logger = async (type, message) => {
	try {
		const timestamp = new Date().toISOString();
		const date = new Date().toISOString().split("T")[0];
		const logFile = path.join("logs", `${date}.log`);
		const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${stripAnsi(message)}\n`;

		switch (type) {
			case "success":
				console.log(chalk.green(message));
				break;
			case "error":
				console.error(chalk.red(message));
				break;
			default:
				console.log(message);
				break;
		}

		await fs.promises.appendFile(logFile, formattedMessage);
	} catch (err) {
		console.error(chalk.red("Failed to write to log file"), err);
	}
};

module.exports = { logger };
