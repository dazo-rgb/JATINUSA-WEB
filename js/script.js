// =========================================================
// 1. DATA KATALOG PRODUK
// =========================================================
const masterProducts = [
  { id: 101, name: "Dining Table", desc: "Meja makan kayu jati desain minimalis.", price: 7500000, img: "images/dining-table.jpg" },
  { id: 102, name: "Coffee Table", desc: "Meja tamu elegan dan fungsional.", price: 3500000, img: "images/coffee-table.jpg" },
  { id: 103, name: "Bed Frame", desc: "Rangka tempat tidur kuat & tahan lama.", price: 9000000, img: "images/bed.jpg" },
  { id: 104, name: "Wardrobe", desc: "Lemari pakaian luas dan elegan.", price: 8500000, img: "images/wardrobe.jpg" },
  { id: 105, name: "TV Cabinet", desc: "Kabinet TV dengan laci penyimpanan.", price: 6000000, img: "images/tv-cabinet.jpg" },
  { id: 106, name: "Kursi Jati Klasik", desc: "Kursi kayu jati yang kokoh dan nyaman.", price: 1500000, img: "images/workshop.jpg" },
];

// Fungsi Bantuan: Format Angka ke Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
}

// =========================================================
// 2. LOGIKA KERANJANG BELANJA (E-COMMERCE)
// =========================================================

function getCart() {
  let cartData = localStorage.getItem("jatinusa_cart");
  return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
  localStorage.setItem("jatinusa_cart", JSON.stringify(cart));
  updateCartBadge();
}

// Membuka / Menutup Panel Keranjang (Dengan Efek Smooth Animation)
function toggleCartPanel() {
  const collapseElement = document.getElementById("collapseCart");
  if (collapseElement) {
    // Gunakan API bawaan Bootstrap untuk memicu animasi secara halus
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement);
    bsCollapse.toggle();

    // Render ulang isi keranjang saat animasi berjalan
    renderCart();
  }
}

