const settings = require("../config/settings.js");
const users = require("../models/users.js");
const accounts = require("../models/accounts.js");
const hash = require("../utils/password.js");
const { generateSlug } = require("random-word-slugs");
const { captcha } = require("../utils/captcha.js");
const { format } = require("date-fns");
const { time_left } = require("../utils/time-left.js");
const NodeCache = require("node-cache");

const BLOCK_TIME = 30;
const block_cache = new NodeCache({ stdTTL: BLOCK_TIME });

render = (req, res) => {
	if (req.session.data) {
		res.redirect("/home");
	} else {
		res.render("login");
	}
};

auth = async (req, res) => {
	const { username, password, "cf-turnstile-response": turnstile_token } = req.body;

	const message = [];

	if (!username) message.push("O login é obrigatório");
	if (!password) message.push("Senha é obrigatório");
	if (res.locals.settings.captcha && !turnstile_token) message.push("Verificação de segurança é obrigatória");

	if (message.length > 0) {
		return res.render("login", { message, username });
	}

	const attempts = block_cache.get("login_block") || { attempts: 0, blocked: false, blockedAt: null };

	if (attempts.blocked) {
		const currentTime = new Date();
		const blockedAt = new Date(attempts.blockedAt);
		const timeDiff = Math.floor((currentTime - blockedAt) / 1000);
		const timeLeft = BLOCK_TIME - timeDiff;

		if (timeLeft > 0) {
			message.push(`Você excedeu o número permitido de tentativas de login<br>Tente novamente em ${time_left(timeLeft)}.`);
			return res.render("login", { message, username });
		} else {
			attempts.blocked = false;
			attempts.attempts = 0;
			block_cache.set("login_block", attempts);
		}
	}

	if (res.locals.settings.captcha) {
		const check_captcha = await captcha(turnstile_token, req.ip, res.locals.settings.secret_key);
		if (!check_captcha) {
			message.push("Falha na verificação de segurança. Tente novamente.");
			return res.render("login", { message, username });
		}
	}

	const password_hash = hash(username, password, settings.password_hash);

	let user_remote = await users.findOne({
		where: { name: username, passwd: password_hash },
	});

	let user_localhost = await accounts.findOne({
		where: { login: username, password: password_hash },
	});

	if (res.locals.settings.confirm_email === 1 && user_localhost && !user_localhost.status) {
		message.push(`A conta ${user_localhost.login} foi criada mas ainda não foi ativada.`);
		message.push(`Para ativar sua conta clique no link enviado no seu email.`);
		message.push(`<br>Se você não recebeu o e-mail <a href="/resend">clique aqui</a> para reenviar.`);
		res.render("login", { message, username });
		return;
	}

	if (user_remote && !user_localhost) {
		try {
			let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
			let token = generateSlug(4);
			await accounts.create({
				userid: user_remote.ID,
				login: user_remote.name,
				password: user_remote.passwd,
				email: user_remote.email,
				truename: user_remote.truename,
				phone: 0,
				cpf: 0,
				gender: user_remote.gender,
				ip: ip,
				token: token,
				adm: 0,
				diamond: 0,
				status: 1,
				creatime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
			});

			user_localhost = await accounts.findOne({
				where: { login: username, password: password_hash },
			});
		} catch (error) {
			message.push(`Ocorreu um erro ao tentar registrar o usuário localhost: ${error.message}`);
			return res.render("login", { message, username });
		}
	}

	const login = user_remote;

	if (login) {
		const login2 = await accounts.findOne({
			where: { login: username },
		});

		if (res.locals.settings.login === 0 && login2.adm === 0) {
			message.push("No momento o login está disponível apenas para administradores. Por favor, tente novamente mais tarde.");
			return res.render("login", { message, username });
		}

		req.session.user = user_localhost;

		res.redirect("/home");
	} else {
		attempts.attempts += 1;
		if (attempts.attempts >= 5) {
			attempts.blocked = true;
			attempts.blockedAt = new Date();
		}
		block_cache.set("login_block", attempts);

		message.push("Login ou senha inválidos.");
		message.push("Cuidado com as teclas shift e caps lock: o sistema diferencia letras maiúsculas e minúsculas");
		res.render("login", { message, username });
	}
};

module.exports = { render, auth };
