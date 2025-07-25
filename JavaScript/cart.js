let cart = [];
let products = [];
let totalPrice = document.getElementById("total_price");
let cartCounter = document.getElementById("cart-counter");
let cartItemsCount = document.getElementById("cart_counts");
const cartTextElements = document.querySelectorAll(".cart_products");
const btnControl = document.querySelector(".btn_control");
const cartTotal = document.querySelector(".cart_total");
let promoDiscount = 0;

function applyPromoCode() {
    const codeInput = document.getElementById("code").value.trim().toUpperCase();

    if (codeInput === "ROYCE200") {
        promoDiscount = 200;
        alert("Promo code applied! Rs. 200 off.");
    } else {
        promoDiscount = 0;
        alert("Invalid promo code.");
    }

    checkCart(); // refresh totals
}


loadCart();
getData();
checkCart();

async function getData() {
    let response = await fetch('https://royce-server-production.up.railway.app//api/products');
    let json = await response.json();
    products = json;
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1, size = "") {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.productId === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            size: size
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const checkoutData = {
        items: cart.map(item => {
            const product = JSON.parse(localStorage.getItem("allProducts") || "[]")
                .find(p => p.id === item.productId);
            return {
                productId: item.productId,
                name: product?.name || "Product",
                image: product?.images?.[0] || "",
                price: product?.price || 0,
                quantity: item.quantity,
                size: item.size
            };
        })
    };
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Force UI update after cart change
    checkCart();
}



function addCartToHTML() {
    let content = ``;
    let allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");

    cart.forEach((cartItem, index) => {
        let product = allProducts.find(p => p.id === cartItem.productId);

        if (!product) return; // skip if not found

        let price = parseFloat(product.price);
        let totalProductPrice = price * cartItem.quantity;

        content += `
        <div class="cart_product">
            <div class="cart_product_img">  
                <img src="${product.images[0]}" alt="product">
            </div>
            <div class="cart_product_info">  
                <div class="top_card">
                    <div class="left_card">
                        <h4 class="product_name">${product.name}</h4>
                        <span class="product_price">Rs. ${price}</span>
                    </div>
                    <div class="remove_product" onclick="removeFromCart(${index})">
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
                <div class="buttom_card">
                    <div class="counts">
                        <button class="counts_btns minus" onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" name="productCount" min="1" max="999"
                            class="product_count" value="${cartItem.quantity}">
                        <button class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="total_price">Rs. ${totalProductPrice.toFixed(2)}</span>
                </div>
                <div class="size_tag">Size: ${cartItem.size || "N/A"}</div>
            </div>
        </div>`;
    });

    cartTextElements.forEach(element => {
        element.innerHTML = content;
    });
}
async function getData() {
    let response = await fetch('https://royce-server-production.up.railway.app//api/products');
    let json = await response.json();
    products = json;
    localStorage.setItem("allProducts", JSON.stringify(products));
}


function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    checkCart();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    checkCart(); // Recalculate total
}


function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    saveCart();
    checkCart();
}

function updateTotalPrice() {
    let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

    let total = cart.reduce((sum, item) => {
        const product = allProducts.find(p => p.id === item.productId);
        if (!product) return sum; // skip if not found

        let price = parseFloat(product.price);
        return sum + (price * item.quantity);
    }, 0);

    totalPrice.innerHTML = `Rs. ${total.toFixed(2)}`;
    localStorage.setItem("total price", total + 70);
    return total;
}


function checkCart() {
    if (cart.length === 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Your cart is empty";
        });
        cartCounter.innerHTML = 0;
        btnControl.style.display = "none";
        cartTotal.style.display = "none";
        checkCartPage(0, 0);
    } else {
        cartTextElements.forEach(element => {
            element.classList.remove("empty");
        });
        addCartToHTML();
        let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
        cartCounter.innerHTML = totalQuantity;
        btnControl.style.display = "flex";
        cartTotal.style.display = "flex";
        let total = updateTotalPrice();
        checkCartPage(total, totalQuantity);
    }
}

function checkCartPage(total, totalQuantity) {
    if (window.location.pathname.includes("cartPage.html")) {
        if (cart.length === 0) {
            cartItemsCount.innerHTML = `(0 items)`;
            document.getElementById("Subtotal").innerHTML = `Rs. 0.00`;
            document.getElementById("total_order").innerHTML = `Rs. 0.00`;
        } else {
            cartItemsCount.innerHTML = `(${totalQuantity} items)`;
            displayInCartPage(total);
        }
    }
}

function displayInCartPage(total) {
    let shippingFee = total <= 3000 ? 300 : 0;
    let discount = promoDiscount; // Rs. 200 if code applied
    let finalTotal = total + shippingFee - discount;

    document.getElementById("Subtotal").innerHTML = `Rs. ${total.toFixed(2)}`;
    document.getElementById("total_order").innerHTML = `Rs. ${finalTotal.toFixed(2)}`;
    document.getElementById("Discount").innerHTML = `Rs. ${discount.toFixed(2)}`;
    document.getElementById("Delivery").innerHTML = shippingFee === 0 ? "Free" : `Rs. ${shippingFee.toFixed(2)}`;

}


function checkOut() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

    const itemsWithDetails = cartItems.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        if (!product) return null; // skip if invalid

        return {
            productId: item.productId,
            name: product.name,
            price: Number(product.price),
            quantity: item.quantity,
            image: product.images?.[0] || "",
            size: item.size || "N/A"
        };
    }).filter(Boolean); // remove nulls

    const subtotal = itemsWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal <= 3000 && subtotal > 0 ? 300 : 0;
    const discount = promoDiscount || 0;
    const total = subtotal + shipping - discount;


    const orderInfo = {
        items: itemsWithDetails,
        totalPrice: total,
        shippingFee: shipping,
        discount: discount
    };


    localStorage.setItem('checkoutData', JSON.stringify(orderInfo));

    // Navigate only if cart isn't empty
    localStorage.removeItem('cart');
    cart = [];
    checkCart(); // re-render UI immediately
    if (itemsWithDetails.length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert("Your cart is empty!");
    }
}

document.querySelector(".apply_code button").addEventListener("click", applyPromoCode);
