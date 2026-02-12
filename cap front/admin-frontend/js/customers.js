// Customers Management JavaScript

// DOM Elements
let customersTableBody = document.getElementById('customersTableBody');
let selectAllCheckbox = document.getElementById('selectAll');

// Mock customers data
const mockCustomers = [
    {
        id: 1,
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+234 812 345 6789',
        address: '123 Main Street',
        city: 'Lagos Island',
        state: 'Lagos',
        orders: 12,
        total_spent: 124500,
        last_order: '2023-11-28T10:30:00',
        status: 'active',
        vip: true,
        created_at: '2023-01-15T09:23:00'
    },
    {
        id: 2,
        full_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+234 803 987 6543',
        address: '45 Banana Island',
        city: 'Ikoyi',
        state: 'Lagos',
        orders: 8,
        total_spent: 89200,
        last_order: '2023-11-25T14:15:00',
        status: 'active',
        vip: false,
        created_at: '2023-02-20T11:45:00'
    },
    {
        id: 3,
        full_name: 'Michael Johnson',
        email: 'michael.j@example.com',
        phone: '+234 905 123 4567',
        address: '78 Central Area',
        city: 'Garki',
        state: 'FCT',
        orders: 5,
        total_spent: 54300,
        last_order: '2023-11-20T09:45:00',
        status: 'active',
        vip: false,
        created_at: '2023-03-10T13:20:00'
    },
    {
        id: 4,
        full_name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        phone: '+234 706 543 2109',
        address: '12 Woji Road',
        city: 'Port Harcourt',
        state: 'Rivers',
        orders: 15,
        total_spent: 178900,
        last_order: '2023-11-27T16:30:00',
        status: 'active',
        vip: true,
        created_at: '2022-11-05T10:00:00'
    },
    {
        id: 5,
        full_name: 'David Adeleke',
        email: 'david.a@example.com',
        phone: '+234 809 876 5432',
        address: '33 Bodija Estate',
        city: 'Ibadan',
        state: 'Oyo',
        orders: 2,
        total_spent: 18900,
        last_order: '2023-11-15T11:20:00',
        status: 'inactive',
        vip: false,
        created_at: '2023-08-12T14:30:00'
    }
];

// Initialize customers page
function initCustomers() {
    loadCustomers();
    updateCustomerStats();
    
    // Add event listeners
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
    
    // Search input
    const searchInput = document.getElementById('customerSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCustomers();
            }
        });
    }
    
    // Filter listeners
    ['dateFilter', 'statusFilter', 'stateFilter', 'sortFilter'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', applyFilters);
    });
}

// Load customers into table
function loadCustomers() {
    if (!customersTableBody) return;
    
    customersTableBody.innerHTML = '';
    
    mockCustomers.forEach(customer => {
        const row = createCustomerRow(customer);
        customersTableBody.appendChild(row);
    });
}

// Create customer table row
function createCustomerRow(customer) {
    const tr = document.createElement('tr');
    tr.dataset.id = customer.id;
    
    const lastOrderDate = new Date(customer.last_order);
    const formattedDate = lastOrderDate.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    tr.innerHTML = `
        <td>
            <input type="checkbox" class="customer-checkbox" value="${customer.id}">
        </td>
        <td>
            <div class="customer-cell">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(customer.full_name)}&background=667eea&color=fff" alt="${customer.full_name}">
                <div>
                    <strong>${customer.full_name}</strong>
                    ${customer.vip ? '<span class="vip-badge">VIP</span>' : ''}
                </div>
            </div>
        </td>
        <td>
            <div class="contact-info">
                <div>${customer.email}</div>
                <small>${customer.phone}</small>
            </div>
        </td>
        <td>${customer.city}, ${customer.state}</td>
        <td class="text-center">${customer.orders}</td>
        <td class="text-right">${formatNaira(customer.total_spent)}</td>
        <td>${formattedDate}</td>
        <td>
            <span class="status-badge ${customer.status}">
                ${customer.status === 'active' ? 'Active' : 'Inactive'}
            </span>
        </td>
        <td>
            <button class="action-btn view" onclick="viewCustomer(${customer.id})" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="editCustomer(${customer.id})" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn email" onclick="emailCustomer('${customer.email}')" title="Send Email">
                <i class="fas fa-envelope"></i>
            </button>
        </td>
    `;
    
    return tr;
}

// Update customer statistics
function updateCustomerStats() {
    const totalCustomers = mockCustomers.length;
    const newCustomers = mockCustomers.filter(c => {
        const created = new Date(c.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
    
    const repeatCustomers = mockCustomers.filter(c => c.orders > 1).length;
    const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.total_spent, 0);
    
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('newCustomers').textContent = newCustomers;
    document.getElementById('repeatCustomers').textContent = repeatCustomers;
    document.getElementById('customerRevenue').textContent = formatNaira(totalRevenue);
}

// View customer details
function viewCustomer(customerId) {
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Populate modal with customer data
    document.getElementById('customerModalTitle').textContent = `Customer Details - ${customer.full_name}`;
    document.getElementById('customerAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.full_name)}&background=667eea&color=fff&size=128`;
    document.getElementById('customerFullName').textContent = customer.full_name;
    
    const vipBadge = document.getElementById('customerVipBadge');
    const statusBadge = document.getElementById('customerStatusBadge');
    
    vipBadge.style.display = customer.vip ? 'inline-block' : 'none';
    statusBadge.className = `badge ${customer.status}`;
    statusBadge.textContent = customer.status === 'active' ? 'Active' : 'Inactive';
    
    // Contact details
    document.getElementById('detailFullName').textContent = customer.full_name;
    document.getElementById('detailEmail').textContent = customer.email;
    document.getElementById('detailPhone').textContent = customer.phone;
    document.getElementById('detailAddress').textContent = customer.address;
    document.getElementById('detailCity').textContent = customer.city;
    document.getElementById('detailState').textContent = customer.state;
    
    // Statistics
    document.getElementById('statOrders').textContent = customer.orders;
    document.getElementById('statSpent').textContent = formatNaira(customer.total_spent);
    document.getElementById('statAverage').textContent = formatNaira(Math.round(customer.total_spent / customer.orders));
    document.getElementById('statSince').textContent = new Date(customer.created_at).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Load customer orders
    loadCustomerOrders(customerId);
    
    openModal('customerModal');
}

// Load customer orders
function loadCustomerOrders(customerId) {
    const ordersTable = document.getElementById('customerOrdersTableBody');
    if (!ordersTable) return;
    
    // Mock order data
    const mockOrders = [
        {
            id: 'CS-83476',
            date: '2023-11-28T10:30:00',
            items: 3,
            total: 45900,
            status: 'delivered',
            payment: 'paid'
        },
        {
            id: 'CS-83452',
            date: '2023-11-15T14:20:00',
            items: 2,
            total: 33800,
            status: 'delivered',
            payment: 'paid'
        },
        {
            id: 'CS-83421',
            date: '2023-11-02T09:45:00',
            items: 1,
            total: 24900,
            status: 'delivered',
            payment: 'paid'
        }
    ];
    
    ordersTable.innerHTML = mockOrders.map(order => `
        <tr>
            <td><a href="#" onclick="viewOrder('${order.id}')">${order.id}</a></td>
            <td>${new Date(order.date).toLocaleDateString('en-NG')}</td>
            <td>${order.items} items</td>
            <td>${formatNaira(order.total)}</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
            <td><span class="status ${order.payment}">${order.payment}</span></td>
            <td>
                <button class="action-btn view" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Edit customer
function editCustomer(customerId) {
    showNotification('Edit customer feature coming soon', 'info');
}

// Email customer
function emailCustomer(email) {
    document.getElementById('emailTo').value = email;
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailMessage').value = '';
    openModal('emailModal');
}

// Send customer email
function sendCustomerEmail() {
    const to = document.getElementById('emailTo').value;
    const subject = document.getElementById('emailSubject').value;
    const message = document.getElementById('emailMessage').value;
    
    if (!subject || !message) {
        showNotification('Please fill in both subject and message', 'error');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('emailModal');
        showNotification(`Email sent to ${to}`, 'success');
    }, 1500);
}

// Load email template
function loadEmailTemplate() {
    const template = document.getElementById('emailTemplate').value;
    const subjectInput = document.getElementById('emailSubject');
    const messageInput = document.getElementById('emailMessage');
    
    const templates = {
        welcome: {
            subject: 'Welcome to Captains-Signature!',
            message: 'Dear [Customer],\n\nWelcome to Captains-Signature! We are thrilled to have you as part of our community.\n\nAs a welcome gift, enjoy 10% off your next purchase with code: WELCOME10\n\nShop our latest collection: https://captains-signature.com\n\nBest regards,\nThe Captains-Signature Team'
        },
        order_confirmation: {
            subject: 'Your Order Confirmation',
            message: 'Dear [Customer],\n\nThank you for your order! We have received your order and it is being processed.\n\nOrder Number: [ORDER_NUMBER]\nTotal: [ORDER_TOTAL]\n\nYou will receive a shipping confirmation once your order is on its way.\n\nBest regards,\nThe Captains-Signature Team'
        },
        shipping_update: {
            subject: 'Your Order Has Shipped!',
            message: 'Dear [Customer],\n\nGreat news! Your order has been shipped and is on its way to you.\n\nTracking Number: [TRACKING_NUMBER]\nEstimated Delivery: [DELIVERY_DATE]\n\nTrack your package: [TRACKING_URL]\n\nBest regards,\nThe Captains-Signature Team'
        },
        promotion: {
            subject: 'Special Offer Just For You',
            message: 'Dear [Customer],\n\nWe hope this email finds you well. We are excited to offer you an exclusive 20% discount on your next purchase!\n\nUse code: VIP20 at checkout.\n\nOffer valid for the next 7 days.\n\nShop now: https://captains-signature.com\n\nBest regards,\nThe Captains-Signature Team'
        }
    };
    
    if (templates[template]) {
        subjectInput.value = templates[template].subject;
        messageInput.value = templates[template].message;
    }
}

// Search customers
function searchCustomers() {
    const query = document.getElementById('customerSearchInput').value.trim();
    if (query.length < 2) {
        showNotification('Please enter at least 2 characters', 'error');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification(`Found ${mockCustomers.length} customers matching "${query}"`, 'success');
    }, 1000);
}

// Apply filters
function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const stateFilter = document.getElementById('stateFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Filters applied successfully', 'success');
    }, 800);
}

// Reset filters
function resetFilters() {
    document.getElementById('dateFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('stateFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    
    applyFilters();
}

// Toggle select all
function toggleSelectAll() {
    const isChecked = selectAllCheckbox.checked;
    document.querySelectorAll('.customer-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

// Export customers
function exportCustomers() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Customers exported successfully', 'success');
        
        const link = document.createElement('a');
        link.href = '#';
        link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }, 1500);
}

// Send bulk email
function sendBulkEmail() {
    openModal('bulkEmailModal');
}

// Load bulk email template
function loadBulkEmailTemplate() {
    const template = document.getElementById('bulkEmailTemplate').value;
    const subjectInput = document.getElementById('bulkEmailSubject');
    const messageInput = document.getElementById('bulkEmailMessage');
    
    const templates = {
        newsletter: {
            subject: 'Captains-Signature Newsletter',
            message: 'Dear Customer,\n\nCheck out our latest arrivals and exclusive offers!\n\n[INSERT NEWSLETTER CONTENT]\n\nShop now: https://captains-signature.com\n\nBest regards,\nThe Captains-Signature Team'
        },
        sale: {
            subject: 'End of Season Sale - Up to 50% Off!',
            message: 'Dear Customer,\n\nOur End of Season Sale is now live! Enjoy up to 50% off on selected items.\n\nDon\'t miss out on these amazing deals!\n\nShop the sale: https://captains-signature.com/sale\n\nBest regards,\nThe Captains-Signature Team'
        },
        new_arrivals: {
            subject: 'New Arrivals Just Landed',
            message: 'Dear Customer,\n\nWe are excited to announce our latest collection has just arrived!\n\nBe the first to shop our new styles:\n- Premium Cotton Shirts\n- Leather Accessories\n- Formal Footwear\n\nShop new arrivals: https://captains-signature.com/new\n\nBest regards,\nThe Captains-Signature Team'
        },
        holiday: {
            subject: 'Holiday Season Special Offers',
            message: 'Dear Customer,\n\nSpread the joy this holiday season with our special gift collection.\n\nFind the perfect gift for your loved ones:\n- Gift Cards\n- Luxury Accessories\n- Holiday Bundles\n\nShop holiday collection: https://captains-signature.com/holiday\n\nBest regards,\nThe Captains-Signature Team'
        }
    };
    
    if (templates[template]) {
        subjectInput.value = templates[template].subject;
        messageInput.value = templates[template].message;
    }
}

// Schedule bulk email
function scheduleBulkEmail() {
    const scheduleTime = document.getElementById('scheduleTime').value;
    
    if (!scheduleTime) {
        showNotification('Please select a schedule time', 'error');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('bulkEmailModal');
        showNotification(`Bulk email scheduled for ${new Date(scheduleTime).toLocaleString()}`, 'success');
    }, 1000);
}

// Print customer details
function printCustomerDetails() {
    window.print();
}

// View order (placeholder)
function viewOrder(orderId) {
    window.location.href = `orders.html?order=${orderId}`;
}

// Format Naira
function formatNaira(amount) {
    return '₦' + amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCustomers);