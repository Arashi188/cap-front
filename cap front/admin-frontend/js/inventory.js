// Inventory Management JavaScript

// DOM Elements
let inventoryTableBody = document.getElementById('inventoryTableBody');
let selectAllInventory = document.getElementById('selectAllInventory');

// Mock inventory data
const mockInventory = [
    {
        id: 1,
        name: 'Premium Cotton Shirt',
        sku: 'CS-SHIRT-001',
        category: 'Clothing',
        stock: 48,
        price: 24900,
        value: 1195200,
        status: 'in_stock',
        last_updated: '2023-11-28T10:30:00',
        low_stock_threshold: 10
    },
    {
        id: 2,
        name: 'Slim Fit Chinos',
        sku: 'CS-PANT-001',
        category: 'Clothing',
        stock: 32,
        price: 18900,
        value: 604800,
        status: 'in_stock',
        last_updated: '2023-11-27T14:15:00',
        low_stock_threshold: 10
    },
    {
        id: 3,
        name: 'Leather Jacket',
        sku: 'CS-JACKET-001',
        category: 'Clothing',
        stock: 8,
        price: 45900,
        value: 367200,
        status: 'low_stock',
        last_updated: '2023-11-26T09:45:00',
        low_stock_threshold: 10
    },
    {
        id: 4,
        name: 'Wool Blend Sweater',
        sku: 'CS-SWEATER-001',
        category: 'Clothing',
        stock: 5,
        price: 28900,
        value: 144500,
        status: 'low_stock',
        last_updated: '2023-11-25T11:20:00',
        low_stock_threshold: 10
    },
    {
        id: 5,
        name: 'Leather Loafers',
        sku: 'CS-SHOE-001',
        category: 'Shoes',
        stock: 0,
        price: 38900,
        value: 0,
        status: 'out_of_stock',
        last_updated: '2023-11-24T16:00:00',
        low_stock_threshold: 5
    },
    {
        id: 6,
        name: 'Genuine Leather Belt',
        sku: 'CS-BELT-001',
        category: 'Accessories',
        stock: 35,
        price: 8900,
        value: 311500,
        status: 'in_stock',
        last_updated: '2023-11-23T13:10:00',
        low_stock_threshold: 15
    }
];

// Stock history mock data
const stockHistory = [
    {
        date: '2023-11-28T10:30:00',
        action: 'set',
        previous: 45,
        change: 3,
        new_stock: 48,
        notes: 'New shipment received',
        updated_by: 'Admin User'
    },
    {
        date: '2023-11-25T14:20:00',
        action: 'remove',
        previous: 50,
        change: -5,
        new_stock: 45,
        notes: 'Customer order #CS-83476',
        updated_by: 'System'
    },
    {
        date: '2023-11-20T09:15:00',
        action: 'add',
        previous: 40,
        change: 10,
        new_stock: 50,
        notes: 'Restock from supplier',
        updated_by: 'Jane Smith'
    }
];

// Initialize inventory page
function initInventory() {
    loadInventory();
    updateInventoryStats();
    loadLowStockAlerts();
    
    // Add event listeners
    if (selectAllInventory) {
        selectAllInventory.addEventListener('change', toggleSelectAllInventory);
    }
    
    // Search input
    const searchInput = document.getElementById('inventorySearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchInventory();
            }
        });
    }
    
    // Filter listeners
    ['categoryFilter', 'stockStatusFilter', 'sortFilter'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', applyInventoryFilters);
    });
}

// Load inventory into table
function loadInventory() {
    if (!inventoryTableBody) return;
    
    inventoryTableBody.innerHTML = '';
    
    mockInventory.forEach(item => {
        const row = createInventoryRow(item);
        inventoryTableBody.appendChild(row);
    });
}

// Create inventory table row
function createInventoryRow(item) {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    
    const statusClass = {
        'in_stock': 'in-stock',
        'low_stock': 'low-stock',
        'out_of_stock': 'out-of-stock'
    }[item.status];
    
    const statusText = {
        'in_stock': 'In Stock',
        'low_stock': 'Low Stock',
        'out_of_stock': 'Out of Stock'
    }[item.status];
    
    const lastUpdated = new Date(item.last_updated).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    tr.innerHTML = `
        <td>
            <input type="checkbox" class="inventory-checkbox" value="${item.id}">
        </td>
        <td>
            <div class="product-cell">
                <img src="assets/images/product${item.id}.jpg" alt="${item.name}">
                <div>
                    <strong>${item.name}</strong>
                </div>
            </div>
        </td>
        <td><span class="sku">${item.sku}</span></td>
        <td>${item.category}</td>
        <td>
            <div class="stock-level">
                <span class="stock-number ${statusClass}">${item.stock}</span>
                ${item.stock < item.low_stock_threshold && item.stock > 0 ? 
                    '<span class="stock-warning">!</span>' : ''}
            </div>
        </td>
        <td class="text-right">${formatNaira(item.price)}</td>
        <td class="text-right">${formatNaira(item.value)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${lastUpdated}</td>
        <td>
            <button class="action-btn edit" onclick="updateStock(${item.id})" title="Update Stock">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn alert" onclick="setRestockAlert(${item.id})" title="Set Alert">
                <i class="fas fa-bell"></i>
            </button>
            <button class="action-btn history" onclick="viewStockHistory(${item.id})" title="View History">
                <i class="fas fa-history"></i>
            </button>
        </td>
    `;
    
    return tr;
}

// Update inventory statistics
function updateInventoryStats() {
    const totalProducts = mockInventory.length;
    const inStock = mockInventory.filter(i => i.status === 'in_stock').length;
    const lowStock = mockInventory.filter(i => i.status === 'low_stock').length;
    const outOfStock = mockInventory.filter(i => i.status === 'out_of_stock').length;
    const totalValue = mockInventory.reduce((sum, i) => sum + i.value, 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('inStockCount').textContent = inStock;
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('outOfStockCount').textContent = outOfStock;
    document.getElementById('inventoryValue').textContent = formatNaira(totalValue);
}

// Load low stock alerts
function loadLowStockAlerts() {
    const alertsGrid = document.getElementById('lowStockAlerts');
    if (!alertsGrid) return;
    
    const lowStockItems = mockInventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock');
    
    alertsGrid.innerHTML = lowStockItems.map(item => `
        <div class="alert-card ${item.status}">
            <div class="alert-icon">
                <i class="fas fa-${item.status === 'out_of_stock' ? 'times-circle' : 'exclamation-triangle'}"></i>
            </div>
            <div class="alert-content">
                <h4>${item.name}</h4>
                <p>SKU: ${item.sku}</p>
                <div class="alert-stock">
                    <span class="stock-count">${item.stock} units</span>
                    <span class="threshold">Threshold: ${item.low_stock_threshold}</span>
                </div>
            </div>
            <div class="alert-actions">
                <button class="btn-primary btn-sm" onclick="updateStock(${item.id})">
                    Restock Now
                </button>
            </div>
        </div>
    `).join('');
}

// Update stock
function updateStock(productId) {
    const product = mockInventory.find(p => p.id === productId);
    if (!product) return;
    
    // Populate modal
    document.getElementById('updateStockModalTitle').textContent = `Update Stock - ${product.name}`;
    document.getElementById('updateProductId').value = product.id;
    
    const productInfo = document.getElementById('productInfoSummary');
    productInfo.innerHTML = `
        <div class="product-summary">
            <img src="assets/images/product${product.id}.jpg" alt="${product.name}">
            <div class="product-details">
                <strong>${product.name}</strong>
                <span class="sku">${product.sku}</span>
            </div>
        </div>
    `;
    
    document.getElementById('currentStock').value = product.stock;
    document.getElementById('newStock').value = product.stock;
    document.getElementById('stockNotes').value = '';
    
    openModal('updateStockModal');
}

// On stock action change
function onStockActionChange() {
    const action = document.getElementById('stockAction').value;
    const adjustmentField = document.getElementById('stockAdjustmentAmount');
    const newStockInput = document.getElementById('newStock');
    const currentStock = parseInt(document.getElementById('currentStock').value);
    
    if (action === 'set') {
        adjustmentField.style.display = 'none';
        newStockInput.disabled = false;
        newStockInput.value = currentStock;
    } else {
        adjustmentField.style.display = 'block';
        newStockInput.disabled = true;
        newStockInput.value = '';
        document.getElementById('adjustmentAmount').value = '';
    }
}

// Save stock update
function saveStockUpdate() {
    const productId = parseInt(document.getElementById('updateProductId').value);
    const action = document.getElementById('stockAction').value;
    const newStock = parseInt(document.getElementById('newStock').value);
    const adjustmentAmount = parseInt(document.getElementById('adjustmentAmount').value);
    const notes = document.getElementById('stockNotes').value;
    const notifyCustomer = document.getElementById('notifyCustomer').checked;
    
    if (action !== 'set' && (!adjustmentAmount || adjustmentAmount <= 0)) {
        showNotification('Please enter a valid adjustment amount', 'error');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('updateStockModal');
        showNotification(`Stock updated successfully for product #${productId}`, 'success');
        
        if (notifyCustomer) {
            showNotification('Back-in-stock notifications have been sent', 'info');
        }
    }, 1500);
}

// Set restock alert
function setRestockAlert(productId) {
    const product = mockInventory.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('alertProductId').value = product.id;
    
    const productInfo = document.getElementById('alertProductInfo');
    productInfo.innerHTML = `
        <div class="product-summary">
            <img src="assets/images/product${product.id}.jpg" alt="${product.name}">
            <div class="product-details">
                <strong>${product.name}</strong>
                <span class="sku">${product.sku}</span>
                <span class="current-stock">Current Stock: ${product.stock}</span>
            </div>
        </div>
    `;
    
    document.getElementById('restockThreshold').value = product.low_stock_threshold;
    document.getElementById('restockQuantity').value = product.low_stock_threshold * 5;
    
    openModal('restockAlertModal');
}

// Save restock alert
function saveRestockAlert() {
    const threshold = document.getElementById('restockThreshold').value;
    const quantity = document.getElementById('restockQuantity').value;
    const supplier = document.getElementById('supplier').value;
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('restockAlertModal');
        showNotification('Restock alert configured successfully', 'success');
    }, 1000);
}

// View stock history
function viewStockHistory(productId) {
    const product = mockInventory.find(p => p.id === productId);
    if (!product) return;
    
    // Populate product info
    const historyProductInfo = document.getElementById('historyProductInfo');
    historyProductInfo.innerHTML = `
        <div class="product-summary">
            <img src="assets/images/product${product.id}.jpg" alt="${product.name}">
            <div class="product-details">
                <strong>${product.name}</strong>
                <span class="sku">${product.sku}</span>
                <span class="current-stock">Current Stock: ${product.stock}</span>
            </div>
        </div>
    `;
    
    // Load history table
    const historyTable = document.getElementById('stockHistoryTableBody');
    historyTable.innerHTML = stockHistory.map(entry => {
        const changeClass = entry.change > 0 ? 'positive' : 'negative';
        const changeSign = entry.change > 0 ? '+' : '';
        
        return `
            <tr>
                <td>${new Date(entry.date).toLocaleString()}</td>
                <td><span class="action-badge ${entry.action}">${entry.action}</span></td>
                <td class="text-right">${entry.previous}</td>
                <td class="text-right ${changeClass}">${changeSign}${entry.change}</td>
                <td class="text-right">${entry.new_stock}</td>
                <td>${entry.notes}</td>
                <td>${entry.updated_by}</td>
            </tr>
        `;
    }).join('');
    
    // Initialize stock history chart
    initStockHistoryChart();
    
    openModal('stockHistoryModal');
}

// Initialize stock history chart
function initStockHistoryChart() {
    const ctx = document.getElementById('stockHistoryChart')?.getContext('2d');
    if (!ctx) return;
    
    // Destroy existing chart if any
    if (window.stockHistoryChart) {
        window.stockHistoryChart.destroy();
    }
    
    window.stockHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Nov 20', 'Nov 25', 'Nov 28'],
            datasets: [{
                label: 'Stock Level',
                data: [40, 45, 48],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Stock: ${context.parsed.y} units`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Stock Quantity'
                    },
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Export stock history
function exportStockHistory() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Stock history exported successfully', 'success');
        
        const link = document.createElement('a');
        link.href = '#';
        link.download = `stock-history-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }, 1500);
}

