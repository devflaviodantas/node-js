const accounts = require("../models/accounts.js");

async function logged(req, res, next) {
	if (req.session.user) {
		try {
			const session = await accounts.findOne({
				where: { login: req.session.user.login },
			});
			req.session.user = session;
			return next();
		} catch (error) {
			console.error("Erro ao atualizar a sessão:", error);
			res.redirect("/login");
		}
	} else {
		res.redirect("/login");
	}
}

module.exports = logged;
