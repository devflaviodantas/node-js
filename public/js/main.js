$(document).ready(function () {
	Pace.start();

	$('[data-toggle="tooltip"]').tooltip({
		html: true,
	});

	$("#hamburger").click(function () {
		$(".sidebar").toggle();
	});

	$(".password-toggle").click(function () {
		var passwordInput = $("#password, .password, #confirm");
		var passwordFieldType = passwordInput.attr("type");
		if (passwordFieldType === "password") {
			passwordInput.attr("type", "text");
		} else {
			passwordInput.attr("type", "password");
		}

		$(this).find("i").toggleClass("la-lock la-unlock");
	});
});