// Bulk update stock
function bulkUpdateStock() {
    const selectedCheckboxes = document.querySelectorAll('.inventory-checkbox:checked');
    const selectedCount = selectedCheckboxes.length;
    
    if (selectedCount === 0) {
        showNotification('Please select at least one product', 'error');
        return;
    }
    
    document.getElementById('selectedCount').textContent = selectedCount;
    openModal('bulkUpdateStockModal');
}

// On bulk stock action change
function onBulkStockActionChange() {
    const action = document.getElementById('bulkStockAction').value;
    const quantityInput = document.getElementById('bulkStockValue');
    
    if (action === 'set') {
        quantityInput.placeholder = 'Enter new stock level';
    } else {
        quantityInput.placeholder = 'Enter adjustment amount';
    }
}

// Apply bulk stock update
function applyBulkStockUpdate() {
    const action = document.getElementById('bulkStockAction').value;
    const quantity = parseInt(document.getElementById('bulkStockValue').value);
    const notes = document.getElementById('bulkStockNotes').value;
    
    if (!quantity || quantity <= 0) {
        showNotification('Please enter a valid quantity', 'error');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('bulkUpdateStockModal');
        showNotification(`Bulk stock update applied successfully`, 'success');
    }, 2000);
}

// Search inventory
function searchInventory() {
    const query = document.getElementById('inventorySearchInput').value.trim();
    if (query.length < 2) {
        showNotification('Please enter at least 2 characters', 'error');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification(`Found ${mockInventory.length} products matching "${query}"`, 'success');
    }, 1000);
}

// Apply inventory filters
function applyInventoryFilters() {
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('stockStatusFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Filters applied successfully', 'success');
    }, 800);
}

// Reset inventory filters
function resetInventoryFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('stockStatusFilter').value = '';
    document.getElementById('sortFilter').value = 'name';
    applyInventoryFilters();
}

// Toggle select all
function toggleSelectAllInventory() {
    const isChecked = selectAllInventory.checked;
    document.querySelectorAll('.inventory-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

// Export inventory
function exportInventory() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Inventory exported successfully', 'success');
        
        const link = document.createElement('a');
        link.href = '#';
        link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }, 1500);
}

// Handle stock file upload
function handleStockFileUpload() {
    const fileInput = document.getElementById('stockImportFile');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    // Show preview
    document.getElementById('importPreview').style.display = 'block';
    document.getElementById('processImportBtn').disabled = false;
    
    const previewContainer = document.querySelector('#importPreview .preview-table-container');
    previewContainer.innerHTML = `
        <table class="preview-table">
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>New Stock</th>
                    <th>Change</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>CS-SHIRT-001</td>
                    <td>Premium Cotton Shirt</td>
                    <td>48</td>
                    <td>60</td>
                    <td class="positive">+12</td>
                    <td><span class="badge success">Valid</span></td>
                </tr>
                <tr>
                    <td>CS-JACKET-001</td>
                    <td>Leather Jacket</td>
                    <td>8</td>
                    <td>25</td>
                    <td class="positive">+17</td>
                    <td><span class="badge success">Valid</span></td>
                </tr>
                <tr>
                    <td>CS-SHOE-001</td>
                    <td>Leather Loafers</td>
                    <td>0</td>
                    <td>15</td>
                    <td class="positive">+15</td>
                    <td><span class="badge success">Valid</span></td>
                </tr>
            </tbody>
        </table>
    `;
}

// Process stock import
function processStockImport() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('importStockModal');
        showNotification('Stock levels imported successfully', 'success');
    }, 2000);
}

// Download stock template
function downloadStockTemplate() {
    const csvContent = 'sku,stock_quantity,notes\nCS-SHIRT-001,50,"New shipment"\nCS-PANT-001,30,"Restock"\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stock-import-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
}

// View all alerts
function viewAllAlerts() {
    document.getElementById('stockStatusFilter').value = 'low_stock';
    applyInventoryFilters();
}

// Format Naira
function formatNaira(amount) {
    return '₦' + amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initInventory);