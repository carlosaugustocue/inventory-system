// Load products from API
function loadProducts(category = '') {
    const productsTableBody = document.getElementById('products-table-body');
    productsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando productos...</td></tr>';
    
    let url = `${API_URL}/api/products`;
    if (category) {
        url = `${API_URL}/api/products/category/${category}`;
    }
    
    fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudieron cargar los productos');
        }
        return response.json();
    })
    .then(products => {
        if (products.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No hay productos disponibles</td></tr>';
            return;
        }
        
        productsTableBody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description || '-'}</td>
                <td>${product.quantity}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.category || '-'}</td>
                <td>${product.createdBy}</td>
                <td>
                    <div class="btn-group" role="group">
                        <a href="product-form.html?id=${product.id}" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            productsTableBody.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
                
                confirmDeleteBtn.setAttribute('data-id', productId);
                confirmDeleteBtn.addEventListener('click', deleteProduct);
            });
        });
    })
    .catch(error => {
        showAlert('#products-alert', handleApiError(error));
    });
}

// Filter products
function filterProducts(searchText, category) {
    if (category) {
        loadProducts(category);
    } else {
        loadProducts();
    }
    
    if (searchText) {
        const rows = document.querySelectorAll('#products-table-body tr');
        
        rows.forEach(row => {
            const productName = row.cells[1].textContent.toLowerCase();
            const productDescription = row.cells[2].textContent.toLowerCase();
            const searchValue = searchText.toLowerCase();
            
            if (productName.includes(searchValue) || productDescription.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// Delete product
function deleteProduct() {
    const productId = this.getAttribute('data-id');
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    
    fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('No tienes permiso para eliminar este producto');
            }
            throw new Error('Error al eliminar el producto');
        }
        
        // Close modal
        modal.hide();
        
        // Show success message
        showAlert('#products-alert', 'Producto eliminado con éxito', 'success');
        
        // Reload products
        setTimeout(() => {
            loadProducts();
        }, 1000);
    })
    .catch(error => {
        modal.hide();
        showAlert('#products-alert', handleApiError(error));
    });
}

// Create or update product
function saveProduct(productData, isEdit = false) {
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? 
        `${API_URL}/api/products/${productData.id}` : 
        `${API_URL}/api/products`;
    
    fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        const message = isEdit ? 'Producto actualizado con éxito' : 'Producto creado con éxito';
        showAlert('#product-form-alert', message, 'success');
        
        // Redirect to products page after a delay
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
    })
    .catch(error => {
        showAlert('#product-form-alert', handleApiError(error));
    });
}

// Load single product for editing
function loadProductForEdit(productId) {
    fetch(`${API_URL}/api/products/${productId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el producto');
        }
        return response.json();
    })
    .then(product => {
        // Populate form fields
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category || '';
        
        // Update form title
        document.getElementById('form-title').textContent = 'Editar Producto';
        
        // Update submit button
        const submitBtn = document.getElementById('submit-product');
        submitBtn.textContent = 'Actualizar Producto';
    })
    .catch(error => {
        showAlert('#product-form-alert', handleApiError(error));
    });
}