function renderProducts() {
  const container = document.getElementById("dynamicProductContainer");
  if (!container) return;

  container.innerHTML = "";
  masterProducts.forEach((prod) => {
    container.innerHTML += `
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card h-100 border-0 shadow-sm bg-warm-white">
          <img src="${prod.img}" class="card-img-top rounded-top-3 w-100" style="object-fit: cover; aspect-ratio: 4/3" alt="${prod.name}" onerror="this.src='images/workshop.jpg'">
          <div class="card-body text-center p-4 d-flex flex-column">
            <h5 class="card-title fw-bold">${prod.name}</h5>
            <p class="card-text text-secondary small flex-grow-1">${prod.desc}</p>
            <h6 class="fw-bold mb-3 text-dark-brown">${formatRupiah(prod.price)}</h6>
            <button class="btn btn-jatinusa w-100 fw-bold shadow-sm" onclick="addToCart(${prod.id})">
              + Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function addToCart(id) {
  let cart = getCart();
  const product = masterProducts.find((p) => p.id === id);

  if (!product) return;

  const existingItemIndex = cart.findIndex((item) => item.id === id);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  alert(`"${product.name}" berhasil ditambahkan ke keranjang!`);

  // Jika panel sedang terbuka (show), render ulang agar data update langsung
  const panel = document.getElementById("collapseCart");
  if (panel && panel.classList.contains("show")) {
    renderCart();
  }
}

// Render Isi Keranjang
function renderCart() {
  const cartContainer = document.getElementById("cartItemContainer");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartContainer || !cartTotal) return;

  const cart = getCart();
  cartContainer.innerHTML = "";
  let grandTotal = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="text-center text-secondary py-5 bg-light rounded-4 border border-dashed">
        <h6 class="mb-0">🛒 Keranjang Anda masih kosong.</h6>
      </div>`;
    cartTotal.innerText = "Rp 0";
    return;
  }

  cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    grandTotal += subtotal;

    cartContainer.innerHTML += `
      <div class="card border-0 shadow-sm rounded-4 mb-2 overflow-hidden bg-white">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            
            <div class="d-flex align-items-center gap-3">
              <img src="${item.img}" class="rounded-3 shadow-sm border" style="width: 80px; height: 80px; object-fit: cover;" alt="${item.name}" onerror="this.src='images/workshop.jpg'">
              <div>
                <h6 class="fw-bold mb-1 text-dark-brown fs-6">${item.name}</h6>
                <p class="text-secondary small mb-0">${formatRupiah(item.price)}</p>
              </div>
            </div>

            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-2 mt-md-0 border-top border-md-none pt-3 pt-md-0">
              
              <div class="btn-group btn-group-sm shadow-sm" role="group">
                <button class="btn btn-outline-secondary px-3" onclick="updateQty(${item.id}, -1)">-</button>
                <button class="btn btn-light border px-3" disabled><b class="text-dark">${item.qty}</b></button>
                <button class="btn btn-outline-secondary px-3" onclick="updateQty(${item.id}, 1)">+</button>
              </div>

              <div class="fw-bold text-dark-brown text-end d-none d-md-block" style="width: 120px;">
                ${formatRupiah(subtotal)}
              </div>

              <button class="btn btn-outline-danger btn-sm px-3 shadow-sm" onclick="removeFromCart(${item.id})">
                Hapus
              </button>
              
              <div class="w-100 text-end fw-bold text-dark-brown d-block d-md-none mt-1">
                Total: ${formatRupiah(subtotal)}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = formatRupiah(grandTotal);
}

function updateQty(id, change) {
  let cart = getCart();
  const index = cart.findIndex((item) => item.id === id);

  if (index !== -1) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalItems > 0) {
    badge.innerText = totalItems;
    badge.classList.remove("d-none");
  } else {
    badge.classList.add("d-none");
  }
}

function checkoutCart() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Keranjang masih kosong! Silakan pilih produk terlebih dahulu.");
    return;
  }

  let pesan = "Halo Jatinusa,\n\nSaya ingin memesan produk berikut dari keranjang belanja:\n\n";
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    grandTotal += subtotal;
    pesan += `${index + 1}. ${item.name} - ${item.qty} pcs (${formatRupiah(subtotal)})\n`;
  });

  pesan += `\n*TOTAL PESANAN: ${formatRupiah(grandTotal)}*\n\nMohon informasi mengenai prosedur pembayaran dan pengiriman. Terima kasih.`;

  localStorage.removeItem("jatinusa_cart");
  window.location.href = "contact.html?pesan=" + encodeURIComponent(pesan);
}

// =========================================================
// 3. LOGIKA BAWAAN JATINUSA (ESTIMATOR & LOGIN)
// =========================================================

function calculateEstimation() {
  const jenis = document.getElementById("jenis");
  const ukuran = document.getElementById("ukuran");
  const finishing = document.getElementById("finishing");
  const hasilEstimasi = document.getElementById("hasilEstimasi");

  if (!jenis || !ukuran || !finishing || !hasilEstimasi) return;

  let basePrice = 0;
  if (jenis.value === "Dining Table") basePrice = 7500000;
  else if (jenis.value === "Bed Frame") basePrice = 9000000;
  else if (jenis.value === "TV Cabinet") basePrice = 6000000;
  else if (jenis.value === "Wardrobe") basePrice = 8500000;
  else basePrice = 3500000;

  if (ukuran.value === "Large (200 x 100 cm)") basePrice += 1500000;
  else if (ukuran.value === "Small (100 x 60 cm)") basePrice -= 1000000;

  if (finishing.value === "Glossy") basePrice += 500000;
  else if (finishing.value === "Rustic") basePrice += 750000;

  hasilEstimasi.innerText = formatRupiah(basePrice);
}

function redirectToContact() {
  const jenis = document.getElementById("jenis").value;
  const ukuran = document.getElementById("ukuran").value;
  const finishing = document.getElementById("finishing").value;
  const hasilEstimasi = document.getElementById("hasilEstimasi").innerText;

  const pesan = `Halo Jatinusa,\n\nSaya ingin request custom furniture:\n- Jenis: ${jenis}\n- Ukuran: ${ukuran}\n- Finishing: ${finishing}\n- Estimasi Harga: ${hasilEstimasi}\n\nMohon infonya.`;
  window.location.href = "contact.html?pesan=" + encodeURIComponent(pesan);
}

function switchTab(tab) {
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");

  if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;

  if (tab === "register") {
    tabRegister.className = "pb-2 border-bottom border-dark border-3 text-dark-brown fw-bold cursor-pointer";
    tabLogin.className = "pb-2 text-secondary me-4 fw-bold cursor-pointer";
    formRegister.style.opacity = "1";
    formRegister.style.visibility = "visible";
    formRegister.style.pointerEvents = "auto";
    formLogin.style.opacity = "0";
    formLogin.style.visibility = "hidden";
    formLogin.style.pointerEvents = "none";
  } else {
    tabLogin.className = "pb-2 border-bottom border-dark border-3 text-dark-brown me-4 fw-bold cursor-pointer";
    tabRegister.className = "pb-2 text-secondary fw-bold cursor-pointer";
    formLogin.style.opacity = "1";
    formLogin.style.visibility = "visible";
    formLogin.style.pointerEvents = "auto";
    formRegister.style.opacity = "0";
    formRegister.style.visibility = "hidden";
    formRegister.style.pointerEvents = "none";
  }
}

// =========================================================
// INISIALISASI SAAT HALAMAN DIMUAT
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartBadge();

  const urlParams = new URLSearchParams(window.location.search);
  const pesanDariURL = urlParams.get("pesan");
  if (pesanDariURL) {
    const pesanInput = document.getElementById("pesanInput");
    if (pesanInput) pesanInput.value = pesanDariURL;
  }
});

function addEstimatorToCart() {
  const jenis = document.getElementById("jenis");
  const ukuran = document.getElementById("ukuran");
  const finishing = document.getElementById("finishing");
  const hasilEstimasi = document.getElementById("hasilEstimasi");

  if (!jenis || !ukuran || !finishing || !hasilEstimasi) return;

  const priceRaw = parseInt(hasilEstimasi.innerText.replace(/[^0-9]/g, ""), 10);
  const customId = new Date().getTime();

  const customProduct = {
    id: customId,
    name: `Custom ${jenis.value}`,
    desc: `Ukuran: ${ukuran.value} | Finishing: ${finishing.value}`,
    price: priceRaw,
    img: "images/custom.jpg",
    qty: 1,
  };

  let cart = getCart();
  cart.push(customProduct);
  saveCart(cart);

  alert(`Pesanan custom "${customProduct.name}" berhasil ditambahkan ke keranjang!`);
}
