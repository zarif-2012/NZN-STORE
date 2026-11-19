
import { supabase } from "./supabase.js";

// =====================================
// NZN MART V2 — SUPABASE APPLICATION
// =====================================

const $ = (id) => document.getElementById(id);

let products = [];
let shops = [];
let categories = [];
let cart = loadCart();
let selectedCategory = "all";
let searchTerm = "";
let currentUser = null;
let isSignup = false;

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(value || 0));

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function safeURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function loadCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("nzn_mart_cart") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(
    "nzn_mart_cart",
    JSON.stringify(cart)
  );
}

function showMessage(id, message) {
  const element = $(id);
  if (element) element.textContent = message;
}

// =====================================
// INITIALIZATION
// =====================================

document.addEventListener("DOMContentLoaded", async () => {
  $("currentYear").textContent = new Date().getFullYear();

  setupEvents();
  updateCart();

  await loadMarketplace();

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Session error:", error.message);
  }

  currentUser = data?.session?.user || null;
  updateAccountButton();

  supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAccountButton();

    if (event === "SIGNED_IN") {
      closeModal("authModal");
    }
  });
});

// =====================================
// MARKETPLACE DATA
// =====================================

async function loadMarketplace() {
  showMessage("productMessage", "Loading products...");
  showMessage("shopMessage", "Loading local shops...");

  await Promise.all([
    loadCategories(),
    loadProducts(),
    loadShops()
  ]);
}

async function loadCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Categories:", error.message);
    categories = [];
    return;
  }

  categories = data || [];
}

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      shop_id,
      category_id,
      name,
      description,
      unit,
      price,
      stock_quantity,
      image_url,
      shops!products_shop_id_fkey (
        id,
        name,
        address_line,
        area,
        city,
        maps_url
      )
    `)
    .eq("is_active", true)
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products:", error.message);
    products = [];

    showMessage(
      "productMessage",
      "Unable to load products. Please try again later."
    );

    renderProducts();
    return;
  }

  products = (data || []).filter(
    product => product.shops
  );

  renderProducts();
}

async function loadShops() {
  const { data, error } = await supabase
    .from("shops")
    .select(`
      id,
      name,
      owner_name,
      description,
      phone,
      address_line,
      area,
      city,
      state,
      postal_code,
      maps_url,
      status
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Shops:", error.message);
    shops = [];

    showMessage(
      "shopMessage",
      "Unable to load local shops."
    );

    renderShops();
    return;
  }

  shops = data || [];
  renderShops();
}

// =====================================
// PRODUCT DISPLAY
// =====================================

function getFilteredProducts() {
  return products.filter(product => {
    const categoryMatches =
      selectedCategory === "all" ||
      product.category_id === selectedCategory;

    const text = [
      product.name,
      product.description,
      product.shops?.name
    ].join(" ").toLowerCase();

    const searchMatches =
      text.includes(searchTerm.toLowerCase());

    return categoryMatches && searchMatches;
  });
}

function renderProducts() {
  const grid = $("productGrid");
  const filtered = getFilteredProducts();

  if (!filtered.length) {
    grid.innerHTML = "";

    showMessage(
      "productMessage",
      products.length
        ? "No matching products found. Try another search."
        : "No products available yet. Local shops will appear here after their products are added."
    );

    return;
  }

  showMessage(
    "productMessage",
    `${filtered.length} product(s) available`
  );

  grid.innerHTML = filtered.map(product => {
    const image = safeURL(product.image_url);
    const shop = product.shops;

    const address = [
      shop.address_line,
      shop.area,
      shop.city
    ].filter(Boolean).join(", ");

    const map = safeURL(shop.maps_url);

    return `
      <article class="product-card">

        ${
          image
            ? `<img
                class="product-image"
                src="${escapeHTML(image)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
                onerror="this.style.display='none'">`
            : `<div class="product-image"
                style="display:grid;place-items:center;font-size:55px">
                🛒
              </div>`
        }

        <div class="product-info">

          <h3>${escapeHTML(product.name)}</h3>

          <p>${escapeHTML(product.description || "Local shop product")}</p>

          <div class="product-price">
            ${money(product.price)}
          </div>

          <div class="product-stock">
            ${Number(product.stock_quantity)} available
          </div>

          <div class="product-shop">
            🏪 ${escapeHTML(shop.name)}
            <p>${escapeHTML(address)}</p>

            ${
              map
                ? `<a href="${escapeHTML(map)}"
                     target="_blank"
                     rel="noopener noreferrer">
                     📍 View shop on Maps
                   </a>`
                : ""
            }
          </div>

          <button
            class="add-cart-btn"
            data-add="${escapeHTML(product.id)}">
            + Add to Cart
          </button>

        </div>
      </article>
    `;
  }).join("");
}

