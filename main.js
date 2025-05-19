let addBtns = document.querySelectorAll(".add");
let mycard = document.querySelector(".mycard");
let grandTotal = document.getElementById("total");

let itemArray = [];
let grandTotalValue = 0;

// Fetch products from API
async function fetchProducts() {
  const productsContainer = document.getElementById("products-container");
  // Show loading spinner
  productsContainer.innerHTML = `<div class="spinner"></div>`;
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Error loading products.</p>";
  }
}

// Display products in the container
function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = ""; // Clear existing content

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product-card";
    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <p class="product-name">${product.title}</p>
            <p class="product-price">$<span>${product.price}</span></p>
            <button class="btn btn-secondary add-to-cart" 
                    data-id="${product.id}" 
                    data-price="${product.price}" 
                    data-title="${product.title}">
                ADD TO CART
            </button>
        `;
    productsContainer.appendChild(productElement);
  });

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

// Cart functionality
let cart = [];

function addToCart(event) {
  const button = event.target;
  const productId = button.dataset.id;
  const productPrice = parseFloat(button.dataset.price);
  const productTitle = button.dataset.title;
  const productImage = button
    .closest(".product-card")
    .querySelector(".product-image").src;

  // Check if product is already in cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      quantity: 1,
      image: productImage,
    });
  }

  updateCartDisplay();
  updateTotal();
}

function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-container");
  if (cart.length === 0) {
    cartContainer.innerHTML = "<h2 class='empty-cart'>NO ITEM ADDED</h2>";
    return;
  }

  let cartHTML = "";
  cart.forEach((item) => {
    cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${
      item.title
    }" class="cart-item-image">
                    <p class="item-name">${item.title}</p>
                </div>
                <div class="cart-item-details">
                    <p class="item-price">$${item.price}</p>
                    <div class="quantity-controls">
                        <input type="number" class="quantity-input" value="${
                          item.quantity
                        }" min="1" max="10" data-id="${item.id}">
                        <div class="quantity-buttons">
                            <button class="btn btn-secondary" type="button" onclick="updateQuantity('${
                              item.id
                            }', 1)">+</button>
                            <button class="btn btn-secondary" type="button" onclick="updateQuantity('${
                              item.id
                            }', -1)">−</button>
                        </div>
                    </div>
                    <p class="item-total">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</p>
                    <button class="btn btn-primary" onclick="removeFromCart('${
                      item.id
                    }')">REMOVE</button>
                </div>
            </div>
        `;
  });

  cartContainer.innerHTML = cartHTML;
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, Math.min(10, item.quantity + change));
    updateCartDisplay();
    updateTotal();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartDisplay();
  updateTotal();
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});
