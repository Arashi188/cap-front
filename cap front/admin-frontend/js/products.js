// Products Management JavaScript

// DOM Elements
let productsGrid = document.querySelector('.products-grid-admin');
let addProductBtn = document.getElementById('addProductBtn');
let productModal = document.getElementById('productModal');
let productForm = document.getElementById('productForm');
let saveProductBtn = document.getElementById('saveProductBtn');
let imageUpload = document.getElementById('imageUpload');
let imagePreview = document.getElementById('imagePreview');

// Mock products data
let products = [
    {
        id: 1,
        name: 'Premium Cotton Shirt',
        sku: 'CS-SHIRT-001',
        category: 'clothing',
        subcategory: 'shirts',
        price: 24900,
        comparePrice: 29900,
        stock: 48,
        status: 'active',
        description: 'Classic fit cotton shirt with premium fabric for maximum comfort and style.',
        images: ['../assets/images/product1.jpg'],
        featured: true,
        freeShipping: false,
        sold: 156,
        views: 2400
    },
    // More mock products...
];

// Initialize products page
function initProductsPage() {
    loadProducts();
    
    // Add event listeners
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }
    
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Initialize tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            filterProductsByTab(tabId);
        });
    });
    
    // Initialize filters
    const filterElements = document.querySelectorAll('.filter-bar select');
    filterElements.forEach(element => {
        element.addEventListener('change', applyProductFilters);
    });
}

// Load products into grid
function loadProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-admin';
    card.dataset.id = product.id;
    
    const stockStatus = getStockStatus(product.stock);
    const stockClass = getStockClass(product.stock);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.images[0] || '../assets/images/product1.jpg'}" alt="${product.name}">
            <div class="product-badges">
                ${product.featured ? '<span class="badge featured">Featured</span>' : ''}
                ${product.comparePrice > product.price ? '<span class="badge sale">Sale</span>' : ''}
            </div>
            <div class="product-actions">
                <button class="action-btn edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h4>${product.name}</h4>
            <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <div class="product-price">
                <span class="current-price">${formatCurrency(product.price)}</span>
                ${product.comparePrice > product.price ? 
                    `<span class="original-price">${formatCurrency(product.comparePrice)}</span>` : ''}
            </div>
            <div class="product-stock">
                <span class="stock-status ${stockClass}">${stockStatus}</span>
                <span class="stock-count">${product.stock} units</span>
            </div>
            <div class="product-meta">
                <span><i class="fas fa-shopping-bag"></i> ${product.sold || 0} sold</span>
                <span><i class="fas fa-eye"></i> ${product.views || 0} views</span>
            </div>
        </div>
    `;
    
    return card;
}

// Get stock status text
function getStockStatus(stock) {
    if (stock > 20) return 'In Stock';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
}

// Get stock status class
function getStockClass(stock) {
    if (stock > 20) return 'in-stock';
    if (stock > 0) return 'low-stock';
    return 'out-of-stock';
}

// Open add product modal
function openAddProductModal() {
    // Clear form
    if (productForm) {
        productForm.reset();
    }
    
    // Clear image preview
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Add New Product';
    
    // Update save button text
    document.getElementById('saveButtonText').textContent = 'Save Product';
    
    // Open modal
    openModal('productModal');
}

// Open edit product modal
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Populate form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productSku').value = product.sku;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productSubcategory').value = product.subcategory;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productComparePrice').value = product.comparePrice || '';
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('featuredProduct').checked = product.featured;
    document.getElementById('freeShipping').checked = product.freeShipping || false;
    
    // Update image preview
    if (imagePreview && product.images.length > 0) {
        imagePreview.innerHTML = product.images.map(img => `
            <div class="preview-image">
                <img src="${img}" alt="Product Image">
                <button type="button" class="remove-image" onclick="removeImage(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Update modal title
    document.getElementById('modalTitle').textContent = `Edit Product: ${product.name}`;
    
    // Update save button text
    document.getElementById('saveButtonText').textContent = 'Update Product';
    
    // Store product ID for update
    saveProductBtn.dataset.productId = productId;
    
    // Open modal
    openModal('productModal');
}

