const express = require("express");
const router = express.Router();
const controller = require("../controllers/register.js");

router.get(
	"/register",
	// middleware
	(req, res, next) => {
		if (req.session.user) {
			res.render("home", {
				errors: ["Não é possível criar uma nova conta enquanto sua sessão estiver ativa. Faça logout e tente novamente."],
			});
		} else {
			next();
		}
	},
	controller.render
);

router.get("/register/:login/:token", controller.confirm); //get register page

router.post("/register", controller.create_user); //post register

module.exports = router;
