// Analytics Dashboard JavaScript

// Chart instances
let revenueOrdersChart = null;
let categoryChart = null;
let customerAcquisitionChart = null;
let paymentChart = null;
let deviceChart = null;

// Date range
let currentDateRange = 30;
let startDate = null;
let endDate = null;

// Initialize analytics
function initAnalytics() {
    loadAnalyticsData();
    
    // Add date range button listeners
    document.querySelectorAll('.date-range-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-range-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const range = parseInt(this.dataset.range);
            if (!isNaN(range)) {
                currentDateRange = range;
                startDate = null;
                endDate = null;
                loadAnalyticsData();
            }
        });
    });
    
    // Export form date range dependency
    document.getElementById('exportDateRange')?.addEventListener('change', function() {
        const customFields = document.getElementById('customDateRangeFields');
        if (customFields) {
            customFields.style.display = this.value === 'custom' ? 'flex' : 'none';
        }
    });
}

// Load analytics data
function loadAnalyticsData() {
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        updateKPIValues();
        updateRevenueOrdersChart();
        updateCategoryChart();
        updateTopProducts();
        updateGeoStats();
        updateCustomerAcquisitionChart();
        updatePaymentChart();
        updateDeviceChart();
        updateStatusDistribution();
        hideLoading();
    }, 1000);
}

// Update KPI values
function updateKPIValues() {
    // Mock data based on date range
    const mockData = {
        7: {
            revenue: 458000,
            orders: 48,
            customers: 156,
            conversion: 12.4,
            aov: 9580,
            satisfaction: 4.8
        },
        30: {
            revenue: 1245800,
            orders: 156,
            customers: 342,
            conversion: 11.2,
            aov: 7985,
            satisfaction: 4.7
        },
        90: {
            revenue: 3560000,
            orders: 412,
            customers: 789,
            conversion: 10.8,
            aov: 8640,
            satisfaction: 4.6
        },
        365: {
            revenue: 12500000,
            orders: 1450,
            customers: 2500,
            conversion: 9.5,
            aov: 8620,
            satisfaction: 4.5
        }
    };
    
    const data = mockData[currentDateRange] || mockData[30];
    
    document.getElementById('totalRevenue').textContent = formatNaira(data.revenue);
    document.getElementById('totalOrders').textContent = data.orders;
    document.getElementById('totalCustomers').textContent = data.customers;
    document.getElementById('conversionRate').textContent = data.conversion + '%';
    document.getElementById('avgOrderValue').textContent = formatNaira(data.aov);
    document.getElementById('customerSatisfaction').textContent = data.satisfaction + '/5';
    
    // Update trends
    updateTrends();
}

