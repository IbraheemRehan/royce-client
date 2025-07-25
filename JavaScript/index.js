


var currentSlide = 1;

window.addEventListener("load", function() {
    if (document.querySelectorAll(".slider .slide-content").length > 0) {
        theChecker();
        playSlider();
    }
    getTrendingProducts();
});


function nextSlider() {
    var btnNext = document.getElementsByClassName("next")[0];
    if (btnNext.classList.contains('disabled')) {
        return false;
    } else {
        currentSlide++;
        theChecker();
    }
}

function prevSlider() {
    var btnPrev = document.getElementsByClassName("prev")[0];
    if (btnPrev.classList.contains('disabled')) {
        return false;
    } else {
        currentSlide--;
        theChecker();
    }
}

function theChecker() {
    var imgSlider = document.querySelectorAll(".slide-content");
    var btnNext = document.getElementsByClassName("next")[0];
    var btnPrev = document.getElementsByClassName("prev")[0];
    imgSlider.forEach(function (img) {
        img.classList.remove('active');
    });

    imgSlider[currentSlide - 1].classList.add('active');

    if (currentSlide == 1) {
        btnPrev.classList.add('disabled');
    } else {
        btnPrev.classList.remove('disabled');
    }

    if (currentSlide == imgSlider.length) {
        btnNext.classList.add('disabled');
    } else {
        btnNext.classList.remove('disabled');
    }
}
function playSlider() {
   var imgSlider = document.querySelectorAll(".slide-content");
   setInterval(function() {
        if (currentSlide < imgSlider.length) {
            currentSlide++;
        } else {
            currentSlide = 1;
        }
        theChecker();
    }, 3000);
}

async function getTrendingProducts() {
    let response = await fetch('https://royce-server-production.up.railway.app/api/products');
    let products = await response.json();
    let trendingProducts = products.filter(product => product.isTrending);
    displayTrendingProducts(trendingProducts);
}
function displayTrendingProducts(trendingProducts){
    let content = ``;
    for(let i = 0 ; i < trendingProducts.length ; i++){
        content += `
        <div class="product-card"  data-id="${trendingProducts[i].id}">
        <div class="card-img">
            <img src=${trendingProducts[i].images[0]}  onclick=displayDetails(${trendingProducts[i].id});>
            <a href="" class="addToCart">
                <ion-icon name="cart-outline" class="Cart"></ion-icon>
            </a>
        </div>
        <div class="card-info">
             <h4 class="product-name" onclick=displayDetails(${trendingProducts[i].id});>${trendingProducts[i].name}</h4>
             <h5 class="product-price">${trendingProducts[i].price}</h5>
        </div>
    </div>`
    }
    
document.querySelector(".top_products .products").innerHTML = content;
let addToCartLinks = document.querySelectorAll('.addToCart');
addToCartLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        let productCard = event.target.closest('.product-card');
        if (productCard && productCard.dataset.id) {
            let id_product = productCard.dataset.id;
            addToCart(id_product);
            showCart();
        }
        });
    });
}
function showCart(){
    let body = document.querySelector('body');
    body.classList.add('showCart');
}
function displayDetails(productId){
    window.location.href = `ProductDetails.html?productId=${productId}`;
}


async function getTrendingProducts() {
    let response = await fetch('https://royce-server-production.up.railway.app/api/products');
    let products = await response.json();
    
    // Separate trending products for Men and Women
    let trendingMen = products.filter(p => p.isTrending && p.category === "Man");
    let trendingWomen = products.filter(p => p.isTrending && p.category === "Woman");

    // Pick N random products from each category (e.g., 4 each)
    let selectedMen = getRandomItems(trendingMen, 4);
    let selectedWomen = getRandomItems(trendingWomen, 4);

    // Combine and shuffle
    let trendingProducts = shuffleArray([...selectedMen, ...selectedWomen]);

    displayTrendingProducts(trendingProducts);
}

// Helper to get N random items from array
function getRandomItems(array, n) {
    return array.sort(() => 0.5 - Math.random()).slice(0, n);
}

// Helper to shuffle final array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
