$(document).ready(function () {
  const maxFiles = 2;
  $("#multiple_images").on("change", function () {
    if (this.files.length > maxFiles) {
      alert(`You can only select up to ${maxFiles} images.`);
      this.value = "";
    }
  });

  $("#my_form").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    $.ajax({
      url: "http://localhost:3000/",
      method: "POST",
      contentType: false,
      processData: false,
      data: formData,
      success: function (response) {
        console.log(response);
      },
    });
  });
});
