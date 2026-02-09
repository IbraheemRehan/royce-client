window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollBtn").style.display = "block";
    } else {
        document.getElementById("scrollBtn").style.display = "none";
    }
}

document.getElementById("scrollBtn").addEventListener("click", function() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
});

// nav 
var nav = document.getElementById('header');
var scrollUp = "scroll-up";
var scrollDown = "scroll-down";
var lastScroll = 0;

if (window.addEventListener) {
    window.addEventListener("scroll", scrollHandler);
} else {
    window.attachEvent("scroll", scrollHandler);
}

function scrollHandler() {
     var currentScroll = window.pageYOffset;
     if (currentScroll === 0) {
         nav.classList.remove(scrollDown);
         nav.classList.remove(scrollUp);
        return;
     }
     if (currentScroll > lastScroll && !nav.classList.contains(scrollDown)) {
                // down
        nav.classList.remove(scrollUp);
        nav.classList.add(scrollDown);
    } 
    else if (currentScroll < lastScroll && nav.classList.contains(scrollDown)) {
                // up
        nav.classList.remove(scrollDown);
        nav.classList.add(scrollUp);
    }
    lastScroll = currentScroll;
}

// cart 
let closeCart = document.querySelector('.closeCart');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

function viewCart(){
    window.location.href = "cartPage.html"
}

function setupUI() {
    let logoutDiv = document.getElementById("display_login");
    let loginBtn = document.getElementById("login_btn");

    // Get logged-in user
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
        logoutDiv.style.display = "flex";
        loginBtn.style.display = "none";

        // Update the username dynamically
        document.getElementById("user_name").textContent = user.fname + " " + user.lname;
    } else {
        logoutDiv.style.display = "none";
        loginBtn.style.display = "inline-block";
    }
}


function logout(){
    localStorage.removeItem("loggedInUser");
    setupUI();
}



setupUI();

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".reviews-slider");
  const form = document.getElementById("reviewForm");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("reviewName").value.trim();
    const text = document.getElementById("reviewText").value.trim();

    if (name && text) {
      // Create review element
      const review = document.createElement("div");
      review.classList.add("review");
      review.innerHTML = `<p>"${text}"</p><span>- ${name}</span>`;

      // Add to slider
      slider.appendChild(review);

      // Reset form
      form.reset();
    }
  });
});