// =====================================
// SHOP DISPLAY
// =====================================

function renderShops() {
  const grid = $("shopGrid");

  if (!shops.length) {
    grid.innerHTML = "";

    showMessage(
      "shopMessage",
      "No approved shops yet. Be the first local shop to join NZN MART!"
    );

    return;
  }

  showMessage(
    "shopMessage",
    `${shops.length} local shop(s)`
  );

  grid.innerHTML = shops.map(shop => {
    const address = [
      shop.address_line,
      shop.area,
      shop.city,
      shop.state,
      shop.postal_code
    ].filter(Boolean).join(", ");

    const map = safeURL(shop.maps_url);

    return `
      <article class="shop-card">

        <h3>🏪 ${escapeHTML(shop.name)}</h3>

        <p>${escapeHTML(shop.description || "Local neighbourhood shop")}</p>

        <p>📍 ${escapeHTML(address)}</p>

        ${
          shop.phone
            ? `<p>☎ ${escapeHTML(shop.phone)}</p>`
            : ""
        }

        ${
          map
            ? `<a href="${escapeHTML(map)}"
                 target="_blank"
                 rel="noopener noreferrer">
                 Open Google Maps →
               </a>`
            : ""
        }

      </article>
    `;
  }).join("");
}

// =====================================
// CATEGORY FILTER
// =====================================

function setupCategoryEvents() {
  $("categoryGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    const slug = button.dataset.category;

    const category = categories.find(
      item => item.slug === slug
    );

    selectedCategory = category?.id || "invalid";

    document.querySelectorAll(".category-card")
      .forEach(card => card.classList.remove("active"));

    button.classList.add("active");

    renderProducts();

    $("productsSection").scrollIntoView({
      behavior: "smooth"
    });
  });

  $("clearFilterBtn").addEventListener("click", () => {
    selectedCategory = "all";

    document.querySelectorAll(".category-card")
      .forEach(card => card.classList.remove("active"));

    renderProducts();
  });
}

// =====================================
// SEARCH
// =====================================

function setupSearch() {
  $("searchInput").addEventListener("input", event => {
    searchTerm = event.target.value.trim();
    renderProducts();
  });
}

// =====================================
// SHOPPING CART
// =====================================

function addToCart(productId) {
  const product = products.find(
    item => item.id === productId
  );

  if (!product) return;

  const existing = cart.find(
    item => item.id === productId
  );

  if (existing) {
    if (existing.quantity >= product.stock_quantity) {
      alert("Sorry, only the available stock can be added.");
      return;
    }

    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      stock: Number(product.stock_quantity),
      shopName: product.shops?.name || ""
    });
  }

  saveCart();
  updateCart();
}

function changeQuantity(productId, change) {
  const item = cart.find(
    entry => entry.id === productId
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(
      entry => entry.id !== productId
    );
  } else if (item.quantity > item.stock) {
    item.quantity = item.stock;
    alert("Maximum available stock reached.");
  }

  saveCart();
  updateCart();
}

function updateCart() {
  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);

  if (!cart.length) {
    $("cartItems").textContent = "Your cart is empty.";
    return;
  }

  $("cartItems").innerHTML = cart.map(item => `
    <div class="cart-row"
      style="padding:12px 0;border-bottom:1px solid #eee">

      <strong>${escapeHTML(item.name)}</strong>

      <p>${money(item.price)} × ${item.quantity}</p>

      <button data-minus="${escapeHTML(item.id)}">−</button>

      <span>${item.quantity}</span>

      <button data-plus="${escapeHTML(item.id)}">+</button>

      <strong>${money(item.price * item.quantity)}</strong>

    </div>
  `).join("");
}

