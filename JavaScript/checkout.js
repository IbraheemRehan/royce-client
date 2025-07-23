document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("checkoutCartItems");
  const orderTotalEl = document.getElementById("orderTotal");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const productTotalEl = document.getElementById("productTotal");
  const deliveryFeeEl = document.getElementById("deliveryFee");
  const finalTotalEl = document.getElementById("finalTotal");
  const FREE_DELIVERY_THRESHOLD = 3000;
  const DELIVERY_FEE = 300;


  const data = JSON.parse(localStorage.getItem("checkoutData"));
  console.log("Checkout data:", data);

if (data) {
  const { items } = data;

  let productTotal = 0;

  // Render cart items and calculate total
  if (cartItemsContainer && Array.isArray(items)) {
    cartItemsContainer.innerHTML = items
      .map((item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const total = price * quantity;

        productTotal += total;

        const imageSrc = item.image || (item.images?.[0] || "");

        return `
          <div class="checkout-item">
            <img src="${imageSrc}" alt="${item.name}" class="checkout-img" />
            <div class="checkout-info">
              <p class="checkout-name">${item.name}</p>
              <p class="checkout-qty">Qty: ${quantity}</p>
              <p class="checkout-price">Total: PKR ${total.toFixed(2)}</p>
            </div>
          </div>
        `;
      })
      .join("");

    // Determine delivery fee
    const deliveryFee = productTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const finalTotal = productTotal + deliveryFee;

    // Update DOM
    if (productTotalEl) productTotalEl.textContent = `PKR ${productTotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `PKR ${deliveryFee}`;
    if (finalTotalEl) finalTotalEl.textContent = `PKR ${finalTotal.toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.textContent = `PKR ${finalTotal.toFixed(2)}`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = `${finalTotal.toFixed(2)}`;

    // Store updated total in localStorage for use during checkout
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({ ...data, totalPrice: finalTotal })
    );
  }
}
});

document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = JSON.parse(localStorage.getItem("checkoutData"));
  if (!data || !data.items || data.items.length === 0) {
    alert("Cart is empty. Please add items.");
    return;
  }

  // Get values from form
  const email = document.getElementById("email")?.value;
  const phone = document.getElementById("phone")?.value;
  const firstName = document.getElementById("firstName")?.value;
  const lastName = document.getElementById("lastName")?.value;
  const address = document.getElementById("address")?.value;
  const city = document.getElementById("city")?.value;
  const province = document.getElementById("province")?.value;
  const postalCode = document.getElementById("postalCode")?.value;

  const name = `${firstName} ${lastName}`;
  const shippingAddress = `${address}, ${city}, ${province}, ${postalCode}`;

  const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const billingChoice = document.querySelector('input[name="billingAddress"]:checked')?.value;
  let billingAddress = shippingAddress;

  if (!paymentRadio) {
    alert("Please select a payment method.");
    return;
  }

  const paymentMethod = paymentRadio.value;

  if (billingChoice === "different") {
    const billingAddr = document.getElementById("billingAddress")?.value;
    const billingCity = document.getElementById("billingCity")?.value;
    const billingProvince = document.getElementById("billingProvince")?.value;
    const billingPostalCode = document.getElementById("billingPostalCode")?.value;

    billingAddress = `${billingAddr}, ${billingCity}, ${billingProvince}, ${billingPostalCode}`;
    if (!billingAddr || !billingCity || !billingProvince) {
      alert("Please complete your billing address.");
      return;
    }
  }

  if (!email || !phone || !firstName || !lastName || !address || !city || !province || !paymentMethod) {
    alert("Please fill all required fields.");
    return;
  }

  // Prepare order data
  // Prepare order data
  const orderPayload = {
    customerName: name,
    email,
    phone,
    paymentMethod,
    totalPrice: Number(data.totalPrice?.toString().replace(/[^0-9.-]+/g, "") || 0),
    items: data.items.map(item => ({
      productId: item.productId || "unknown", // fallback to avoid schema error
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price?.toString().replace(/[^0-9.-]+/g, "") || 0)
    })),
    address: {
      shipping: shippingAddress,
      billing: billingAddress
    }
  };




  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const res = await response.json();
      alert(res.error || "Failed to place order.");
      return;
    }

    alert("Order placed successfully! Confirmation sent to your email.");

    // Clear cart
    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutData");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Order error:", error);
    alert("Something went wrong. Please try again later.");
  }
});

function closeCheckout() {
  window.location.href = "index.html";
}
