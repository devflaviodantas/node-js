const users = require("../models/users.js");
const accounts = require("../models/accounts.js");
const recover = require("../models/recover.js");
const validator = require("validator");
const { Op } = require("sequelize");
const fs = require("fs");
const send_mail = require("../utils/email.js");
const obfuscate = require("obfuscate-mail");
const { captcha } = require("../utils/captcha.js");
const { generateSlug } = require("random-word-slugs");
const { addMinutes, format, differenceInSeconds } = require("date-fns");
const { time_left } = require("../utils/time-left.js");
const hash = require("../utils/password.js");
const NodeCache = require("node-cache");

const BLOCK_TIME = 30;
const block_cache = new NodeCache({ stdTTL: BLOCK_TIME });
const success_cache = new NodeCache({ stdTTL: BLOCK_TIME });

render = (req, res) => {
	res.render("recover");
};

request = async (req, res) => {
	const { data, "cf-turnstile-response": turnstile_token } = req.body;
	const message = [];

	if (res.locals.settings.captcha && !turnstile_token) {
		message.push("Verificação de segurança é obrigatória");
		return res.render("recover", { message });
	}

	if (!data) {
		message.push("Informe seu login ou e-mail.");
		return res.render("recover", { message });
	}

	if (res.locals.settings.captcha) {
		const check_captcha = await captcha(turnstile_token, req.ip, res.locals.settings.secret_key);
		if (!check_captcha) {
			message.push("Falha na verificação de segurança. Tente novamente.");
			return res.render("recover", { message, data });
		}
	}

	const attempts = block_cache.get("recover_block") || { attempts: 0, blocked: false, blockedAt: null };
	const success = success_cache.get("recover_success") || { sent: false, sentAt: null };

	if (attempts.blocked) {
		const currentTime = new Date();
		const blockedAt = new Date(attempts.blockedAt);
		const timeDiff = Math.floor((currentTime - blockedAt) / 1000);
		const timeLeft = BLOCK_TIME - timeDiff;

		if (timeLeft > 0) {
			message.push(`Você digitou muitos login/email incorretos<br>Tente novamente em ${time_left(timeLeft)}.`);
			return res.status(429).render("recover", { message, data });
		} else {
			attempts.blocked = false;
			attempts.attempts = 0;
			block_cache.set("recover_block", attempts);
		}
	}

	if (success.sent) {
		const currentTime = new Date();
		const sentAt = new Date(success.sentAt);
		const timeDiff = Math.floor((currentTime - sentAt) / 1000);
		const timeLeft = BLOCK_TIME - timeDiff;

		if (timeLeft > 0) {
			message.push(`Aguarde ${time_left(timeLeft)} para utilizar esta função novamente.`);
			return res.status(429).render("recover", { message, data });
		} else {
			success.sent = false;
			success_cache.set("recover_success", success);
		}
	}

	try {
		const user = await users.findOne({
			where: {
				[Op.or]: [{ name: data }, { email: data }],
			},
		});

		const user_pending = await accounts.findOne({
			where: {
				[Op.or]: [{ login: data }, { email: data }],
			},
		});

		if (user_pending && user_pending.status === 0 && res.locals.settings.confirm_email === 1) {
			message.push(
				`A conta ${data} foi criada mas ainda não foi ativada, portanto não é possivel recuperar no momento, você pode realizar a ativação da conta clicando link que foi enviado para seu e-mail ou requistar o link novamente <a href="/resend">clicando aqui</a>.`
			);
			return res.render("recover", { message, data });
		} else {
			if (!user) {
				message.push("Não encontramos nenhuma conta com este login/e-mail.");
				attempts.attempts += 1;
				if (attempts.attempts >= 5) {
					attempts.blocked = true;
					attempts.blockedAt = new Date();
				}
				block_cache.set("recover_block", attempts);
				return res.render("recover", { message });
			}

			await recover.destroy({ where: { login: user.name } });

			const expiration = addMinutes(new Date(), 15);
			const expirationInSeconds = Math.floor(expiration.getTime() / 1000);
			const token = generateSlug(4);
			const request = await recover.create({
				login: user.name,
				email: user.email,
				token: token,
				ip: req.ip,
				expiration: expirationInSeconds,
				creatime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
			});

			if (request) {
				let template = fs.readFileSync("./utils/template/recover.html", "utf8");
				template = template.replace("{{username}}", user.name);
				template = template.replace("{{truename}}", user.truename);
				template = template.replace("{{expire}}", format(expiration, "dd/MM/yyyy 'às' HH:mm"));
				template = template.replace(/{{link}}/g, `${req.protocol}://${req.headers.host}/recover/${user.name}/${token}`);

				try {
					await send_mail(user.email, "Recuperar Conta - " + res.locals.settings.server, template, JSON.parse(res.locals.settings.mailer));
					message.push(`Enviamos uma mensagem contendo os detalhes da sua conta e um link para alterar sua senha para o e-mail <tag>${obfuscate(user.email)}</tag>`);
					success.sent = true;
					success.sentAt = new Date();
					success_cache.set("recover_success", success);
					return res.status(200).render("recover", { message, alert_type: "success", alert_icon: "las la-check-circle" });
				} catch (error) {
					message.push("Ocorreu um erro ao enviar o e-mail.", error.message);
					return res.render("recover", { message });
				}
			}
		}
	} catch (error) {
		message.push("Ocorreu um erro interno:", error.message);
		res.render("recover", { message });
	}
};

const reset = async (req, res) => {
	const { login, token } = req.params;
	const message = [];

	if (!login || !token) {
		message.push("Link inválido");
		return res.render("reset", { message });
	}

	try {
		const get_request = await recover.findOne({ where: { token, login } });

		if (!get_request) {
			message.push("Não encontramos nenhum solicitação com essa combinação de token.");
			return res.render("reset", { message, recover: false, login, token });
		}

		if (get_request.expiration < Math.floor(Date.now() / 1000)) {
			message.push('Oops, este link expirou, solicite um novo link de recuperação <a href="/recover">clicando aqui</a>');
			return res.render("reset", { message, recover: false, login, token });
		}

		return res.render("reset", { message, recover: true, login, token });
	} catch (error) {
		message.push(`Ocorreu um erro interno: ${error.message}`);
		res.render("reset", { message, recover: false, login, token });
	}
};

const update = async (req, res) => {
	const { login, token } = req.params;
	const { password, confirm } = req.body;
	const message = [];

	if (validator.isEmpty(password)) {
		message.push("Senha é obrigatória.");
	} else if (!validator.isLength(password, { min: 4, max: 50 })) {
		message.push("A senha deve ter entre 4 e 50 caracteres.");
	}

	if (validator.isEmpty(confirm)) {
		message.push("Repetir Senha é obrigatório.");
	} else if (confirm !== password) {
		message.push("As senhas não iguais.");
	}

	if (message.length > 0) {
		return res.render("reset", { message, recover: true, login, token });
	}

	try {
		const request = await recover.findOne({ where: { token, login } });

		if (!request) {
			message.push("Não encontramos nenhum solicitação com essa combinação de token.");
			return res.render("reset", { message, recover: false, login, token });
		}

		if (request.expiration < Math.floor(Date.now() / 1000)) {
			message.push("Oops, este link expirou.");
			return res.render("reset", { message, recover: false, login, token });
		}

		const user = await users.findOne({ where: { name: login } });

		if (!user) {
			message.push("Usuário não encontrado.");
			return res.render("reset", { message, recover: false, login, token });
		}

		try {
			const password_hash = await hash(login, password, res.locals.internal_settings.password_hash);
			await users.update({ passwd: password_hash, passwd2: password_hash }, { where: { name: login } });
			await accounts.update({ password: password_hash }, { where: { login } });

			await recover.destroy({ where: { token, login } });

			message.push("Senha atualizada com sucesso!");
			return res.render("success", { message, alert_type: "success", alert_icon: "las la-check-circle" });
		} catch (error) {
			message.push("Ocorreu um erro ao atualizar a senha:", error.message);
			return res.render("reset", { message, recover: true, login, token });
		}
	} catch (error) {
		message.push(`Ocorreu um erro interno: ${error.message}`);
		res.render("reset", { message, recover: false, login, token });
	}
};

module.exports = { render, request, reset, update };
