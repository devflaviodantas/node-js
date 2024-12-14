const accounts = require("../models/accounts.js");
const { Op } = require("sequelize");
const fs = require("fs");
const send_mail = require("../utils/email.js");
const obfuscate = require("obfuscate-mail");
const { captcha } = require("../utils/captcha.js");
const { time_left } = require("../utils/time-left.js");
const NodeCache = require("node-cache");

const BLOCK_TIME = 30;
const block_cache = new NodeCache({ stdTTL: BLOCK_TIME });

render = (req, res) => {
  res.render("resend");
};

resend = async (req, res) => {
  const { data, "cf-turnstile-response": turnstile_token } = req.body;
  const message = [];

  if (res.locals.settings.captcha && !turnstile_token) {
    message.push("Verificação de segurança é obrigatória");
    return res.render("resend", { message });
  }

  if (!data) {
    message.push("Informe seu login ou e-mail.");
    return res.render("resend", { message });
  }

  if (res.locals.settings.captcha) {
    const check_captcha = await captcha(turnstile_token, req.ip, res.locals.settings.secret_key);
    if (!check_captcha) {
      message.push("Falha na verificação de segurança. Tente novamente.");
      return res.render("resend", { message, data });
    }
  }

  const attempts = block_cache.get("resend_block") || { blocked: false, blockedAt: null };

  if (attempts.blocked) {
    const currentTime = new Date();
    const blockedAt = new Date(attempts.blockedAt);
    const timeDiff = Math.floor((currentTime - blockedAt) / 1000);
    const timeLeft = BLOCK_TIME - timeDiff;

    if (timeLeft > 0) {
      message.push(`Você reenviou o e-mail recentemente, tente novamente em ${time_left(timeLeft)}.`);
      return res.render("resend", { message, data });
    } else {
      attempts.blocked = false;
      block_cache.set("resend_block", attempts);
    }
  }

  try {
    const user = await accounts.findOne({
      where: {
        [Op.or]: [{ login: data }, { email: data }],
      },
    });

    if (!user) {
      message.push("Não encontramos nenhum cadastro pendente com esse login ou e-mail.");
      return res.render("resend", { message });
    }

    if (user.status === 1) {
      message.push("Sua conta já está ativada faça login e aproveite todas as funcionalidades do painel.");
      return res.render("resend", { message, alert_type: "info", alert_icon: "las la-info-circle" });
    } else {
      let template = fs.readFileSync("./utils/template/confirm-email.html", "utf8");
      template = template.replace("{{truename}}", user.truename);
      template = template.replace("{{username}}", user.login);
      template = template.replace(/{{link}}/g, `${req.protocol}://${req.headers.host}/register/${user.login}/${user.token}`);

      try {
        await send_mail(user.email, "[RE] Ative sua conta - " + res.locals.settings.server, template, JSON.parse(res.locals.settings.mailer));
        attempts.blocked = true;
        attempts.blockedAt = new Date();
        block_cache.set("resend_block", attempts);
        message.push(`Reenviamos o link de ativação da sua conta para o seu endereço de e-mail <tag>${obfuscate(user.email)}</tag>`);
        return res.render("success", { message, alert_type: "success", alert_icon: "las la-check-circle" });
      } catch (error) {
        message.push("Ocorreu um erro ao enviar o e-mail.", error.message);
        return res.render("resend", { message });
      }
    }
  } catch (error) {
    message.push("Ocorreu um erro interno:", error.message);
    res.render("resend", { message });
  }
};

module.exports = { render, resend };
