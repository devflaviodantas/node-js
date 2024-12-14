$(document).ready(function () {
  $("#loginForm").validate({
    rules: {
      username: {
        required: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      username: {
        required: "O login é obrigatório.",
      },
      password: {
        required: "A senha é obrigatória.",
      },
    },
    errorPlacement: function (error, element) {
      error.addClass("error-message");
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass("input-error");
    },
    unhighlight: function (element) {
      $(element).removeClass("input-error");
    },
  });
});
