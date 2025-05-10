function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
  window.onload = () => {
    const desc = document.getElementById("deskripsi");
    if (desc) autoResize(desc);
  };

  function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
      const preview = document.getElementById("imgPreview");
      const wrapper = document.getElementById("imagePreviewWrapper");
      preview.src = reader.result;
      wrapper.style.display = "block";
    };
    if (input.files[0]) {
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  function removeImage() {
    const preview = document.getElementById("imgPreview");
    const wrapper = document.getElementById("imagePreviewWrapper");
    document.getElementById("foto").value = "";
    preview.src = "";
    wrapper.style.display = "none";
  }
  
// Admin Home