// Update trends (mock)
function updateTrends() {
    document.getElementById('revenueTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 12.5%';
    document.getElementById('ordersTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 8.2%';
    document.getElementById('customersTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 5.7%';
    document.getElementById('conversionTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 2.1%';
    document.getElementById('aovTrend').innerHTML = '<i class="fas fa-arrow-down"></i> 1.3%';
    document.getElementById('satisfactionTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 0.2%';
}

// Update revenue & orders chart
function updateRevenueOrdersChart() {
    const ctx = document.getElementById('revenueOrdersChart')?.getContext('2d');
    if (!ctx) return;
    
    // Destroy existing chart
    if (revenueOrdersChart) {
        revenueOrdersChart.destroy();
    }
    
    // Mock data based on date range
    let labels = [];
    let revenueData = [];
    let ordersData = [];
    
    if (currentDateRange === 7) {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        revenueData = [85000, 92000, 88000, 105000, 120000, 135000, 142000];
        ordersData = [8, 10, 9, 12, 14, 16, 18];
    } else if (currentDateRange === 30) {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        revenueData = [245000, 312000, 298000, 385000];
        ordersData = [32, 38, 36, 45];
    } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        revenueData = [380000, 420000, 450000, 480000, 520000, 580000];
        ordersData = [48, 52, 58, 62, 68, 75];
    }
    
    revenueOrdersChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue (₦)',
                    data: revenueData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Orders',
                    data: ordersData,
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.dataset.label.includes('Revenue')) {
                                label += '₦' + context.parsed.y.toLocaleString('en-NG');
                            } else {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Revenue (₦)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₦' + (value / 1000) + 'k';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Orders'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Update category chart
function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart')?.getContext('2d');
    if (!ctx) return;
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Clothing', 'Shoes', 'Accessories'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: ['#667eea', '#f093fb', '#4facfe'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '60%'
        }
    });
    
    // Update category stats list
    const categoryList = document.getElementById('categoryStatsList');
    if (categoryList) {
        categoryList.innerHTML = `
            <div class="category-stat">
                <span class="category-name">
                    <span class="color-dot" style="background: #667eea;"></span>
                    Clothing
                </span>
                <span class="category-sales">₦684,190</span>
                <span class="category-percentage">55%</span>
            </div>
            <div class="category-stat">
                <span class="category-name">
                    <span class="color-dot" style="background: #f093fb;"></span>
                    Shoes
                </span>
                <span class="category-sales">₦373,740</span>
                <span class="category-percentage">30%</span>
            </div>
            <div class="category-stat">
                <span class="category-name">
                    <span class="color-dot" style="background: #4facfe;"></span>
                    Accessories
                </span>
                <span class="category-sales">₦186,870</span>
                <span class="category-percentage">15%</span>
            </div>
        `;
    }
}

// Update top products
function updateTopProducts() {
    const topProductsList = document.getElementById('topProductsList');
    if (!topProductsList) return;
    
    topProductsList.innerHTML = `
        <div class="top-product-item">
            <div class="product-rank">1</div>
            <img src="assets/images/product1.jpg" alt="Product">
            <div class="product-info">
                <h4>Premium Cotton Shirt</h4>
                <p>48 units sold</p>
            </div>
            <div class="product-revenue">₦1,195,200</div>
        </div>
        <div class="top-product-item">
            <div class="product-rank">2</div>
            <img src="assets/images/product5.jpg" alt="Product">
            <div class="product-info">
                <h4>Leather Loafers</h4>
                <p>32 units sold</p>
            </div>
            <div class="product-revenue">₦1,244,800</div>
        </div>
        <div class="top-product-item">
            <div class="product-rank">3</div>
            <img src="assets/images/product3.jpg" alt="Product">
            <div class="product-info">
                <h4>Leather Jacket</h4>
                <p>18 units sold</p>
            </div>
            <div class="product-revenue">₦826,200</div>
        </div>
        <div class="top-product-item">
            <div class="product-rank">4</div>
            <img src="assets/images/product2.jpg" alt="Product">
            <div class="product-info">
                <h4>Slim Fit Chinos</h4>
                <p>42 units sold</p>
            </div>
            <div class="product-revenue">₦793,800</div>
        </div>
        <div class="top-product-item">
            <div class="product-rank">5</div>
            <img src="assets/images/product6.jpg" alt="Product">
            <div class="product-info">
                <h4>Leather Belt</h4>
                <p>35 units sold</p>
            </div>
            <div class="product-revenue">₦311,500</div>
        </div>
    `;
}

// Update geographic stats
function updateGeoStats() {
    const geoList = document.getElementById('geoStatsList');
    if (!geoList) return;
    
    geoList.innerHTML = `
        <div class="geo-stat-item">
            <span class="state">Lagos</span>
            <span class="orders">245 orders</span>
            <span class="percentage">35%</span>
            <div class="progress-bar">
                <div class="progress" style="width: 35%"></div>
            </div>
        </div>
        <div class="geo-stat-item">
            <span class="state">FCT</span>
            <span class="orders">125 orders</span>
            <span class="percentage">18%</span>
            <div class="progress-bar">
                <div class="progress" style="width: 18%"></div>
            </div>
        </div>
        <div class="geo-stat-item">
            <span class="state">Rivers</span>
            <span class="orders">85 orders</span>
            <span class="percentage">12%</span>
            <div class="progress-bar">
                <div class="progress" style="width: 12%"></div>
            </div>
        </div>
        <div class="geo-stat-item">
            <span class="state">Oyo</span>
            <span class="orders">65 orders</span>
            <span class="percentage">9%</span>
            <div class="progress-bar">
                <div class="progress" style="width: 9%"></div>
            </div>
        </div>
        <div class="geo-stat-item">
            <span class="state">Kano</span>
            <span class="orders">45 orders</span>
            <span class="percentage">6%</span>
            <div class="progress-bar">
                <div class="progress" style="width: 6%"></div>
            </div>
        </div>
    `;
}

// Update customer acquisition chart
function updateCustomerAcquisitionChart() {
    const ctx = document.getElementById('customerAcquisitionChart')?.getContext('2d');
    if (!ctx) return;
    
    if (customerAcquisitionChart) {
        customerAcquisitionChart.destroy();
    }
    
    let labels = [];
    let data = [];
    
    if (currentDateRange === 30) {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [35, 42, 38, 45];
    } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        data = [65, 72, 78, 85, 92, 105];
    }
    
    customerAcquisitionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Customers',
                data: data,
                backgroundColor: '#4facfe',
                borderRadius: 4
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

// Update payment chart
function updatePaymentChart() {
    const ctx = document.getElementById('paymentChart')?.getContext('2d');
    if (!ctx) return;
    
    if (paymentChart) {
        paymentChart.destroy();
    }
    
    paymentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Paystack', 'Pay on Delivery'],
            datasets: [{
                data: [65, 35],
                backgroundColor: ['#667eea', '#f093fb'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '60%'
        }
    });
    
    // Update payment stats list
    const paymentList = document.getElementById('paymentStatsList');
    if (paymentList) {
        paymentList.innerHTML = `
            <div class="payment-stat">
                <span class="payment-method">
                    <span class="color-dot" style="background: #667eea;"></span>
                    Paystack
                </span>
                <span class="payment-count">101 orders</span>
                <span class="payment-percentage">65%</span>
            </div>
            <div class="payment-stat">
                <span class="payment-method">
                    <span class="color-dot" style="background: #f093fb;"></span>
                    Pay on Delivery
                </span>
                <span class="payment-count">55 orders</span>
                <span class="payment-percentage">35%</span>
            </div>
        `;
    }
}

// Update device chart
function updateDeviceChart() {
    const ctx = document.getElementById('deviceChart')?.getContext('2d');
    if (!ctx) return;
    
    if (deviceChart) {
        deviceChart.destroy();
    }
    
    deviceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mobile', 'Desktop', 'Tablet'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: ['#4facfe', '#667eea', '#f093fb'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '60%'
        }
    });
    
    // Update device stats list
    const deviceList = document.getElementById('deviceStatsList');
    if (deviceList) {
        deviceList.innerHTML = `
            <div class="device-stat">
                <span class="device-name">
                    <span class="color-dot" style="background: #4facfe;"></span>
                    Mobile
                </span>
                <span class="device-percentage">55%</span>
            </div>
            <div class="device-stat">
                <span class="device-name">
                    <span class="color-dot" style="background: #667eea;"></span>
                    Desktop
                </span>
                <span class="device-percentage">35%</span>
            </div>
            <div class="device-stat">
                <span class="device-name">
                    <span class="color-dot" style="background: #f093fb;"></span>
                    Tablet
                </span>
                <span class="device-percentage">10%</span>
            </div>
        `;
    }
}