// Save product
function saveProduct() {
    if (!productForm) return;
    
    // Validate form
    if (!productForm.checkValidity()) {
        productForm.reportValidity();
        return;
    }
    
    // Show loading
    saveProductBtn.disabled = true;
    document.getElementById('productSpinner').style.display = 'inline-block';
    
    // Collect form data
    const formData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        comparePrice: parseInt(document.getElementById('productComparePrice').value) || 0,
        stock: parseInt(document.getElementById('productStock').value),
        status: document.getElementById('productStatus').value,
        description: document.getElementById('productDescription').value,
        featured: document.getElementById('featuredProduct').checked,
        freeShipping: document.getElementById('freeShipping').checked
    };
    
    // Get image files
    const images = [];
    const imagePreviews = imagePreview.querySelectorAll('.preview-image img');
    imagePreviews.forEach(img => {
        images.push(img.src);
    });
    formData.images = images;
    
    // Check if editing existing product
    const productId = saveProductBtn.dataset.productId;
    
    setTimeout(() => {
        if (productId) {
            // Update existing product
            updateProduct(productId, formData);
        } else {
            // Add new product
            addNewProduct(formData);
        }
        
        // Hide loading
        saveProductBtn.disabled = false;
        document.getElementById('productSpinner').style.display = 'none';
        
        // Close modal
        closeProductModal();
    }, 1500);
}

// Add new product
function addNewProduct(productData) {
    // Generate new ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Create product object
    const newProduct = {
        id: newId,
        ...productData,
        sold: 0,
        views: 0,
        createdAt: new Date().toISOString()
    };
    
    // Add to products array
    products.unshift(newProduct);
    
    // Reload products
    loadProducts();
    
    // Show success message
    showNotification('Product added successfully', 'success');
}

// Update existing product
function updateProduct(productId, productData) {
    const index = products.findIndex(p => p.id === parseInt(productId));
    if (index !== -1) {
        // Preserve existing data
        const existingProduct = products[index];
        
        // Update product
        products[index] = {
            ...existingProduct,
            ...productData
        };
        
        // Reload products
        loadProducts();
        
        // Show success message
        showNotification('Product updated successfully', 'success');
    }
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Remove product from array
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
        }
        
        // Reload products
        loadProducts();
        
        showNotification('Product deleted successfully', 'success');
    }, 1000);
}

// Handle image upload
function handleImageUpload(event) {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.match('image.*')) {
            showNotification('Please upload only image files', 'error');
            continue;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'preview-image';
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="Product Image">
                <button type="button" class="remove-image" onclick="removeImage(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            imagePreview.appendChild(previewDiv);
        };
        
        reader.readAsDataURL(file);
    }
    
    // Reset file input
    event.target.value = '';
}

// Remove image from preview
function removeImage(button) {
    button.closest('.preview-image').remove();
}

// Close product modal
function closeProductModal() {
    closeModal('productModal');
    saveProductBtn.dataset.productId = '';
}

// Filter products by tab
function filterProductsByTab(tabId) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // In a real application, this would filter the products
        console.log(`Filtering by tab: ${tabId}`);
        
        // For now, just show a notification
        showNotification(`Showing ${tabId} products`, 'info');
    }, 500);
}

// Apply product filters
function applyProductFilters() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Get filter values
        const category = document.getElementById('categoryFilter').value;
        const priceRange = document.getElementById('priceFilter').value;
        const sortBy = document.getElementById('sortFilter').value;
        const stockStatus = document.getElementById('stockFilter').value;
        
        // Apply filters (simulated)
        console.log('Applying filters:', { category, priceRange, sortBy, stockStatus });
        
        showNotification('Filters applied', 'success');
    }, 800);
}

// Helper function to format currency
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

// Initialize on page load
if (productsGrid) {
    initProductsPage();
}

// Export functions for use in HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.removeImage = removeImage;
window.closeProductModal = closeProductModal;

// Import global functions
const { showNotification, showLoading, hideLoading, openModal, closeModal } = window.adminFunctions || {};