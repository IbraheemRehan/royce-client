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

    if (cartItemsContainer && Array.isArray(items)) {
      cartItemsContainer.innerHTML = items
        .map((item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          const total = price * quantity;
          productTotal += total;
          const imageSrc = item.image || (Array.isArray(item.images) ? item.images[0] : "");

          const size = item.size || "N/A";

          return `
            <div class="checkout-item">
              <img src="${imageSrc}" alt="${item.name}" class="checkout-img" />
              <div class="checkout-info">
                <p class="checkout-name">${item.name}</p>
                <p class="checkout-size">Size: ${size}</p>
                <p class="checkout-qty">Qty: ${quantity}</p>
                <p class="checkout-price">Total: PKR ${total.toFixed(2)}</p>
              </div>
            </div>
          `;
        })
        .join("");

      const deliveryFee = productTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
      const discount = data.discount || 0;
      const finalTotal = productTotal + deliveryFee - discount;


      if (productTotalEl) productTotalEl.textContent = `PKR ${productTotal.toFixed(2)}`;
      if (deliveryFeeEl) deliveryFeeEl.textContent = `PKR ${deliveryFee}`;
      if (finalTotalEl) finalTotalEl.textContent = `PKR ${finalTotal.toFixed(2)}`;
      if (orderTotalEl) orderTotalEl.textContent = `PKR ${finalTotal.toFixed(2)}`;
      if (checkoutTotalEl) checkoutTotalEl.textContent = `${finalTotal.toFixed(2)}`;


      //  Show discount on checkout if needed
      const discountEl = document.getElementById("discountAmount");
      if (discountEl) {
        discountEl.textContent = `PKR ${discount.toFixed(2)}`;
      }


      // Store updated values in localStorage
      localStorage.setItem(
        "checkoutData",
        JSON.stringify({ ...data, totalPrice: finalTotal, discount })
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

  // Prepare order payload with size
  const orderPayload = {
    customerName: name,
    email,
    phone,
    paymentMethod,
    totalPrice: Number(data.totalPrice?.toString().replace(/[^0-9.-]+/g, "") || 0),
    discount: data.discount || 0, //  include discount here
    items: data.items.map(item => ({
      productId: item.productId || "unknown",
      name: item.name,
      size: item.size || "N/A",
      quantity: item.quantity,
      price: Number(item.price?.toString().replace(/[^0-9.-]+/g, "") || 0)
    })),
    address: {
      shipping: shippingAddress,
      billing: billingAddress
    }
  };
  console.log(orderPayload);

  try {
    const response = await fetch("https://royce-server-production.up.railway.app/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderPayload),
      mode: "cors"
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Order error:", response.status, data); //  error log
      alert("Order failed: " + data?.error || "Unknown error");
    } else {
      console.log("Order success:", data);
      alert("Order placed successfully!");
    }
  } catch (err) {
    console.error("Order fetch failed:", err); //  network errors or CORS failures
    alert("Network error: Could not reach server");
  }

});

function closeCheckout() {
  window.location.href = "index.html";
}

console.log("🧠 localStorage.cart:", localStorage.getItem("cart"));
