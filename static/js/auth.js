// API Configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINTS = {
    register: '/api/users/register',
    login: '/api/users/login',
    getCurrentUser: '/api/users/me'
};

// Token Management
function setToken(token) {
    localStorage.setItem('access_token', token);
}

function getToken() {
    return localStorage.getItem('access_token');
}

function removeToken() {
    localStorage.removeItem('access_token');
}

function isTokenExpired() {
    const token = getToken();
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return Date.now() >= expirationTime;
    } catch (error) {
        return true;
    }
}

// Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one digit' };
    }
    if (password.length > 72) {
        return { valid: false, message: 'Password must not exceed 72 characters' };
    }
    return { valid: true, message: '' };
}

function validateUsername(username) {
    if (username.length < 3 || username.length > 50) {
        return { valid: false, message: 'Username must be between 3 and 50 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { valid: true, message: '' };
}

// UI Helper Functions
function showMessage(message, type = 'error') {
    const messageContainer = document.getElementById('message-container');
    const messageText = document.getElementById('message-text');
    
    messageContainer.className = `message-container ${type}`;
    messageText.textContent = message;
    messageContainer.style.display = 'block';
    
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = '';
        inputElement.classList.remove('error');
    }
}

function setFieldSuccess(fieldId) {
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
        input.classList.remove('success');
    });
}

function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = isLoading;
        button.textContent = isLoading ? 'Processing...' : button.getAttribute('data-original-text') || button.textContent;
        if (!isLoading && !button.hasAttribute('data-original-text')) {
            button.setAttribute('data-original-text', button.textContent);
        }
    }
}

// API Call Functions
async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.register}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw { status: response.status, data };
    }
    
    return data;
}

async function loginUser(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw { status: response.status, data };
    }
    
    return data;
}

async function getCurrentUser() {
    const token = getToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.getCurrentUser}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw { status: response.status, data };
    }
    
    return data;
}

// Registration Page Functions
function initRegisterPage() {
    const form = document.getElementById('register-form');
    const submitBtn = document.getElementById('submit-btn');
    
    submitBtn.setAttribute('data-original-text', 'Register');
    
    // Real-time validation
    document.getElementById('username').addEventListener('blur', function() {
        const validation = validateUsername(this.value);
        if (this.value && !validation.valid) {
            showFieldError('username', validation.message);
        } else if (this.value) {
            setFieldSuccess('username');
            clearFieldError('username');
        }
    });
    
    document.getElementById('email').addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            showFieldError('email', 'Please enter a valid email address');
        } else if (this.value) {
            setFieldSuccess('email');
            clearFieldError('email');
        }
    });
    
    document.getElementById('password').addEventListener('blur', function() {
        const validation = validatePassword(this.value);
        if (this.value && !validation.valid) {
            showFieldError('password', validation.message);
        } else if (this.value) {
            setFieldSuccess('password');
            clearFieldError('password');
        }
    });
    
    document.getElementById('confirm-password').addEventListener('blur', function() {
        const password = document.getElementById('password').value;
        if (this.value && this.value !== password) {
            showFieldError('confirm-password', 'Passwords do not match');
        } else if (this.value) {
            setFieldSuccess('confirm-password');
            clearFieldError('confirm-password');
        }
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearAllErrors();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        let hasError = false;
        
        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            showFieldError('username', usernameValidation.message);
            hasError = true;
        }
        
        // Validate email
        if (!validateEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasError = true;
        }
        
        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            showFieldError('password', passwordValidation.message);
            hasError = true;
        }
        
        // Validate confirm password
        if (password !== confirmPassword) {
            showFieldError('confirm-password', 'Passwords do not match');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        setButtonLoading('submit-btn', true);
        
        try {
            const userData = {
                username: username,
                email: email,
                password: password
            };
            
            const response = await registerUser(userData);
            
            showMessage('Registration successful! Redirecting to login...', 'success');
            
            setTimeout(() => {
                window.location.href = '/static/login.html';
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.status === 400 && error.data.detail) {
                if (typeof error.data.detail === 'string') {
                    showMessage(error.data.detail, 'error');
                } else if (Array.isArray(error.data.detail)) {
                    const errorMessages = error.data.detail.map(err => err.msg).join(', ');
                    showMessage(errorMessages, 'error');
                } else {
                    showMessage('Registration failed. Please check your input.', 'error');
                }
            } else {
                showMessage('Registration failed. Please try again.', 'error');
            }
            
            setButtonLoading('submit-btn', false);
        }
    });
}

// Login Page Functions
function initLoginPage() {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    
    submitBtn.setAttribute('data-original-text', 'Login');
    
    // Check if already logged in
    if (getToken() && !isTokenExpired()) {
        window.location.href = '/static/dashboard.html';
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearAllErrors();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        let hasError = false;
        
        if (!username) {
            showFieldError('username', 'Username or email is required');
            hasError = true;
        }
        
        if (!password) {
            showFieldError('password', 'Password is required');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        setButtonLoading('submit-btn', true);
        
        try {
            const response = await loginUser(username, password);
            
            setToken(response.access_token);
            
            showMessage('Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = '/static/dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.status === 401) {
                showMessage('Invalid username or password. Please try again.', 'error');
            } else if (error.status === 400 && error.data.detail) {
                showMessage(error.data.detail, 'error');
            } else {
                showMessage('Login failed. Please try again.', 'error');
            }
            
            setButtonLoading('submit-btn', false);
        }
    });
}

// Dashboard Page Functions
function initDashboardPage() {
    // Check authentication
    if (!getToken() || isTokenExpired()) {
        window.location.href = '/static/login.html';
        return;
    }
    
    // Load user information
    loadUserInfo();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            removeToken();
            showMessage('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/static/login.html';
            }, 1000);
        });
    }
}

async function loadUserInfo() {
    const userInfoDiv = document.getElementById('user-info');
    
    try {
        const user = await getCurrentUser();
        
        userInfoDiv.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
            <p><strong>Account Created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${user.is_active ? 'Active' : 'Inactive'}</p>
        `;
        
    } catch (error) {
        console.error('Error loading user info:', error);
        
        if (error.status === 401) {
            showMessage('Session expired. Please login again.', 'error');
            setTimeout(() => {
                removeToken();
                window.location.href = '/static/login.html';
            }, 2000);
        } else {
            userInfoDiv.innerHTML = '<p class="error-message">Failed to load user information</p>';
        }
    }
}
