// Admin Dashboard JavaScript

// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const adminSidebar = document.getElementById('adminSidebar');
const adminMain = document.getElementById('adminMain');
const dateRangePicker = document.getElementById('dateRange');

// Initialize sidebar state
let sidebarCollapsed = false;

// Toggle Sidebar
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebarCollapsed = !sidebarCollapsed;
        
        if (sidebarCollapsed) {
            adminSidebar.classList.add('collapsed');
            adminMain.classList.add('expanded');
        } else {
            adminSidebar.classList.remove('collapsed');
            adminMain.classList.remove('expanded');
        }
    });
}

// Mobile sidebar toggle
function toggleMobileSidebar() {
    adminSidebar.classList.toggle('show');
}

// Close sidebar on mobile when clicking outside
document.addEventListener('click', (event) => {
    if (window.innerWidth <= 992) {
        const isClickInsideSidebar = adminSidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && adminSidebar.classList.contains('show')) {
            adminSidebar.classList.remove('show');
        }
    }
});

// Initialize Date Range Picker
if (dateRangePicker) {
    flatpickr(dateRangePicker, {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: ["2023-11-01", "2023-12-01"],
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                updateDashboardData(selectedDates[0], selectedDates[1]);
            }
        }
    });
}

// Initialize Charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        const revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200000, 1350000, 1245800, 1450000, 1600000, 1550000, 1700000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₦' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        const categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Clothing', 'Shoes', 'Accessories'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#4facfe'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update Dashboard Data
function updateDashboardData(startDate, endDate) {
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Update stats cards
        updateStatsCards();
        
        // Update charts
        updateCharts();
        
        // Hide loading state
        hideLoading();
    }, 1000);
}

// Update Stats Cards
function updateStatsCards() {
    // This would be populated from an API in a real application
    console.log('Updating stats cards...');
}

// Update Charts
function updateCharts() {
    // This would update chart data from an API
    console.log('Updating charts...');
}

// Show Loading State
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        overlay.innerHTML = `
            <div class="loading-spinner" style="width: 50px; height: 50px;"></div>
        `;
        document.body.appendChild(overlay);
    }
}

// Hide Loading State
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Format Currency
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export Data
function exportData(format = 'csv') {
    showLoading();
    
    // Simulate export process
    setTimeout(() => {
        hideLoading();
        showNotification(`Data exported successfully as ${format.toUpperCase()}`, 'success');
        
        // In a real application, this would trigger a download
        if (format === 'csv') {
            const csvContent = "data:text/csv;charset=utf-8,";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "export.csv");
            document.body.appendChild(link);
            link.click();
        }
    }, 1500);
}

// Search Functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.admin-search input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(input.value);
            }
        });
    });
}

function performSearch(query) {
    if (!query.trim()) return;
    
    showLoading();
    
    // Simulate search
    setTimeout(() => {
        hideLoading();
        showNotification(`Search results for: ${query}`, 'info');
        
        // In a real application, this would filter the current view
        console.log(`Searching for: ${query}`);
    }, 1000);
}

// Filter Functions
function applyFilters() {
    const filters = {};
    
    // Collect filter values
    const filterElements = document.querySelectorAll('.filter-bar select, .filter-bar input[type="text"], .filter-bar input[type="date"]');
    filterElements.forEach(element => {
        if (element.value) {
            filters[element.id] = element.value;
        }
    });
    
    // Apply filters (simulated)
    console.log('Applying filters:', filters);
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification('Filters applied successfully', 'success');
    }, 1000);
}

function resetFilters() {
    const filterElements = document.querySelectorAll('.filter-bar select, .filter-bar input[type="text"], .filter-bar input[type="date"]');
    filterElements.forEach(element => {
        element.value = '';
    });
    
    showNotification('Filters reset', 'info');
    applyFilters(); // Re-apply with empty filters
}

// Bulk Actions
function initializeBulkActions() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.order-checkbox, .product-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }
    
    const applyBulkActionBtn = document.getElementById('applyBulkAction');
    if (applyBulkActionBtn) {
        applyBulkActionBtn.addEventListener('click', () => {
            const bulkAction = document.getElementById('bulkAction').value;
            if (!bulkAction) {
                showNotification('Please select a bulk action', 'warning');
                return;
            }
            
            const selectedItems = [];
            document.querySelectorAll('.order-checkbox:checked, .product-checkbox:checked').forEach(checkbox => {
                selectedItems.push(checkbox.closest('tr').dataset.id);
            });
            
            if (selectedItems.length === 0) {
                showNotification('Please select items to perform bulk action', 'warning');
                return;
            }
            
            performBulkAction(bulkAction, selectedItems);
        });
    }
}

function performBulkAction(action, items) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        switch (action) {
            case 'update_status':
                showNotification(`Status updated for ${items.length} items`, 'success');
                break;
            case 'export':
                exportData('csv');
                break;
            case 'delete':
                if (confirm(`Are you sure you want to delete ${items.length} selected items?`)) {
                    showNotification(`${items.length} items deleted successfully`, 'success');
                    // In real app, would call API to delete items
                }
                break;
        }
    }, 1500);
}

// Tabs Functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get tab content to show
            const tabId = tab.dataset.tab;
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const tabContent = document.getElementById(`${tabId}Tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Load data for this tab
            loadTabData(tabId);
        });
    });
}

function loadTabData(tabId) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        console.log(`Loading data for tab: ${tabId}`);
        // In real app, would fetch data for this tab
    }, 1000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    initializeSearch();
    initializeBulkActions();
    initializeTabs();
    
    // Add event listeners for filter buttons
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Initialize tooltips
    initializeTooltips();
});

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.title;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = (rect.top - 30) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    e.target.dataset.tooltipId = 'tooltip-' + Date.now();
}

function hideTooltip(e) {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth <= 992) {
        adminSidebar.classList.remove('collapsed');
        adminMain.classList.remove('expanded');
    }
});

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Export functions for use in other admin pages
window.adminFunctions = {
    showNotification,
    showLoading,
    hideLoading,
    formatCurrency,
    formatDate,
    exportData,
    logout,
    openModal,
    closeModal
};