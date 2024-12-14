$(document).ready(function () {
	function verifyFields() {
		var email = $("#email").val();
		var truename = $("#truename").val();
		var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		var isEmailValid = emailPattern.test(email);
		var isTruenameValid = truename.trim() !== "";
		if (isEmailValid && isTruenameValid) {
			$("#account-fields").show("snow");
		} else {
			$("#account-fields").hide("snow");
		}
	}
	$("#email").on("input", verifyFields);
	$("#truename").on("input", verifyFields);
});
