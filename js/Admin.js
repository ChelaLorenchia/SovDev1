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
  document.getElementById("image").value = "";
  preview.src = "";
  wrapper.style.display = "none";
}

// Admin Home

// tambah produk
document
  .getElementById("productForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:5000/api/menus", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Produk berhasil ditambahkan!");
        window.location.href = "Admin Home.html";
      } else {
        alert("Gagal menambahkan produk: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim data.");
      console.error(err);
    }
  });
