// API Base URL
const API_URL = 'https://inventory-system-production-18d5.up.railway.app'; // Cambia esto a tu URL de Railway en producción

// Login function
function login(username, password) {
    const loginAlert = document.getElementById('login-alert');
    
    fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        return response.json();
    })
    .then(data => {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            roles: data.roles
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    })
    .catch(error => {
        loginAlert.textContent = error.message;
        loginAlert.classList.remove('d-none');
        setTimeout(() => {
            loginAlert.classList.add('d-none');
        }, 3000);
    });
}

// Register function
function register(username, email, password, roles = ['user']) {
    const registerAlert = document.getElementById('register-alert');
    
    // Muestra mensaje de carga
    registerAlert.textContent = "Enviando solicitud...";
    registerAlert.classList.remove('d-none', 'alert-danger');
    registerAlert.classList.add('alert-info');
    
    fetch(`https://inventory-system-production-18d5.up.railway.app/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password,
            roles
        }),
        // Importante: no enviar credenciales si tienes problemas CORS
        credentials: 'omit'
    })
    .then(response => {
        console.log("Respuesta recibida:", response);
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Error al registrarse');
            }).catch(err => {
                // Si no puede parsear como JSON
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        registerAlert.textContent = 'Registro exitoso. Redirigiendo al login...';
        registerAlert.classList.remove('alert-info', 'alert-danger');
        registerAlert.classList.add('alert-success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    })
    .catch(error => {
        console.error("Error completo:", error);
        registerAlert.textContent = error.message || "Error en la comunicación con el servidor";
        registerAlert.classList.remove('alert-info');
        registerAlert.classList.add('alert-danger');
    });
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Check if user has role
function hasRole(role) {
    const user = getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.includes(`ROLE_${role.toUpperCase()}`);
}

// Add event listener for logout button if present
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});