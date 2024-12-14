const cors = require("cors");
const crypto = require("crypto");
const express = require("express");
const minifyHTML = require("express-minify-html");
const path = require("path");
const session = require("express-session");
const app = express();
const configs = require("./models/configs.js");
const routes = require("./routes/init.js");
const settings = require("./config/settings.js");
const { localhost, remote } = require("./utils/database.js");
const { logger } = require("./utils/logger.js");
const chalk = require("chalk");

localhost
	.authenticate()
	.then(() => {
		logger("success", `Banco de dados ${chalk.yellow(`${localhost.config.host}.${localhost.config.database}`)} conectado`);
	})
	.catch((error) => {
		logger("error", `Não foi possível conectar-se ao banco de dados ${chalk.red(`${localhost.config.host}.${localhost.config.database}`)}: ${error}`);
	});

if (settings.database.remote.require) {
	remote
		.authenticate()
		.then(() => {
			logger("success", `Banco de dados ${chalk.yellow(`${remote.config.host}.${remote.config.database}`)} conectado`);
		})
		.catch((error) => {
			logger("error", `Não foi possível conectar-se ao banco de dados ${chalk.red(`${remote.config.host}.${remote.config.database}`)}: ${error}`);
		});
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
	cors({
		origin: settings.cors,
	})
);

app.use(
	minifyHTML({
		override: true,
		htmlMinifier: {
			removeComments: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeAttributeQuotes: true,
			removeEmptyAttributes: true,
			minifyJS: true,
			minifyCSS: true,
		},
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/temp", express.static(path.join(__dirname, "temp")));

app.use(
	session({
		secret: crypto.randomBytes(64).toString("hex"),
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false, // Change to true if using HTTPS
			maxAge: 1800000, // 30 minutes
		},
	})
);

app.use(async (req, res, next) => {
	res.locals.internal_settings = settings;
	res.locals.session = req.session;
	res.locals.node_version = process.version;
	res.locals.req = req;

	try {
		const get_configs = await configs.findOne();
		res.locals.settings = get_configs;
	} catch (error) {
		logger("error", `Erro ao buscar dados: ${error.message}`);
		res.locals.settings = null;
	}

	next();
});

app.use(routes);
logger(
	"success",
	`Oi eu do futuro, parei na página ${chalk.yellow(
		`views/donate/main`
	)} estava fazendo o front da doação, com sistema de multi-moedas e uma nova função de bônus a partir de X valor, mas desanimei. até breve(?)`
);
try {
	app.listen(settings.port, () => {
		logger("success", `Aplicativo iniciado na porta ${chalk.yellow(settings.port)}`);
	});
} catch (error) {
	logger("error", `Erro ao iniciar a aplicação: ${error.message}`);
}
