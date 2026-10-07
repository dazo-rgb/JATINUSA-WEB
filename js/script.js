// Fungsi untuk alert sederhana di tombol detail produk
function showProductDetail(productName) {
  alert("Menampilkan detail untuk produk: " + productName);
}

// Fungsi Kalkulator Estimator (untuk estimator.html)
function calculateEstimation() {
  const jenis = document.getElementById("jenis");
  const ukuran = document.getElementById("ukuran");
  const finishing = document.getElementById("finishing");
  const hasilEstimasi = document.getElementById("hasilEstimasi");

  if (!jenis || !ukuran || !finishing || !hasilEstimasi) return;

  let basePrice = 0;

  if (jenis.value === "Dining Table") {
    basePrice = 7500000;
  } else if (jenis.value === "Bed Frame") {
    basePrice = 9000000;
  } else if (jenis.value === "TV Cabinet") {
    basePrice = 6000000;
  } else if (jenis.value === "Wardrobe") {
    basePrice = 8500000;
  } else {
    basePrice = 3500000;
  }

  if (ukuran.value === "Large (200 x 100 cm)") basePrice += 1500000;
  else if (ukuran.value === "Small (100 x 60 cm)") basePrice -= 1000000;

  if (finishing.value === "Glossy") basePrice += 500000;
  else if (finishing.value === "Rustic") basePrice += 750000;

  const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(basePrice);
  hasilEstimasi.innerText = formattedPrice;
}

// Fungsi untuk memindahkan tab Login dan Register (untuk login.html)
function switchTab(tab) {
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");

  if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;

  if (tab === "register") {
    // Styling Navigasi
    tabRegister.className = "pb-2 border-bottom border-dark border-3 text-dark-brown fw-bold cursor-pointer";
    tabLogin.className = "pb-2 text-secondary me-4 fw-bold cursor-pointer";

    // Munculkan Register (fade-in)
    formRegister.style.opacity = "1";
    formRegister.style.visibility = "visible";
    formRegister.style.pointerEvents = "auto";

    // Sembunyikan Login (fade-out)
    formLogin.style.opacity = "0";
    formLogin.style.visibility = "hidden";
    formLogin.style.pointerEvents = "none";
  } else {
    // Styling Navigasi
    tabLogin.className = "pb-2 border-bottom border-dark border-3 text-dark-brown me-4 fw-bold cursor-pointer";
    tabRegister.className = "pb-2 text-secondary fw-bold cursor-pointer";

    // Munculkan Login (fade-in)
    formLogin.style.opacity = "1";
    formLogin.style.visibility = "visible";
    formLogin.style.pointerEvents = "auto";

    // Sembunyikan Register (fade-out)
    formRegister.style.opacity = "0";
    formRegister.style.visibility = "hidden";
    formRegister.style.pointerEvents = "none";
  }
}