// Update status distribution
function updateStatusDistribution() {
    const container = document.getElementById('statusDistribution');
    if (!container) return;
    
    container.innerHTML = `
        <div class="status-bar-item">
            <div class="status-label">
                <span>Pending</span>
                <span class="status-count">12 orders</span>
            </div>
            <div class="progress-bar">
                <div class="progress pending" style="width: 8%"></div>
            </div>
        </div>
        <div class="status-bar-item">
            <div class="status-label">
                <span>Processing</span>
                <span class="status-count">28 orders</span>
            </div>
            <div class="progress-bar">
                <div class="progress processing" style="width: 18%"></div>
            </div>
        </div>
        <div class="status-bar-item">
            <div class="status-label">
                <span>Shipped</span>
                <span class="status-count">45 orders</span>
            </div>
            <div class="progress-bar">
                <div class="progress shipped" style="width: 29%"></div>
            </div>
        </div>
        <div class="status-bar-item">
            <div class="status-label">
                <span>Delivered</span>
                <span class="status-count">62 orders</span>
            </div>
            <div class="progress-bar">
                <div class="progress delivered" style="width: 40%"></div>
            </div>
        </div>
        <div class="status-bar-item">
            <div class="status-label">
                <span>Cancelled</span>
                <span class="status-count">9 orders</span>
            </div>
            <div class="progress-bar">
                <div class="progress cancelled" style="width: 6%"></div>
            </div>
        </div>
    `;
}

// Open custom date range modal
function openCustomDateRange() {
    openModal('customDateModal');
}

// Apply custom date range
function applyCustomDateRange() {
    const startDate = document.getElementById('customStartDate').value;
    const endDate = document.getElementById('customEndDate').value;
    
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showNotification('Start date must be before end date', 'error');
        return;
    }
    
    closeModal('customDateModal');
    showNotification(`Analytics updated for custom date range`, 'success');
}

// Export analytics
function exportAnalytics() {
    openModal('exportModal');
}

// Generate report
function generateReport() {
    const format = document.getElementById('exportFormat').value;
    const dateRange = document.getElementById('exportDateRange').value;
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('exportModal');
        showNotification(`Report exported as ${format.toUpperCase()}`, 'success');
        
        // Simulate file download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `captains-signature-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
        link.click();
    }, 2000);
}

// Load category sales
function loadCategorySales() {
    const period = document.getElementById('categoryPeriod')?.value;
    updateCategoryChart();
}

// Format Naira
function formatNaira(amount) {
    return '₦' + amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAnalytics);