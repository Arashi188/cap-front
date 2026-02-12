// Settings Management JavaScript

// DOM Elements
let settingsTabs = document.querySelectorAll('.settings-tab');
let settingsPanes = document.querySelectorAll('.settings-pane');
let saveAllBtn = document.getElementById('saveAllSettings');

// Nigerian states for delivery fees
const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti',
    'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
];

// Mock delivery fees data
const mockDeliveryFees = [
    { state: 'Lagos', base_fee: 2500, additional_fee: 0, min_days: 2, max_days: 4, active: true },
    { state: 'FCT', base_fee: 2500, additional_fee: 0, min_days: 2, max_days: 4, active: true },
    { state: 'Oyo', base_fee: 2500, additional_fee: 0, min_days: 3, max_days: 5, active: true },
    { state: 'Rivers', base_fee: 2500, additional_fee: 0, min_days: 3, max_days: 5, active: true },
    { state: 'Kano', base_fee: 3500, additional_fee: 500, min_days: 5, max_days: 8, active: true },
    { state: 'Kaduna', base_fee: 3000, additional_fee: 500, min_days: 4, max_days: 6, active: true },
    { state: 'Borno', base_fee: 4000, additional_fee: 1500, min_days: 7, max_days: 10, active: true },
    { state: 'Sokoto', base_fee: 4000, additional_fee: 1500, min_days: 7, max_days: 10, active: true }
];

// Initialize settings page
function initSettings() {
    loadDeliveryFees();
    
    // Add event listeners
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => switchSettingsTab(tab));
    });
    
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllSettings);
    }
    
    // Add form change listeners
    addFormChangeListeners();
    
    // Initialize toggles
    initToggles();
}

// Switch settings tab
function switchSettingsTab(tab) {
    // Remove active class from all tabs and panes
    settingsTabs.forEach(t => t.classList.remove('active'));
    settingsPanes.forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Show corresponding pane
    const tabId = tab.dataset.tab;
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add('active');
    }
    
    // Load tab-specific data
    switch(tabId) {
        case 'shipping':
            loadDeliveryFees();
            break;
        case 'team':
            loadTeamMembers();
            break;
        case 'payment':
            loadPaymentSettings();
            break;
    }
}

// Load delivery fees
function loadDeliveryFees() {
    const tableBody = document.getElementById('deliveryFeesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    nigerianStates.forEach(state => {
        const existingFee = mockDeliveryFees.find(f => f.state === state) || {
            state,
            base_fee: 3000,
            additional_fee: 500,
            min_days: 4,
            max_days: 7,
            active: true
        };
        
        const row = createDeliveryFeeRow(existingFee);
        tableBody.appendChild(row);
    });
}

