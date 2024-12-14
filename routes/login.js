const express = require("express");
const router = express.Router();
const controller = require("../controllers/login.js");

router.get(
	"/login",
	// middleware
	(req, res, next) => {
		if (req.session.user) {
			res.redirect("/home");
		} else {
			next();
		}
	},
	controller.render
);

router.post("/login", controller.auth);

module.exports = router;
