// Sai Shating and Suiting - Main JavaScript File

// Application state
let customers = [];
let currentTab = 'dashboard';
let isLoggedIn = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn && window.location.pathname.includes('dashboard.html')) {
        loadCustomers();
        setupDashboard();
        updateStatistics();
    } else if (!isLoggedIn && window.location.pathname.includes('dashboard.html')) {
        // Redirect to login if not logged in
        window.location.href = 'index.html';
    } else {
        setupLogin();
    }
}

// Login functionality
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would be server-side)
    if (username === 'admin' && password === '123456') {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        showToast('Login successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showToast('Invalid username or password', 'error');
        
        // Add error styling
        document.getElementById('username').classList.add('form-error');
        document.getElementById('password').classList.add('form-error');
        
        setTimeout(() => {
            document.getElementById('username').classList.remove('form-error');
            document.getElementById('password').classList.remove('form-error');
        }, 3000);
    }
}

// Dashboard functionality
function setupDashboard() {
    setupNavigation();
    setupCustomerForm();
    setupSearch();
    setupModals();
    
    // Load initial tab
    showTab('dashboard');
}

function setupNavigation() {
    // Tab navigation
    document.getElementById('dashboardTab').addEventListener('click', (e) => {
        e.preventDefault();
        showTab('dashboard');
    });
    
    document.getElementById('addCustomerTab').addEventListener('click', (e) => {
        e.preventDefault();
        showTab('addCustomer');
    });
    
    document.getElementById('customersTab').addEventListener('click', (e) => {
        e.preventDefault();
        showTab('customers');
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
    
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.classList.add('text-white/70');
        link.classList.remove('text-white');
        link.style.borderRight = 'none';
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Content').classList.remove('hidden');
    
    // Add active class to current nav link
    const activeLink = document.getElementById(tabName + 'Tab');
    activeLink.classList.add('active');
    activeLink.classList.remove('text-white/70');
    activeLink.classList.add('text-white');
    
    currentTab = tabName;
    
    // Update content based on tab
    if (tabName === 'customers') {
        displayCustomers();
    } else if (tabName === 'dashboard') {
        updateStatistics();
        displayRecentCustomers();
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Customer form functionality
function setupCustomerForm() {
    const customerForm = document.getElementById('customerForm');
    const resetBtn = document.getElementById('resetForm');
    const fabricPriceInput = document.getElementById('fabricPrice');
    const amountPaidInput = document.getElementById('amountPaid');
    const remainingAmountInput = document.getElementById('remainingAmount');
    
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerSubmit);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCustomerForm);
    }
    
    // Auto-calculate remaining amount
    if (fabricPriceInput && amountPaidInput) {
        [fabricPriceInput, amountPaidInput].forEach(input => {
            input.addEventListener('input', calculateRemainingAmount);
        });
    }
}

function calculateRemainingAmount() {
    const fabricPrice = parseFloat(document.getElementById('fabricPrice').value) || 0;
    const amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;
    const remaining = Math.max(0, fabricPrice - amountPaid);
    
    document.getElementById('remainingAmount').value = remaining.toFixed(2);
}

function handleCustomerSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const customer = {
        id: Date.now(),
        fullName: formData.get('fullName'),
        mobile: formData.get('mobile'),
        address: formData.get('address'),
        measurements: {
            neck: parseFloat(formData.get('neck')) || 0,
            shoulder: parseFloat(formData.get('shoulder')) || 0,
            sleeveLength: parseFloat(formData.get('sleeveLength')) || 0,
            chest: parseFloat(formData.get('chest')) || 0,
            waist: parseFloat(formData.get('waist')) || 0,
            hip: parseFloat(formData.get('hip')) || 0,
            height: parseFloat(formData.get('height')) || 0,
            pantLength: parseFloat(formData.get('pantLength')) || 0
        },
        fabricPrice: parseFloat(formData.get('fabricPrice')),
        amountPaid: parseFloat(formData.get('amountPaid')),
        remainingAmount: parseFloat(formData.get('remainingAmount')),
        dateAdded: new Date().toISOString(),
        status: parseFloat(formData.get('remainingAmount')) > 0 ? 'pending' : 'paid'
    };
    
    // Validation
    if (!validateCustomerData(customer)) {
        return;
    }
    
    // Add customer
    customers.push(customer);
    saveCustomers();
    
    showToast('Customer added successfully!', 'success');
    resetCustomerForm();
    updateStatistics();
    
    // Switch to customers tab to show the new customer
    setTimeout(() => {
        showTab('customers');
    }, 1500);
}

function validateCustomerData(customer) {
    const errors = [];
    
    if (!customer.fullName.trim()) {
        errors.push('Full name is required');
    }
    
    if (!customer.mobile.trim() || !/^\d{10}$/.test(customer.mobile)) {
        errors.push('Valid 10-digit mobile number is required');
    }
    
    if (!customer.address.trim()) {
        errors.push('Address is required');
    }
    
    if (customer.fabricPrice <= 0) {
        errors.push('Fabric price must be greater than 0');
    }
    
    if (customer.amountPaid < 0) {
        errors.push('Amount paid cannot be negative');
    }
    
    if (errors.length > 0) {
        showToast(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

function resetCustomerForm() {
    document.getElementById('customerForm').reset();
    document.getElementById('remainingAmount').value = '';
}

// Customer management
function loadCustomers() {
    const stored = localStorage.getItem('customers');
    if (stored) {
        customers = JSON.parse(stored);
    }
}

function saveCustomers() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

function displayCustomers() {
    const tbody = document.getElementById('customersTableBody');
    const table = document.getElementById('customersTable');
    
    if (!tbody) return;
    
    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    No customers found. Add some customers to see them here.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = customers.map(customer => `
        <tr class="hover:bg-gray-50 transition-colors" data-customer-id="${customer.id}">
            <td class="px-6 py-4" data-label="Customer">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-indigo-700 font-medium text-sm">
                                ${customer.fullName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${customer.fullName}</div>
                        <div class="text-sm text-gray-500">${formatDate(customer.dateAdded)}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900" data-label="Mobile">${customer.mobile}</td>
            <td class="px-6 py-4 text-sm text-gray-900" data-label="Total Amount">₹${customer.fabricPrice.toFixed(2)}</td>
            <td class="px-6 py-4 text-sm text-gray-900" data-label="Paid">₹${customer.amountPaid.toFixed(2)}</td>
            <td class="px-6 py-4" data-label="Remaining">
                <span class="status-badge ${customer.remainingAmount > 0 ? 'status-pending' : 'status-paid'}">
                    ₹${customer.remainingAmount.toFixed(2)}
                </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium" data-label="Actions">
                <div class="flex space-x-2">
                    <button onclick="printBill(${customer.id})" class="action-btn btn-primary" title="Print Bill">
                        <i class="fas fa-print"></i>
                    </button>
                    <button onclick="sendSMS(${customer.id})" class="action-btn btn-success" title="Send SMS">
                        <i class="fas fa-sms"></i>
                    </button>
                    <button onclick="editCustomer(${customer.id})" class="action-btn btn-warning" title="Edit Customer">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add responsive classes
    table.classList.add('responsive-table');
}

function displayRecentCustomers() {
    const container = document.getElementById('recentCustomers');
    if (!container) return;
    
    const recentCustomers = customers
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 5);
    
    if (recentCustomers.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No customers added yet. Click "Add Customer" to get started.</p>';
        return;
    }
    
    container.innerHTML = recentCustomers.map(customer => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg card-hover">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-700 font-medium">
                        ${customer.fullName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">${customer.fullName}</h4>
                    <p class="text-sm text-gray-500">${customer.mobile}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium text-gray-900">₹${customer.fabricPrice.toFixed(2)}</p>
                <p class="text-xs text-gray-500">${formatDate(customer.dateAdded)}</p>
            </div>
        </div>
    `).join('');
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchCustomer');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#customersTableBody tr[data-customer-id]');
    
    rows.forEach(row => {
        const customerData = row.textContent.toLowerCase();
        const isMatch = customerData.includes(searchTerm);
        
        if (isMatch) {
            row.style.display = '';
            if (searchTerm) {
                row.classList.add('search-highlight');
            } else {
                row.classList.remove('search-highlight');
            }
        } else {
            row.style.display = 'none';
            row.classList.remove('search-highlight');
        }
    });
    
    // Remove highlights after a delay
    setTimeout(() => {
        rows.forEach(row => {
            row.classList.remove('search-highlight');
        });
    }, 2000);
}

// Bill functionality
function setupModals() {
    const billModal = document.getElementById('billModal');
    const closeBillModal = document.getElementById('closeBillModal');
    const printBillBtn = document.getElementById('printBill');
    
    if (closeBillModal) {
        closeBillModal.addEventListener('click', () => {
            billModal.classList.add('hidden');
        });
    }
    
    if (printBillBtn) {
        printBillBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

function printBill(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const billContent = document.getElementById('billContent');
    const billModal = document.getElementById('billModal');
    
    billContent.innerHTML = generateBillHTML(customer);
    billModal.classList.remove('hidden');
}

function generateBillHTML(customer) {
    return `
        <div class="bill-header">
            <h1 class="text-3xl font-bold text-gray-900 gradient-text">Sai Shating & Suiting</h1>
            <p class="text-gray-600 mt-2">Custom Tailoring Services</p>
            <p class="text-sm text-gray-500 mt-1">Phone: +91 9876543210 | Email: info@saishating.com</p>
            <div class="mt-4">
                <h2 class="text-xl font-semibold text-gray-800">Customer Bill</h2>
                <p class="text-sm text-gray-500">Bill Date: ${formatDate(new Date().toISOString())}</p>
                <p class="text-sm text-gray-500">Customer ID: #${customer.id}</p>
            </div>
        </div>
        
        <div class="bill-section">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="fas fa-user mr-2 text-indigo-600"></i>Customer Information
            </h3>
            <div class="bill-grid">
                <div class="bill-item">
                    <span class="font-medium">Name:</span>
                    <span>${customer.fullName}</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Mobile:</span>
                    <span>${customer.mobile}</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Address:</span>
                    <span>${customer.address}</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Date Added:</span>
                    <span>${formatDate(customer.dateAdded)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="fas fa-ruler mr-2 text-indigo-600"></i>Measurements
            </h3>
            <div class="measurements-grid">
                <div class="bill-item">
                    <span class="font-medium">Neck:</span>
                    <span>${customer.measurements.neck}" inches</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Shoulder:</span>
                    <span>${customer.measurements.shoulder}" inches</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Sleeve Length:</span>
                    <span>${customer.measurements.sleeveLength}" inches</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Chest:</span>
                    <span>${customer.measurements.chest}" inches</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Waist:</span>
                    <span>${customer.measurements.waist}" inches</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Hip:</span>
                    <span>${customer.measurements.hip}" inches</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Height:</span>
                    <span>${customer.measurements.height}" feet</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Pant Length:</span>
                    <span>${customer.measurements.pantLength}" inches</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="fas fa-rupee-sign mr-2 text-indigo-600"></i>Payment Details
            </h3>
            <div class="space-y-2">
                <div class="bill-item">
                    <span class="font-medium">Fabric Price:</span>
                    <span>₹${customer.fabricPrice.toFixed(2)}</span>
                </div>
                <div class="bill-item">
                    <span class="font-medium">Amount Paid:</span>
                    <span class="text-green-600">₹${customer.amountPaid.toFixed(2)}</span>
                </div>
                <div class="bill-item bill-total">
                    <span class="font-bold">Remaining Amount:</span>
                    <span class="font-bold text-lg ${customer.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}">
                        ₹${customer.remainingAmount.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="text-center">
                <p class="text-sm text-gray-600 mb-2">Thank you for choosing Sai Shating & Suiting!</p>
                <p class="text-xs text-gray-500">For any queries, please contact us at +91 9876543210</p>
                <div class="mt-4 pt-4 border-t border-gray-300">
                    <p class="text-xs text-gray-400">This is a computer-generated bill.</p>
                </div>
            </div>
        </div>
    `;
}

// SMS functionality
function sendSMS(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Simulate SMS sending
    const message = `Dear ${customer.fullName}, your tailoring order is being processed. Total: ₹${customer.fabricPrice.toFixed(2)}, Paid: ₹${customer.amountPaid.toFixed(2)}, Remaining: ₹${customer.remainingAmount.toFixed(2)}. Thank you! - Sai Shating & Suiting`;
    
    // In a real app, this would integrate with an SMS API
    showToast(`SMS sent to ${customer.mobile}: "${message}"`, 'success');
    
    // Simulate SMS API call
    console.log('SMS API Call:', {
        to: customer.mobile,
        message: message,
        timestamp: new Date().toISOString()
    });
}

// Edit customer functionality
function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Fill the form with customer data
    document.getElementById('fullName').value = customer.fullName;
    document.getElementById('mobile').value = customer.mobile;
    document.getElementById('address').value = customer.address;
    
    // Fill measurements
    Object.keys(customer.measurements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = customer.measurements[key];
        }
    });
    
    // Fill payment info
    document.getElementById('fabricPrice').value = customer.fabricPrice;
    document.getElementById('amountPaid').value = customer.amountPaid;
    document.getElementById('remainingAmount').value = customer.remainingAmount;
    
    // Remove the customer from array (will be re-added when form is submitted)
    customers = customers.filter(c => c.id !== customerId);
    saveCustomers();
    
    // Switch to add customer tab
    showTab('addCustomer');
    
    showToast('Customer data loaded for editing', 'info');
}

// Statistics
function updateStatistics() {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.amountPaid, 0);
    const pendingAmount = customers.reduce((sum, customer) => sum + customer.remainingAmount, 0);
    
    // Calculate this month's customers
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthCustomers = customers.filter(customer => {
        const customerDate = new Date(customer.dateAdded);
        return customerDate.getMonth() === thisMonth && customerDate.getFullYear() === thisYear;
    }).length;
    
    // Update DOM elements
    const totalCustomersEl = document.getElementById('totalCustomers');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const pendingAmountEl = document.getElementById('pendingAmount');
    const thisMonthCustomersEl = document.getElementById('thisMonthCustomers');
    
    if (totalCustomersEl) totalCustomersEl.textContent = totalCustomers;
    if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue.toFixed(0);
    if (pendingAmountEl) pendingAmountEl.textContent = pendingAmount.toFixed(0);
    if (thisMonthCustomersEl) thisMonthCustomersEl.textContent = thisMonthCustomers;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)} mr-2"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Form validation helpers
function validatePhoneNumber(phone) {
    return /^\d{10}$/.test(phone);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Export functions for global use
window.printBill = printBill;
window.sendSMS = sendSMS;
window.editCustomer = editCustomer;