// Create delivery fee table row
function createDeliveryFeeRow(fee) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td>${fee.state}</td>
        <td>
            <div class="input-group">
                <span class="input-group-text">₦</span>
                <input type="number" class="fee-input base-fee" value="${fee.base_fee}" min="0" step="100" data-state="${fee.state}">
            </div>
        </td>
        <td>
            <div class="input-group">
                <span class="input-group-text">₦</span>
                <input type="number" class="fee-input additional-fee" value="${fee.additional_fee}" min="0" step="100" data-state="${fee.state}">
            </div>
        </td>
        <td>
            <div class="days-input-group">
                <input type="number" class="fee-input days-min" value="${fee.min_days}" min="1" max="30" data-state="${fee.state}">
                <span>-</span>
                <input type="number" class="fee-input days-max" value="${fee.max_days}" min="1" max="30" data-state="${fee.state}">
            </div>
        </td>
        <td>
            <label class="toggle-label small">
                <input type="checkbox" class="toggle-input status-toggle" ${fee.active ? 'checked' : ''} data-state="${fee.state}">
                <span class="toggle-slider"></span>
            </label>
        </td>
        <td>
            <button class="action-btn save" onclick="saveDeliveryFee('${fee.state}')" title="Save changes">
                <i class="fas fa-save"></i>
            </button>
            <button class="action-btn reset" onclick="resetDeliveryFee('${fee.state}')" title="Reset to default">
                <i class="fas fa-undo"></i>
            </button>
        </td>
    `;
    
    return tr;
}

// Save delivery fee
function saveDeliveryFee(state) {
    const row = document.querySelector(`[data-state="${state}"]`)?.closest('tr');
    if (!row) return;
    
    const baseFee = row.querySelector('.base-fee').value;
    const additionalFee = row.querySelector('.additional-fee').value;
    const daysMin = row.querySelector('.days-min').value;
    const daysMax = row.querySelector('.days-max').value;
    const active = row.querySelector('.status-toggle').checked;
    
    showNotification(`Delivery fee for ${state} updated successfully`, 'success');
}

// Reset delivery fee
function resetDeliveryFee(state) {
    const defaultFees = {
        'Lagos': { base: 2500, additional: 0, min: 2, max: 4 },
        'FCT': { base: 2500, additional: 0, min: 2, max: 4 },
        'Borno': { base: 4000, additional: 1500, min: 7, max: 10 },
        'Sokoto': { base: 4000, additional: 1500, min: 7, max: 10 }
    };
    
    const defaults = defaultFees[state] || { base: 3000, additional: 500, min: 4, max: 7 };
    
    const row = document.querySelector(`[data-state="${state}"]`)?.closest('tr');
    if (row) {
        row.querySelector('.base-fee').value = defaults.base;
        row.querySelector('.additional-fee').value = defaults.additional;
        row.querySelector('.days-min').value = defaults.min;
        row.querySelector('.days-max').value = defaults.max;
    }
    
    showNotification(`Delivery fee for ${state} reset to default`, 'info');
}

// Load team members
function loadTeamMembers() {
    // Already populated in HTML
}

// Load payment settings
function loadPaymentSettings() {
    // Mock payment settings
    document.getElementById('paystackPublicKey').value = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    document.getElementById('paystackSecretKey').value = 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
}

// Add admin user
function addAdminUser() {
    openModal('addAdminModal');
}

// Save new admin
function saveAdmin() {
    const form = document.getElementById('addAdminForm');
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const role = document.getElementById('adminRole').value;
    
    if (!name || !email || !password || !role) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
        showNotification('Password does not meet security requirements', 'error');
        return;
    }
    
    // Simulate API call
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('addAdminModal');
        showNotification(`Admin user ${email} created successfully`, 'success');
        form.reset();
    }, 1500);
}

// Edit admin
function editAdmin(adminId) {
    showNotification('Edit admin feature coming soon', 'info');
}

// Delete admin
function deleteAdmin(adminId) {
    if (confirm('Are you sure you want to delete this admin user?')) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Admin user deleted successfully', 'success');
        }, 1000);
    }
}

// Configure payment gateway
function configureGateway(gateway) {
    showNotification(`Configuring ${gateway}...`, 'info');
}

// Enable payment gateway
function enableGateway(gateway) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification(`${gateway} enabled successfully`, 'success');
    }, 1000);
}

// Disable payment gateway
function disableGateway(gateway) {
    if (confirm(`Are you sure you want to disable ${gateway}?`)) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`${gateway} disabled successfully`, 'success');
        }, 1000);
    }
}

// Test email connection
function testEmailConnection() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Email connection test successful!', 'success');
    }, 1500);
}

// Edit email template
function editTemplate(templateId) {
    showNotification(`Editing template: ${templateId}`, 'info');
}

// Preview email template
function previewTemplate(templateId) {
    showNotification(`Previewing template: ${templateId}`, 'info');
}

// Toggle secret visibility
function toggleSecretVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }
}

// Copy API key
function copyApiKey(type) {
    const keyText = type === 'admin' 
        ? 'csi_admin_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        : 'csi_pub_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    
    navigator.clipboard.writeText(keyText).then(() => {
        showNotification('API key copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Failed to copy API key', 'error');
    });
}

// Regenerate API key
function regenerateApiKey(type) {
    if (confirm(`Are you sure you want to regenerate your ${type} API key?`)) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`${type} API key regenerated successfully`, 'success');
        }, 1500);
    }
}

// Save all settings
function saveAllSettings() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('All settings saved successfully', 'success');
    }, 1500);
}

// Validate password strength
function validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Must contain an uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Must contain a lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('Must contain a number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Must contain a special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Add form change listeners
function addFormChangeListeners() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                // Mark form as dirty
                form.dataset.dirty = 'true';
                if (saveAllBtn) {
                    saveAllBtn.classList.add('has-changes');
                }
            });
        });
    });
}

// Initialize toggle switches
function initToggles() {
    document.querySelectorAll('.toggle-input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const relatedInputs = document.querySelectorAll(`[data-depends-on="${this.id}"]`);
            relatedInputs.forEach(input => {
                input.disabled = !this.checked;
            });
        });
    });
}

// VAT toggle dependency
document.getElementById('enableVAT')?.addEventListener('change', function() {
    document.getElementById('vatRate').disabled = !this.checked;
});

// Free shipping toggle dependency
document.getElementById('freeShippingEnabled')?.addEventListener('change', function() {
    document.getElementById('freeShippingThreshold').disabled = !this.checked;
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSettings);