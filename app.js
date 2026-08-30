 // ==========================================
// NZN MART - APP + FIREBASE
// ==========================================

import {
    auth,
    googleProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "./firebase.js";


// ==========================================
// TEMPORARY PRODUCTS
// Later these will come from Firestore.
// ==========================================

const products = [
    {
        id: 1,
        name: "Fresh Rice 5 kg",
        category: "Grocery",
        price: 320,
        emoji: "🍚",
        stock: true
    },
    {
        id: 2,
        name: "Fresh Milk 1 L",
        category: "Dairy",
        price: 60,
        emoji: "🥛",
        stock: true
    },
    {
        id: 3,
        name: "Biscuits",
        category: "Snacks",
        price: 40,
        emoji: "🍪",
        stock: true
    },
    {
        id: 4,
        name: "Shampoo",
        category: "Personal Care",
        price: 180,
        emoji: "🧴",
        stock: true
    },
    {
        id: 5,
        name: "Cooking Oil 1 L",
        category: "Grocery",
        price: 145,
        emoji: "🫗",
        stock: true
    },
    {
        id: 6,
        name: "Tea Powder",
        category: "Grocery",
        price: 120,
        emoji: "☕",
        stock: true
    }
];


// ==========================================
// APP STATE
// ==========================================

let cart = [];

let selectedCategory = "All";


// ==========================================
// START APP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    updateCart();

    loadSavedLocation();

    setupDeliveryMethod();

    checkGoogleRedirect();

});


// ==========================================
// CHECK GOOGLE REDIRECT RESULT
// ==========================================

async function checkGoogleRedirect() {

    try {

        const result =
            await getRedirectResult(auth);

        if (result && result.user) {

            const user = result.user;

            updateAccountUI(user);

            alert(
                "Welcome to NZN MART!"
            );

        }

    } catch (error) {

        console.error(
            "Google redirect error:",
            error
        );

        alert(
            "Google login failed. Please try again."
        );

    }

}


// ==========================================
// FIREBASE AUTH STATE
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        updateAccountUI(user);

    } else {

        const accountName =
            document.getElementById(
                "accountName"
            );

        const accountEmail =
            document.getElementById(
                "accountEmail"
            );

        if (accountName) {

            accountName.textContent =
                "Welcome to NZN MART";

        }

        if (accountEmail) {

            accountEmail.textContent =
                "Sign in to continue";

        }

    }

});


// ==========================================
// UPDATE ACCOUNT UI
// ==========================================

function updateAccountUI(user) {

    const accountName =
        document.getElementById(
            "accountName"
        );

    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    if (accountName) {

        accountName.textContent =
            user.displayName ||
            "NZN MART Customer";

    }


    if (accountEmail) {

        accountEmail.textContent =
            user.email || "";

    }

}


// ==========================================
// PRODUCTS
// ==========================================

