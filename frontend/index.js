$(document).ready(function () {
  $("#my_form").on("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted");
    const payload = {
      title: $("#title").val()
    }
    $.ajax({
      url: "http://localhost:3000/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (response) {
        console.log(response);
      },
    });
  });
});
