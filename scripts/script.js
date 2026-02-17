let allProducts = [];
let cart = [];
const API_BASE = 'https://fakestoreapi.com';

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAllProducts();
    loadTrendingProducts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Cart Button
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('show');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('show');
    });

    // Click outside cart to close
    cartSidebar.addEventListener('click', (e) => {
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove('show');
        }
    });

    // Modal Close
    const closeModal = document.getElementById('closeModal');
    const productModal = document.getElementById('productModal');

    closeModal.addEventListener('click', () => {
        productModal.classList.add('hidden');
        productModal.classList.remove('flex');
    });

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.add('hidden');
            productModal.classList.remove('flex');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

// Load Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/products/categories`);
        const categories = await response.json();

        const categoryContainer = document.getElementById('categoryContainer');

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn bg-white text-gray-700 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg';
            button.textContent = formatCategoryName(category);
            button.dataset.category = category;

            button.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('bg-white', 'text-gray-700');
                    btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white');
                });

                button.classList.add('active');
                button.classList.remove('bg-white', 'text-gray-700');
                button.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white');

                // Load products by category
                if (category === 'all') {
                    displayProducts(allProducts);
                } else {
                    loadProductsByCategory(category);
                }
            });

            categoryContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories', 'error');
    }
}

// Format Category Name
function formatCategoryName(category) {
    return category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Load All Products
async function loadAllProducts() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/products`);
        allProducts = await response.json();
        displayProducts(allProducts);
        showLoading(false);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
        showLoading(false);
    }
}

// Load Products by Category
async function loadProductsByCategory(category) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/products/category/${category}`);
        const products = await response.json();
        displayProducts(products);
        showLoading(false);
    } catch (error) {
        console.error('Error loading products by category:', error);
        showToast('Failed to load products', 'error');
        showLoading(false);
    }
}

// Load Trending Products (Top 3 rated)
async function loadTrendingProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();

        // Sort by rating and get top 3
        const trending = products
            .sort((a, b) => b.rating.rate - a.rating.rate)
            .slice(0, 3);

        displayTrendingProducts(trending);
    } catch (error) {
        console.error('Error loading trending products:', error);
    }
}

// Display Trending Products
function displayTrendingProducts(products) {
    const container = document.getElementById('trendingProducts');
    container.innerHTML = '';

    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Display Products
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-span-full empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3 class="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                <p class="text-gray-500">Try selecting a different category</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-2xl shadow-lg overflow-hidden';

    const truncatedTitle = product.title.length > 50
        ? product.title.substring(0, 50) + '...'
        : product.title;

    card.innerHTML = `
        <div class="image-container bg-gray-100 h-64 flex items-center justify-center p-4">
            <img src="${product.image}" alt="${product.title}" class="product-image w-full h-full object-contain">
        </div>
        <div class="p-6">
            <span class="badge bg-purple-100 text-purple-700 mb-3">${formatCategoryName(product.category)}</span>
            <h3 class="text-lg font-bold text-gray-900 mb-3 h-14 line-clamp-2">${truncatedTitle}</h3>
            
            <div class="flex items-center gap-2 mb-4">
                ${generateStarRating(product.rating.rate)}
                <span class="text-sm text-gray-500">(${product.rating.count})</span>
            </div>
            
            <div class="flex items-center justify-between mb-4">
                <span class="price-badge">$${product.price.toFixed(2)}</span>
            </div>
            
            <div class="flex gap-3">
                <button onclick="showProductDetails(${product.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
                    <i class="fas fa-info-circle mr-2"></i>Details
                </button>
                <button onclick="addToCart(${product.id})" class="flex-1 btn-add-cart bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg">
                    <i class="fas fa-cart-plus mr-2"></i>Add
                </button>
            </div>
        </div>
    `;

    return card;
}

// Generate Star Rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '<div class="star-rating flex items-center">';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }

    stars += `<span class="ml-2 text-sm font-semibold text-gray-700">${rating.toFixed(1)}</span>`;
    stars += '</div>';

    return stars;
}

// Show Product Details in Modal
async function showProductDetails(productId) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        const product = await response.json();

        const modal = document.getElementById('productModal');
        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                    <img src="${product.image}" alt="${product.title}" class="max-h-96 object-contain">
                </div>
                
                <div>
                    <span class="badge bg-purple-100 text-purple-700 mb-4">${formatCategoryName(product.category)}</span>
                    <h2 class="text-3xl font-playfair font-bold text-gray-900 mb-4">${product.title}</h2>
                    
                    <div class="flex items-center gap-3 mb-6">
                        ${generateStarRating(product.rating.rate)}
                        <span class="text-gray-500">(${product.rating.count} reviews)</span>
                    </div>
                    
                    <div class="mb-6">
                        <span class="text-4xl font-bold text-purple-600">$${product.price.toFixed(2)}</span>
                    </div>
                    
                    <div class="mb-8">
                        <h4 class="text-lg font-bold text-gray-900 mb-3">Description</h4>
                        <p class="text-gray-600 leading-relaxed">${product.description}</p>
                    </div>
                    
                    <div class="flex gap-4">
                        <button onclick="addToCart(${product.id})" class="flex-1 btn-add-cart bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                            <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                        </button>
                        <button class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                            <i class="fas fa-shopping-bag mr-2"></i>Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } catch (error) {
        console.error('Error loading product details:', error);
        showToast('Failed to load product details', 'error');
    }
}

// Add to Cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCartToStorage();
    showToast('Product added to cart!', 'success');

    // Show cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('show');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    showToast('Product removed from cart', 'success');
}

// Update Cart Quantity
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCartToStorage();
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3 class="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
                <p class="text-gray-500">Add some products to get started!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item flex gap-4 mb-4 p-4 rounded-xl border-2 border-gray-100">
                <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-contain rounded-lg bg-gray-100 p-2">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">${item.title}</h4>
                    <p class="text-purple-600 font-bold mb-2">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-3">
                        <button onclick="updateCartQuantity(${item.id}, -1)" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="font-semibold text-gray-900 w-8 text-center">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)" class="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                        <button onclick="removeFromCart(${item.id})" class="ml-auto text-red-500 hover:text-red-700 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Show/Hide Loading Spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('productsContainer');

    if (show) {
        spinner.classList.remove('hidden');
        container.innerHTML = '';
    } else {
        spinner.classList.add('hidden');
    }
}

// Make functions globally available
window.showProductDetails = showProductDetails;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
