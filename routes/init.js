const express = require("express");
const router = express.Router();

const login = require("./login.js");
const logout = require("./logout.js");
const register = require("./register.js");
const resend = require("./resend.js");
const recover = require("./recover.js");

//online
const home = require("./home.js");
const donate = require("./donate.js");

const logged = require("../middlewares/logged.js");

router.get("/", logged, (req, res) => {
	res.redirect("/home");
});

router.use(login);
router.use(register);
router.use(resend);
router.use(recover);

//online
router.use(home);
router.use(donate);

router.use(logout);

router.use((req, res, next) => {
	let page = req.path.split("/").pop();
	res.status(404).render("404", { page });
});

module.exports = router;