function loadProducts() {

    const container =
        document.getElementById(
            "products"
        );

    if (!container) return;


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredProducts =
        products.filter(product => {

            const matchesCategory =
                selectedCategory === "All" ||
                product.category ===
                selectedCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    if (
        filteredProducts.length === 0
    ) {

        container.innerHTML = `

            <div class="loading">

                <div
                    style="font-size:45px;"
                >
                    🔎
                </div>

                <p>
                    No products found.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        filteredProducts
            .map(product => {

                return `

                    <div class="product-card">

                        <div class="product-image">
                            ${product.emoji}
                        </div>


                        <div class="product-info">

                            <div
                                class="product-category"
                            >
                                ${escapeHTML(
                                    product.category
                                )}
                            </div>


                            <div
                                class="product-name"
                            >
                                ${escapeHTML(
                                    product.name
                                )}
                            </div>


                            <div
                                class="product-bottom"
                            >

                                <div>

                                    <div
                                        class="product-price"
                                    >
                                        ₹${product.price}
                                    </div>


                                    ${
                                        product.stock
                                        ? ""
                                        : `
                                            <div
                                                class="out-stock"
                                            >
                                                Out of stock
                                            </div>
                                        `
                                    }

                                </div>


                                ${
                                    product.stock
                                    ? `
                                        <button
                                            class="add-button"
                                            onclick="addToCart(${product.id})"
                                        >
                                            +
                                        </button>
                                    `
                                    : ""
                                }

                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ==========================================
// SEARCH
// ==========================================

function searchProducts() {

    loadProducts();

}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterCategory(category) {

    selectedCategory =
        category;


    document
        .querySelectorAll(".category")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    document
        .querySelectorAll(".category")
        .forEach(button => {

            const text =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (
                text.includes(
                    category.toLowerCase()
                )
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    loadProducts();

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (
        !product ||
        !product.stock
    ) {

        alert(
            "This product is unavailable."
        );

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            emoji: product.emoji,

            quantity: 1

        });

    }


    updateCart();

    openCart();

}


// ==========================================
// UPDATE CART
// ==========================================

function updateCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `₹${totalPrice}`;

    }


    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to get started.
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML =
        cart
            .map(item => `

                <div class="cart-item">

                    <div
                        class="cart-item-image"
                    >
                        ${item.emoji}
                    </div>


                    <div
                        class="cart-item-info"
                    >

                        <h4>
                            ${escapeHTML(
                                item.name
                            )}
                        </h4>


                        <div
                            class="cart-item-price"
                        >
                            ₹${item.price}
                        </div>


                        <div
                            class="quantity-controls"
                        >

                            <button
                                onclick="changeQuantity(${item.id}, -1)"
                            >
                                −
                            </button>


                            <strong>
                                ${item.quantity}
                            </strong>


                            <button
                                onclick="changeQuantity(${item.id}, 1)"
                            >
                                +
                            </button>


                            <button
                                onclick="removeFromCart(${item.id})"
                                style="margin-left:auto;"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                </div>

            `)
            .join("");

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                product =>
                    product.id !==
                    productId
            );

    }


    updateCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    updateCart();

}


// ==========================================
// CART PANEL
// ==========================================

function openCart() {

    const panel =
        document.getElementById(
            "cartPanel"
        );


    if (panel) {

        panel.classList.add(
            "open"
        );

    }

}


function closeCart() {

    const panel =
        document.getElementById(
            "cartPanel"
        );


    if (panel) {

        panel.classList.remove(
            "open"
        );

    }

}


// ==========================================
// ACCOUNT PANEL
// ==========================================

function openAccount() {

    const panel =
        document.getElementById(
            "accountPanel"
        );


    if (panel) {

        panel.classList.add(
            "open"
        );

    }

}


function closeAccount() {

    const panel =
        document.getElementById(
            "accountPanel"
        );


    if (panel) {

        panel.classList.remove(
            "open"
        );

    }

}


// ==========================================
// GOOGLE LOGIN
// ==========================================

async function loginWithGoogle() {

    try {

        await signInWithRedirect(
            auth,
            googleProvider
        );

    } catch (error) {

        console.error(
            "Google sign-in error:",
            error
        );


        alert(
            "Google login could not start. Please try again."
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        await signOut(auth);

        alert(
            "You have been signed out."
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        alert(
            "Could not sign out."
        );

    }

}


// ==========================================
// CHECKOUT
// ==========================================

function startCheckout() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    closeCart();


    const modal =
        document.getElementById(
            "checkoutModal"
        );


    if (modal) {

        modal.classList.add(
            "open"
        );

    }


    updateCheckout();

}


function closeCheckout() {

    const modal =
        document.getElementById(
            "checkoutModal"
        );


    if (modal) {

        modal.classList.remove(
            "open"
        );

    }

}


// ==========================================
// CHECKOUT TOTAL
// ==========================================

function updateCheckout() {

    const itemsTotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    const deliveryMethod =
        document.querySelector(
            'input[name="deliveryMethod"]:checked'
        );


    let deliveryFee = 0;


    if (
        deliveryMethod &&
        deliveryMethod.value ===
        "delivery"
    ) {

        deliveryFee = 0;

    }


    const grandTotal =
        itemsTotal +
        deliveryFee;


    const itemsElement =
        document.getElementById(
            "checkoutItems"
        );


    const deliveryElement =
        document.getElementById(
            "deliveryFee"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (itemsElement) {

        itemsElement.textContent =
            `₹${itemsTotal}`;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            deliveryFee === 0
                ? "Free"
                : `₹${deliveryFee}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${grandTotal}`;

    }

}


// ==========================================
// PAYMENT PLACEHOLDER
// ==========================================

function payNow() {

    alert(
        "Secure online payment will be connected after the order system is ready."
    );

}


// ==========================================
// DELIVERY LOCATION
// ==========================================

function selectLocation() {

    const location =
        prompt(
            "Enter your delivery location:"
        );


    if (!location) return;


    localStorage.setItem(
        "nznMartLocation",
        location
    );


    const element =
        document.getElementById(
            "deliveryLocation"
        );


    if (element) {

        element.textContent =
            location;

    }

}


function loadSavedLocation() {

    const location =
        localStorage.getItem(
            "nznMartLocation"
        );


    const element =
        document.getElementById(
            "deliveryLocation"
        );


    if (
        location &&
        element
    ) {

        element.textContent =
            location;

    }

}


// ==========================================
// NAVIGATION
// ==========================================

function goHome() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


function showAllProducts() {

    selectedCategory =
        "All";


    const search =
        document.getElementById(
            "searchInput"
        );


    if (search) {

        search.value = "";

    }


    loadProducts();


    document
        .querySelector(
            ".products-section"
        )
        ?.scrollIntoView({

            behavior: "smooth"

        });

}


function showAllCategories() {

    alert(
        "More categories will be connected to the store database."
    );

}


function showOffers() {

    alert(
        "Offers will be loaded from the store database."
    );

}


function openOrders() {

    alert(
        "Real order history will be connected to Firestore."
    );

}


function openAddresses() {

    alert(
        "Saved addresses will be connected to your account."
    );

}


function openSettings() {

    alert(
        "Account settings will be added later."
    );

}


// ==========================================
// DELIVERY METHOD
// ==========================================

function setupDeliveryMethod() {

    document.addEventListener(
        "change",
        event => {

            if (
                event.target.name ===
                "deliveryMethod"
            ) {

                updateCheckout();

            }

        }
    );

}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================

window.loadProducts =
    loadProducts;

window.searchProducts =
    searchProducts;

window.filterCategory =
    filterCategory;

window.addToCart =
    addToCart;

window.updateCart =
    updateCart;

window.changeQuantity =
    changeQuantity;

window.removeFromCart =
    removeFromCart;

window.openCart =
    openCart;

window.closeCart =
    closeCart;

window.openAccount =
    openAccount;

window.closeAccount =
    closeAccount;

window.loginWithGoogle =
    loginWithGoogle;

window.logoutUser =
    logoutUser;

window.startCheckout =
    startCheckout;

window.closeCheckout =
    closeCheckout;

window.payNow =
    payNow;

window.selectLocation =
    selectLocation;

window.goHome =
    goHome;

window.showAllProducts =
    showAllProducts;

window.showAllCategories =
    showAllCategories;

window.showOffers =
    showOffers;

window.openOrders =
    openOrders;

window.openAddresses =
    openAddresses;

window.openSettings =
    openSettings;
