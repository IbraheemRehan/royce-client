let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

getData("Man");

async function getData(category = null, subCategory = null) {
    let response = await fetch('https://royce-server-production.up.railway.app/api/products');
    let json = await response.json();
    productsContainer = json;

    if (category) {
        productsContainer = productsContainer.filter(product => product.category === category);
    }

    if (subCategory) {
        productsContainer = productsContainer.filter(product => product.subcategory === subCategory);
    }

    displayProducts();
}

function displayProducts() {
    let container = ``;
    for (let i = 0; i < productsContainer.length; i++) {
        container += `
        <div class="product-card" data-id="${productsContainer[i].id}">
            <div class="card-img">
                <img onclick="displayDetails(${productsContainer[i].id})"
                     src="${productsContainer[i].images[0]}"
                     alt="${productsContainer[i].name}">
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                <h4 class="product-name" onclick="displayDetails(${productsContainer[i].id})">${productsContainer[i].name}</h4>
                <h5 class="product-price">${productsContainer[i].price}</h5>
            </div>
        </div>`;
    }

    document.getElementById("productCount").innerHTML = `${productsContainer.length} Products`;
    document.querySelector('.products .content').innerHTML = container;

    // Add to cart logic
    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;
                addToCart(id_product);
            }
        });
    });
}

function getCategory(e) {
    let clicked = e.target;
    let subCategory = clicked.getAttribute('productCategory');

    let parentGroup = clicked.closest('.category-group');
    let parentCategoryLink = parentGroup.querySelector('.categories_link');
    let parentCategory = parentCategoryLink.getAttribute('productCategory');

    let isParentClick = clicked === parentCategoryLink;
    let category = isParentClick ? subCategory : parentCategory;
    let subCat = isParentClick ? null : subCategory;

    setActiveLink(clicked);

    try {
        getData(category, subCat);
    } catch (e) {
        console.log("Not found");
    }

    if (window.innerWidth <= 768) toggleSidebar();
}

function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Toggle subcategories when clicking parent (Man/Woman)
document.querySelectorAll('.category-group > .categories_link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        let group = this.parentElement;
        group.classList.toggle('open');
        getCategory(e);
    });
});

// Event listeners for all category/subcategory links
Array.from(linkName).forEach(function (element) {
    element.addEventListener('click', getCategory);
});

function toggleSidebar() {
    var sidebar = document.querySelector(".aside");
    sidebar.classList.toggle("open");
}

function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}
