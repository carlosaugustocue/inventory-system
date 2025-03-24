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
    console.log("Enviando datos:", { username, email, password, roles });
    
    fetch('https://inventory-system-production-18d5.up.railway.app/api/auth/signup', {
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
        credentials: 'omit' // Para evitar problemas CORS
    })
    .then(response => {
        console.log("Respuesta completa:", response);
        return response.text().then(text => {
            console.log("Cuerpo de la respuesta:", text);
            try {
                return text ? JSON.parse(text) : {};
            } catch (e) {
                console.error("Error al parsear JSON:", e);
                return { message: text };
            }
        });
    })
    .then(data => {
        console.log("Datos procesados:", data);
        // Resto del código...
    })
    .catch(error => {
        console.error("Error completo:", error);
        // Resto del código...
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