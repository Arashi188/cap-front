// Orders Management JavaScript

// DOM Elements
let ordersTableBody = document.getElementById('ordersTableBody');
let addOrderBtn = document.getElementById('addOrderBtn');
let orderModal = document.getElementById('orderModal');

// Mock orders data
let orders = [
    {
        id: 'CS-83476',
        customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+2348123456789',
            address: '123 Main Street, Lagos Island, Lagos'
        },
        date: '2023-12-01',
        items: [
            { name: 'Premium Cotton Shirt', price: 24900, quantity: 1 },
            { name: 'Slim Fit Chinos', price: 18900, quantity: 1 },
            { name: 'Leather Belt', price: 8900, quantity: 1 }
        ],
        subtotal: 52700,
        shipping: 2500,
        discount: 9300,
        total: 45900,
        status: 'delivered',
        paymentMethod: 'Card Payment',
        paymentStatus: 'paid'
    },
    // More mock orders...
];

// Initialize orders page
function initOrdersPage() {
    loadOrders();
    
    // Add event listeners
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', openAddOrderModal);
    }
    
    // Initialize status change listeners
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', handleStatusChange);
    });
}

// Load orders into table
function loadOrders() {
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = createOrderRow(order);
        ordersTableBody.appendChild(row);
    });
}

// Create order table row
function createOrderRow(order) {
    const tr = document.createElement('tr');
    tr.dataset.id = order.id;
    
    const statusOptions = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    
    tr.innerHTML = `
        <td><input type="checkbox" class="order-checkbox"></td>
        <td>${order.id}</td>
        <td>
            <div class="customer-cell">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer.name)}&background=667eea&color=fff" alt="${order.customer.name}">
                <div>
                    <strong>${order.customer.name}</strong>
                    <br>
                    <small>${order.customer.email}</small>
                </div>
            </div>
        </td>
        <td>${formatDate(order.date)}</td>
        <td>${order.items.length} items</td>
        <td>${formatCurrency(order.total)}</td>
        <td>
            <select class="status-select" data-order="${order.id}">
                ${Object.entries(statusOptions).map(([value, label]) => `
                    <option value="${value}" ${order.status === value ? 'selected' : ''}>
                        ${label}
                    </option>
                `).join('')}
            </select>
        </td>
        <td>
            <button class="action-btn view" onclick="viewOrder('${order.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="editOrder('${order.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteOrder('${order.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return tr;
}

// View order details
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Populate modal with order details
    document.querySelector('#orderModal .modal-header h3').textContent = `Order Details - ${order.id}`;
    
    // Update order info
    document.querySelector('#orderModal .order-info').innerHTML = `
        <h4>Order Information</h4>
        <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${order.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${formatDate(order.date)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${order.paymentMethod}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Payment Status:</span>
            <span class="status ${order.paymentStatus}">${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
        </div>
    `;
    
    // Update customer info
    document.querySelector('#orderModal .customer-info').innerHTML = `
        <h4>Customer Information</h4>
        <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${order.customer.name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${order.customer.email}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${order.customer.phone}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Shipping Address:</span>
            <span class="detail-value">${order.customer.address}</span>
        </div>
    `;
    
    // Update order items
    const itemsTable = document.querySelector('#orderModal .items-table tbody');
    itemsTable.innerHTML = order.items.map(item => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="../assets/images/product1.jpg" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${formatCurrency(item.price)}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.price * item.quantity)}</td>
        </tr>
    `).join('');
    
    // Update order summary
    document.querySelector('#orderModal .order-summary').innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(order.subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>${formatCurrency(order.shipping)}</span>
        </div>
        <div class="summary-row">
            <span>Discount:</span>
            <span>-${formatCurrency(order.discount)}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>${formatCurrency(order.total)}</span>
        </div>
    `;
    
    // Open modal
    openModal('orderModal');
}

// Edit order
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // For now, just open the view modal
    viewOrder(orderId);
    showNotification('Edit mode would open here', 'info');
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) {
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Remove order from array
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders.splice(index, 1);
        }
        
        // Update table
        loadOrders();
        
        showNotification(`Order ${orderId} deleted successfully`, 'success');
    }, 1000);
}

// Handle status change
function handleStatusChange(event) {
    const orderId = event.target.dataset.order;
    const newStatus = event.target.value;
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Update order status in array
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
        }
        
        showNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
    }, 800);
}

// Open add order modal
function openAddOrderModal() {
    // Clear form
    document.getElementById('orderForm')?.reset();
    
    // Update modal title
    document.querySelector('#orderModal .modal-header h3').textContent = 'Add New Order';
    
    // Open modal
    openModal('orderModal');
}

// Print order invoice
function printOrder() {
    window.print();
}

// Update order status from modal
function updateOrderStatus() {
    const orderId = document.querySelector('#orderModal .modal-header h3').textContent.split(' - ')[1];
    const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):');
    
    if (newStatus && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
        const statusSelect = document.querySelector(`.status-select[data-order="${orderId}"]`);
        if (statusSelect) {
            statusSelect.value = newStatus;
            statusSelect.dispatchEvent(new Event('change'));
        }
        closeModal('orderModal');
    }
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Helper function to format currency
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

// Initialize on page load
if (ordersTableBody) {
    initOrdersPage();
}

// Export functions for use in HTML
window.viewOrder = viewOrder;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.printOrder = printOrder;
window.updateOrderStatus = updateOrderStatus;
window.closeModal = function() {
    if (window.adminFunctions) {
        window.adminFunctions.closeModal('orderModal');
    }
};