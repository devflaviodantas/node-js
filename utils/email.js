const nodemailer = require("nodemailer");
const { logger } = require("./logger");

async function send_mail(to, subject, text, settings) {
	const transporter = nodemailer.createTransport({
		service: settings.server,
		auth: {
			user: settings.user,
			pass: settings.password,
		},
	});

	const mailOptions = {
		from: settings.from,
		to: to,
		subject: subject,
		html: text,
		attachments: [
			{
				filename: "logo-dark.png",
				path: "./public/images/logo-dark.png",
				cid: "logo_cid",
			},
		],
	};

	try {
		//await
		//para esperar a resposta =)
		transporter.sendMail(mailOptions);
	} catch (error) {
		logger("error", `Error to send mail ${to}: ${subject} - Error: (${error.message})`);
	}
}

module.exports = send_mail;
