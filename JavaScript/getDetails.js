const params = new URL(location.href).searchParams;
const productId = params.get('productId');
let quantity = document.getElementById("productCount");
let currentProduct = null;

getData()
async function getData() {
    try {
        let response = await fetch('/api/products');
        let json = await response.json();
        let product = json.find(item => item.id == productId);

        if (product) {
            displayDetails(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching the data', error);
    }
}
function displayDetails(product) {
    currentProduct = product;
    let productDetails = document.getElementsByClassName('productDetails')[0];
    productDetails.setAttribute("data-id", product.id);

    // Handle image rotation
    const imageElement = document.getElementById("product_image");
    let currentImageIndex = 0;

    if (product.images && product.images.length > 0) {
        imageElement.src = product.images[0];

        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % product.images.length;
            imageElement.style.opacity = 0;
            setTimeout(() => {
                imageElement.src = product.images[currentImageIndex];
                imageElement.style.opacity = 1;
            }, 300); // fade out delay
        }, 3000); // rotate every 3 seconds
    }

    // Show product details
    document.querySelector(".category_name").innerHTML = product.category;
    document.querySelector(".product_name").innerHTML = product.name;
    document.querySelector(".product_price").innerHTML = product.price;
    document.querySelector(".product_des").innerHTML = product.description;

    // Populate sizes
    populateSizes(product);

    // Stock logic
    const stockStatus = document.getElementById("stock_status");
    if (product.stock > 0) {
        stockStatus.textContent = "In Stock";
        stockStatus.classList.add("in-stock");
        stockStatus.classList.remove("out-of-stock");
        document.getElementById("btn_add").disabled = false;
    } else {
        stockStatus.textContent = "Out of Stock";
        stockStatus.classList.add("out-of-stock");
        stockStatus.classList.remove("in-stock");
        document.getElementById("btn_add").disabled = true;
    }

    // Add to cart logic
    const linkAdd = document.getElementById("btn_add");
    linkAdd.addEventListener('click', function (event) {
        event.preventDefault();

        const selectedSize = document.getElementById("size_select").value;
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }

        addToCart(product.id, parseInt(quantity.value) || 1, selectedSize);
        showToast();
    });
}


function showToast() {
    const toastOverlay = document.getElementById("toast-overlay");
    toastOverlay.classList.add("show");
    showCheckAnimation();
    setTimeout(() => {
        toastOverlay.classList.remove("show");

        // Redirect to cart page instead of just updating UI
        window.location.href = "cartPage.html";  // <- make sure the filename/path is correct
    }, 1000);
}


function showCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

    let validItems = [];
    let html = "";
    let subtotal = 0;

    for (let item of cart) {
        const product = allProducts.find(p => p.id === item.productId);
        if (!product) continue;

        const itemTotal = Number(product.price) * item.quantity;
        subtotal += itemTotal;
        validItems.push(item);

        html += `
      <div class="cart-item">
        <img src="${product.images[0]}" alt="${product.name}" />
        <div>
          <h3>${product.name}</h3>
          <p>Size: ${item.size}</p>
          <p>Qty: ${item.quantity}</p>
          <p>₹${itemTotal}</p>
        </div>
      </div>
    `;
    }

    const shipping = subtotal > 0 ? (subtotal <= 3000 ? 300 : 0) : 0;
    const total = subtotal + shipping;

    const cartItemsContainer = document.querySelector(".cart-items");
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = html;
    }

    const subtotalElem = document.querySelector(".subtotal");
    const shippingElem = document.querySelector(".shipping");
    const totalElem = document.querySelector(".total");

    if (subtotalElem) {
        subtotalElem.textContent = subtotal > 0 ? `Subtotal: ₹${subtotal}` : "Cart is empty";
    }

    if (shippingElem) {
        shippingElem.textContent = subtotal > 0 ? `Shipping: ₹${shipping}` : "";
    }

    if (totalElem) {
        totalElem.textContent = subtotal > 0 ? `Total: ₹${total}` : "";
    }
}



function showCheckAnimation() {
    const checkIconContainer = document.getElementById('checkIcon');
    checkIconContainer.innerHTML = '';
    const newCheckIcon = document.createElement('div');
    newCheckIcon.style.width = '100px';
    newCheckIcon.style.height = '100px';
    checkIconContainer.appendChild(newCheckIcon);

    lottie.loadAnimation({
        container: newCheckIcon,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'json/Animation check.json'
    });
}
document.getElementById("minus").addEventListener("click", function () {
    let value = parseInt(quantity.value) || 1;
    if (value > 1) {
        quantity.value = value - 1;
    }
});

document.getElementById("plus").addEventListener("click", function () {
    let value = parseInt(quantity.value) || 1;
    if (value < 999) {
        quantity.value = value + 1;
    }
});

// Assuming 'product' is your current product object
const sizeSelect = document.getElementById("size_select");

function populateSizes(product) {
    sizeSelect.innerHTML = '<option value="" disabled selected>Select a size</option>'; // Reset

    if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => {
            const option = document.createElement("option");
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No sizes available";
        option.disabled = true;
        sizeSelect.appendChild(option);
    }
}
// Size chart modal logic
document.addEventListener("DOMContentLoaded", () => {
    const sizeChartBtn = document.getElementById("size_chart_btn");
    const sizeChartModal = document.getElementById("sizeChartModal");
    const closeChart = document.querySelector(".close-chart");

    // Open modal showing all charts
    sizeChartBtn.addEventListener("click", () => {
        sizeChartModal.style.display = "block";
    });


    // Close modal
    closeChart.addEventListener("click", () => {
        sizeChartModal.style.display = "none";
    });


    window.addEventListener("click", (event) => {
        if (event.target === sizeChartModal) {
            sizeChartModal.style.display = "none";
        }
    });
});
document.querySelector('.close-chart').addEventListener('click', function () {
    document.getElementById('sizeChartModal').style.display = 'none';
});

