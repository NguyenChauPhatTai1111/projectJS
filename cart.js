const CART_KEY = "cart";

function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


function addToCart(product, quantity = 1) {

    const cart = getCart();

    quantity = Number(quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        quantity = 1;
    }


    const existingProduct = cart.find(
        item =>
            String(item.id) === String(product.id)
    );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity) + quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            image: product.image,

            quantity: quantity

        });

    }


    // Lưu giỏ hàng
    saveCart(cart);


    // Cập nhật số lượng trên header
    updateCartCount();


    alert("Đã thêm sản phẩm vào giỏ hàng!");
}


function updateCartCount() {

    const cart = getCart();

    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.quantity),
        0
    );


    const cartCount =
        document.getElementById("cart-count");


    if (cartCount) {

        cartCount.textContent = total;

    }
}
// ============================
// FORMAT PRICE
// ============================

function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN") + "₫";
}


// ============================
// UPDATE CART COUNT
// ============================

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((total, item) => {
        return total + Number(item.quantity);
    }, 0);

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


// ============================
// RENDER CART
// ============================

function renderCart() {

    const cart = getCart();

    const emptyCart = document.getElementById("empty-cart");
    const cartContent = document.getElementById("cart-content");
    const cartItemsList = document.getElementById("cart-items-list");

    if (cart.length === 0) {

        emptyCart.style.display = "block";
        cartContent.style.display = "none";

        updateCartCount();

        return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "grid";


    cartItemsList.innerHTML = "";


    cart.forEach((item) => {

        const itemTotal =
            Number(item.price) * Number(item.quantity);


        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `

            <div class="product-info">

                <img
                    src="${item.image || "./placeholder.jpg"}"
                    alt="${item.name}"
                    class="product-image"
                >

                <div>
                    <div class="product-name">
                        ${item.name}
                    </div>
                </div>

            </div>


            <div class="product-price">
                ${formatPrice(item.price)}
            </div>


            <div class="quantity">

                <button
                    type="button"
                    onclick="decreaseQuantity('${item.id}')"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    type="button"
                    onclick="increaseQuantity('${item.id}')"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">
                <strong>
                    ${formatPrice(itemTotal)}
                </strong>
            </div>


            <button
                type="button"
                class="remove-btn"
                onclick="removeFromCart('${item.id}')"
                title="Xóa sản phẩm"
            >
                ×
            </button>

        `;


        cartItemsList.appendChild(itemElement);
    });


    updateSummary();

    updateCartCount();
}


// ============================
// INCREASE
// ============================

function increaseQuantity(id) {

    const cart = getCart();

    const item = cart.find(
        item => String(item.id) === String(id)
    );

    if (!item) {
        return;
    }

    item.quantity++;

    saveCart(cart);

    renderCart();
}


// ============================
// DECREASE
// ============================

function decreaseQuantity(id) {

    const cart = getCart();

    const item = cart.find(
        item => String(item.id) === String(id)
    );

    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        const newCart = cart.filter(
            item => String(item.id) !== String(id)
        );

        saveCart(newCart);

    } else {

        saveCart(cart);
    }


    renderCart();
}


// ============================
// REMOVE
// ============================

function removeFromCart(id) {

    const cart = getCart();

    const newCart = cart.filter(
        item => String(item.id) !== String(id)
    );

    saveCart(newCart);

    renderCart();
}


// ============================
// CLEAR CART
// ============================

function clearCart() {

    const cart = getCart();

    if (cart.length === 0) {
        return;
    }


    const confirmed = confirm(
        "Bạn có chắc muốn xóa toàn bộ giỏ hàng?"
    );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(CART_KEY);

    renderCart();
}


// ============================
// SUMMARY
// ============================

function updateSummary() {

    const cart = getCart();


    const subtotal = cart.reduce((total, item) => {

        return total +
            Number(item.price) *
            Number(item.quantity);

    }, 0);


    const shipping = subtotal > 0 ? 30000 : 0;

    const total = subtotal + shipping;


    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);


    document.getElementById("shipping").textContent =
        formatPrice(shipping);


    document.getElementById("total").textContent =
        formatPrice(total);
}


// ============================
// CHECKOUT
// ============================

function checkout() {

    const cart = getCart();


    if (cart.length === 0) {

        alert("Giỏ hàng đang trống.");

        return;
    }


    alert(
        "Chức năng thanh toán sẽ được triển khai sau."
    );
}


// ============================
// EVENTS
// ============================

document
    .getElementById("clear-cart-btn")
    .addEventListener("click", clearCart);


document
    .getElementById("checkout-btn")
    .addEventListener("click", checkout);


// ============================
// INIT
// ============================

renderCart();