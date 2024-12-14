//revoltz.dev
const settings = {
	cors: ["http://localhost", "https://revoltz.dev"],
	port: 8080,
	sandbox: true, // payments in development mode
	password_hash: "0x.md5", // 0x.md5 | md5 | base64 | base64+md5
	database: {
		localhost: {
			host: "localhost",
			username: "root",
			password: "",
			dbname: "node-js",
			port: 3306,
		},
		remote: {
			require: true,
			host: "localhost",
			username: "root",
			password: "",
			dbname: "pw",
			port: 3306,
		},
	},
	debug: false,
	version: "1.0.0",
};

module.exports = settings;