// =====================================
// AUTHENTICATION
// =====================================

function updateAccountButton() {
  $("accountBtn").textContent = currentUser
    ? "👤 My Account"
    : "👤 Account";
}

function openModal(id) {
  $(id).hidden = false;
}

function closeModal(id) {
  $(id).hidden = true;
}

function updateAuthMode() {
  $("authName").hidden = !isSignup;
  $("authName").required = isSignup;

  $("authSubmitBtn").textContent =
    isSignup ? "Create Account" : "Sign In";

  $("authModeBtn").textContent =
    isSignup
      ? "Already have an account? Sign in"
      : "Create a new account";

  $("authPassword").autocomplete =
    isSignup ? "new-password" : "current-password";

  showMessage("authMessage", "");
}

async function handleAuth(event) {
  event.preventDefault();

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = $("authName").value.trim();

  const button = $("authSubmitBtn");

  button.disabled = true;
  button.textContent = "Please wait...";

  try {
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        showMessage("authMessage", "Account created successfully!");
      } else {
        showMessage(
          "authMessage",
          "Account created. Check your email to confirm your account."
        );
      }

    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage("authMessage", "Signed in successfully!");
    }

  } catch (error) {
    showMessage(
      "authMessage",
      error.message || "Authentication failed."
    );

  } finally {
    button.disabled = false;
    updateAuthMode();
  }
}

// =====================================
// SELLER REGISTRATION
// =====================================

async function registerShop() {
  if (!currentUser) {
    alert("Please sign in before registering your shop.");
    openModal("authModal");
    return;
  }

  const name = prompt("Enter your shop name:");
  if (!name?.trim()) return;

  const address = prompt("Enter your full shop address:");
  if (!address?.trim()) return;

  const area = prompt("Enter your area or locality:");
  if (area === null) return;

  const phone = prompt("Enter your shop phone number (optional):");
  if (phone === null) return;

  const maps = prompt(
    "Paste your Google Maps link (optional):"
  );
  if (maps === null) return;

  const mapsURL = maps.trim() ? safeURL(maps.trim()) : "";

  if (maps.trim() && !mapsURL) {
    alert("Please enter a valid Google Maps URL.");
    return;
  }

  const { error } = await supabase
    .from("shops")
    .insert({
      owner_id: currentUser.id,
      name: name.trim(),
      address_line: address.trim(),
      area: area.trim() || null,
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      country: "India",
      phone: phone.trim() || null,
      maps_url: mapsURL || null,
      status: "pending"
    });

  if (error) {
    alert("Shop registration failed: " + error.message);
    return;
  }

  alert(
    "Your shop application has been submitted! It will appear after admin approval."
  );
}

// =====================================
// EVENTS
// =====================================

function setupEvents() {
  setupCategoryEvents();
  setupSearch();

  $("exploreBtn").addEventListener("click", () => {
    $("productsSection").scrollIntoView({
      behavior: "smooth"
    });
  });

  $("productGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });

  $("cartItems").addEventListener("click", event => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");

    if (plus) changeQuantity(plus.dataset.plus, 1);
    if (minus) changeQuantity(minus.dataset.minus, -1);
  });

  $("cartBtn").addEventListener("click", () => {
    openModal("cartModal");
  });

  $("closeCartBtn").addEventListener("click", () => {
    closeModal("cartModal");
  });

  $("accountBtn").addEventListener("click", async () => {
    if (currentUser) {
      const shouldSignOut = confirm(
        "Do you want to sign out?"
      );

      if (shouldSignOut) {
        const { error } = await supabase.auth.signOut();

        if (error) alert(error.message);
      }

    } else {
      openModal("authModal");
    }
  });

  $("closeAuthBtn").addEventListener("click", () => {
    closeModal("authModal");
  });

  $("authModeBtn").addEventListener("click", () => {
    isSignup = !isSignup;
    updateAuthMode();
  });

  $("authForm").addEventListener("submit", handleAuth);

  $("sellerBtn").addEventListener("click", registerShop);

  $("checkoutBtn").addEventListener("click", () => {
    alert(
      "Online ordering and payment are not activated yet. Your cart is saved on this device."
    );
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.hidden = true;
      }
    });
  });
}
