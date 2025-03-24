// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Get authentication headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    let errorMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401 || error.response.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../pages/login.html';
            errorMessage = 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.';
        } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
    }
    
    return errorMessage;
}

// Redirect if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '../pages/login.html';
        return false;
    }
    return true;
}

// Show alert message
function showAlert(selector, message, type = 'danger', duration = 3000) {
    const alertElement = document.querySelector(selector);
    if (alertElement) {
        alertElement.textContent = message;
        alertElement.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning', 'alert-info');
        alertElement.classList.add(`alert-${type}`);
        
        setTimeout(() => {
            alertElement.classList.add('d-none');
        }, duration);
    }
}