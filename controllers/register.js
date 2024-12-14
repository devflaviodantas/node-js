const users = require("../models/users.js");
const { create_account } = require("../utils/account.js");
const { add_gold } = require("../utils/gold.js");
const accounts = require("../models/accounts.js");
const register_rewards = require("../models/register_rewards.js");
const table_rewards = require("../models/rewards.js");
const validator = require("validator");
const { logger } = require("../utils/logger.js");
const settings = require("../config/settings.js");
const hash = require("../utils/password.js");
const send_mail = require("../utils/email.js");
const fs = require("fs");
const { generateSlug } = require("random-word-slugs");
const { captcha } = require("../utils/captcha.js");
const obfuscate = require("obfuscate-mail");
const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");

async function get_rewards() {
	try {
		const get_rewards = await register_rewards.findOne();
		if (get_rewards && get_rewards.data) {
			return JSON.parse(get_rewards.data);
		} else {
			return [];
		}
	} catch (error) {
		console.error(`Ocorreu um erro: ${error}`);
		return [];
	}
}

render = async (req, res) => {
	if (req.session.user) {
		res.redirect("/home");
	} else {
		const rewards = await get_rewards();
		res.render("register", { rewards });
	}
};

const create_user = async (req, res) => {
	const { username, truename, password, email, terms_rules, "cf-turnstile-response": turnstile_token } = req.body;
	const message = [];
	let token = generateSlug(4);
	const rewards = await get_rewards();

	if (res.locals.settings.captcha && !turnstile_token) {
		message.push("Verificação de segurança é obrigatória");
	}

	if (validator.isEmpty(truename)) {
		message.push("Nome completo é obrigatório.");
	} else {
		if (!validator.matches(truename, /^[a-zA-ZÀ-ÿ\s]+$/)) {
			message.push("O nome completo deve conter apenas letras e espaços.");
		}
		if (!/\s/.test(truename)) {
			message.push("Informe seu nome e sobrenome.");
		}
		if (!validator.isLength(truename, { min: 6 })) {
			message.push("O nome completo deve ter pelo menos 6 caracteres.");
		}
	}

	if (validator.isEmpty(username)) {
		message.push("Login é obrigatório.");
	} else {
		if (!validator.isLength(username, { min: 4, max: 12 })) {
			message.push("O login deve ter entre 4 e 12 caracteres.");
		}
		if (!validator.matches(username, /^[a-z0-9]+$/)) {
			message.push("O login deve conter apenas letras minúsculas e números.");
		}
		if (validator.matches(username, /^[0-9]/)) {
			message.push("O login não deve começar com um número.");
		}
	}

	if (validator.isEmpty(email)) {
		message.push("E-mail é obrigatório.");
	} else {
		if (!validator.isEmail(email)) {
			message.push("Endereço de e-mail inválido.");
		}
		if (email !== email.toLowerCase()) {
			message.push("O e-mail deve conter apenas letras minúsculas.");
		}
		if (!validator.isLength(email, { min: 4, max: 64 })) {
			message.push("O e-mail deve ter entre 4 e 64 caracteres.");
		}
	}

	if (validator.isEmpty(password)) {
		message.push("Senha é obrigatória.");
	} else if (!validator.isLength(password, { min: 4, max: 50 })) {
		message.push("A senha deve ter entre 4 e 50 caracteres.");
	}

	if (!terms_rules) {
		message.push("Você precisa aceitar os termos e condições.");
	}

	if (message.length > 0) {
		return res.render("register", { rewards, message, username, email, truename });
	}

	if (res.locals.settings.captcha) {
		const check_captcha = await captcha(turnstile_token, req.ip, res.locals.settings.secret_key);
		if (!check_captcha) {
			message.push("Falha na verificação de segurança, tente novamente.");
			return res.render("register", { rewards, message, username, email, truename });
		}
	}

	try {
		const existingUser = await users.findOne({ where: { name: username } });
		const existingEmail = await users.findOne({ where: { email: email } });
		const existingLogin = await accounts.findOne({ where: { login: username } });
		const existingEmailAccount = await accounts.findOne({ where: { email: email } });

		if (existingUser || existingLogin) {
			message.push("Login já está em uso.");
		}
		if (existingEmail || existingEmailAccount) {
			message.push("E-mail já está em uso.");
		}

		if (message.length > 0) {
			return res.render("register", { rewards, message, username, email, truename });
		}

		// Criação da conta
		const password_hash = await hash(username, password, res.locals.internal_settings.password_hash);
		let player = "Sua conta foi criada mas precisa ser ativada!<br>";
		const capitalize = (str) =>
			str
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(" ");
		const account = await accounts.create({
			userid: 0,
			login: username,
			password: password_hash,
			temp_password: btoa(password),
			email: email,
			truename: capitalize(truename),
			phone: 0,
			cpf: 0,
			gender: 0,
			ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
			token: token,
			adm: 0,
			diamond: res.locals.settings.diamond,
			currency: res.locals.settings.default_currency,
			status: 0,
			creatime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
		});

		if (res.locals.settings.confirm_email === 0) {
			const link = `${req.protocol}://${req.headers.host}/register/${username}/${token}`;
			return res.redirect(link);
		} else {
			if (res.locals.settings.gold > 0) {
				player += `<br>Ao ativar sua conta você receberá <tag>${res.locals.settings.gold} Gold</tag> para usar na loja do jogo.`;
			}
			if (res.locals.settings.diamond > 0) {
				player += `<br>Ao ativar sua conta você receberá <tag>${res.locals.settings.diamond} Diamantes</tag> para usar na loja do painel.`;
			}

			let template = fs.readFileSync("./utils/template/confirm-email.html", "utf8");
			template = template
				.replace("{{username}}", username)
				.replace("{{truename}}", truename)
				.replace(/{{link}}/g, `${req.protocol}://${req.headers.host}/register/${username}/${token}`);
			try {
				send_mail(email, "Ative sua conta - " + res.locals.settings.server, template, JSON.parse(res.locals.settings.mailer));
				player += `<br><br>Clique no link enviado para ${obfuscate(email)} para ativar sua conta.`;
			} catch (error) {
				player += `<br><br>Ocorreu um erro ao enviar o e-mail, contate o administrador`;
			}
		}

		res.status(200).render("success", { message: [player], title: "Oba, sua conta foi criada!", redirect_to: "/home", alert_type: "success", alert_icon: "las la-check-circle" });
	} catch (error) {
		res.status(500).render("register", {
			rewards,
			message: [`Não foi possível criar sua conta, tente novamente mais tarde. ${error.message}`],
			username,
			email,
			truename,
		});
		logger("error", `Erro ao registrar usuário: ${error.message}`);
	}
};

const confirm = async (req, res) => {
	const { login, token } = req.params;
	const message = [];
	const rewards = await get_rewards();

	if (!login || !token) {
		message.push("Link inválido");
		return res.render("success", { message });
	}

	try {
		const data_account = await accounts.findOne({ where: { token, login } });

		if (!data_account) {
			message.push("Não encontramos nenhum cadastro com essa combinação de token.");
			return res.render("success", { message, alert_type: "error" });
		}

		if (data_account.status === 1) {
			message.push("Sua conta já foi ativada, faça login e aproveite todas as funcionalidades do painel.");
			return res.render("success", { message, alert_type: "success", alert_icon: "las la-check-circle" });
		}

		try {
			const update_account = await accounts.update({ status: 1 }, { where: { token } });

			if (update_account[0] > 0) {
				let player = "Sua conta foi criada com sucesso!";

				try {
					await create_account({
						login: data_account.login,
						password: data_account.password,
						truename: data_account.truename,
						email: data_account.email,
						passwd2: data_account.password,
					});
				} catch (error) {
					message.push(`Ocorreu um erro ao criar a conta: ${error.message}`);
					return res.render("success", { message });
				}

				try {
					const get_id = await users.findOne({ where: { name: data_account.login } });
					await accounts.update({ userid: get_id.ID, temp_password: 0 }, { where: { login: data_account.login } });

					if (res.locals.settings.gold > 0) {
						try {
							const usercashnow = add_gold(get_id.ID, res.locals.settings.gold);
							if (usercashnow) {
								player += `<br>Você recebeu <tag>${res.locals.settings.gold} Gold</tag> para usar na loja do jogo`;
							} else {
								player += `<br><br>Ocorreu um erro ao adicionar Gold a sua conta, contate o administrador`;
							}
						} catch (error) {
							player += `<br><br>Ocorreu um erro ao adicionar Gold a sua conta: ${error.message}`;
						}
					}

					if (res.locals.settings.diamond > 0) {
						player += `<br>Você recebeu <tag>${res.locals.settings.diamond} Diamantes</tag> para usar na loja do painel`;
					}

					let template = fs.readFileSync("./utils/template/welcome.html", "utf8");
					template = template
						.replace("{{username}}", data_account.login)
						.replace("{{password}}", atob(data_account.temp_password))
						.replace("{{truename}}", data_account.truename)
						.replace(/{{server}}/g, res.locals.settings.server)
						.replace(/{{site}}/g, res.locals.settings.site);
					send_mail(data_account.email, res.locals.settings.server, template, JSON.parse(res.locals.settings.mailer));

					const registration_data = [
						`Olá, ${data_account.truename}!`,
						`Seja bem-vindo(a) ao ${res.locals.settings.server}!`,
						"",
						`Login: ${data_account.login}`,
						`Senha: ${atob(data_account.temp_password)}`,
						`E-mail: ${data_account.email}`,
						`Data de cadastro: ${format(new Date(), "dd MMMM, yyyy HH:mm", { locale: ptBR })}`,
						"",
						res.locals.settings.site,
					].join("\n");

					try {
						const file_name = `${data_account.token}.txt`;
						fs.writeFileSync(`temp/${file_name}`, registration_data);
					} catch (error) {
						logger("error", `Error ao criar o arquivo .txt da conta ${data_account.login} na pasta temp`);
					}

					if (res.locals.settings.register_rewards) {
						await table_rewards.create({
							login: data_account.login,
							type: "register",
							message: `Rebeceu (${rewards.length}}) recompensas por criar essa conta`,
							rewards: JSON.stringify(rewards),
							status: 0,
							redemption: 0,
							creatime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
						});
					}

					return res.render("success", { message: [player], alert_type: "success", alert_icon: "las la-check-circle", download: data_account.token });
				} catch (error) {
					message.push(`[1]Ocorreu um erro: ${error.message}`);
					return res.render("success", { message, alert_type: "error" });
				}
			}
		} catch (error) {
			message.push(`[2]Ocorreu um erro: ${error.message}`);
			return res.render("success", { message, alert_type: "error" });
		}
	} catch (error) {
		message.push(`[3]Ocorreu um erro interno: ${error.message}`);
		res.render("success", { message, alert_type: "error" });
	}
};

module.exports = { render, create_user, confirm };
