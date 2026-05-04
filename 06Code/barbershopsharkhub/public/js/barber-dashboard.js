/* ==========================================================================
   SharkHub Barber Dashboard — CRUD Operations
   Handles fetching and managing services and products.
   ========================================================================== */

'use strict';

const BARBERSHOP_ID = 'bf338534-365a-4d8d-b45d-1e961e182467'; // En una app real, esto vendría del perfil del usuario logueado

document.addEventListener('DOMContentLoaded', function () {
    loadServices();
    loadProducts();

    // Event listeners para los botones de "Nuevo"
    const addServiceBtn = document.querySelector('#services .btn-outline-gold');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => openServiceModal());
    }

    const addProductBtn = document.querySelector('#products .btn-outline-gold');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductModal());
    }
});

/**
 * Carga los productos desde la API y los renderiza en la tabla.
 */
async function loadProducts() {
    try {
        const response = await fetch(`/api/barber/products?barbershop_id=${BARBERSHOP_ID}`);
        const products = await response.json();
        
        const tbody = document.querySelector('#products tbody');
        tbody.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description || 'Sin descripción'}</td>
                <td>${product.stock}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>
                    <button class="action-btn" onclick="editProduct('${product.id}')" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="action-btn delete" onclick="deleteProduct('${product.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

/**
 * Carga los servicios desde la API y los renderiza en la tabla.
 */
async function loadServices() {
    try {
        const response = await fetch(`/api/barber/services?barbershop_id=${BARBERSHOP_ID}`);
        const services = await response.json();
        
        const tbody = document.querySelector('#services tbody');
        tbody.innerHTML = '';

        services.forEach(service => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${service.name}</td>
                <td>${service.description || 'Sin descripción'}</td>
                <td>${service.duration_minutes} min</td>
                <td>$${parseFloat(service.price).toFixed(2)}</td>
                <td>
                    <button class="action-btn" onclick="editService('${service.id}')" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="action-btn delete" onclick="deleteService('${service.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando servicios:', error);
    }
}

/**
 * Elimina un producto.
 */
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
        const response = await fetch(`/api/barber/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadProducts();
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Elimina un servicio.
 */
async function deleteService(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) return;
    
    try {
        const response = await fetch(`/api/barber/services/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadServices();
        } else {
            alert('Error al eliminar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Abre el modal para agregar un nuevo producto.
 */
function openProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalLabel').innerText = 'Add New Product';
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

/**
 * Abre el modal para editar un producto existente.
 */
async function editProduct(id) {
    try {
        const response = await fetch(`/api/barber/products?barbershop_id=${BARBERSHOP_ID}`);
        const products = await response.json();
        const product = products.find(p => p.id === id);

        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productModalLabel').innerText = 'Edit Product';
            
            const modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

/**
 * Manejador del formulario de productos.
 */
document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        barbershop_id: BARBERSHOP_ID
    };

    try {
        const url = id ? `/api/barber/products/${id}` : '/api/barber/products';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            loadProducts();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

/**
 * Abre el modal para agregar un nuevo servicio.
 */
function openServiceModal() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceModalLabel').innerText = 'Add New Service';
    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
}

/**
 * Abre el modal para editar un servicio existente.
 */
async function editService(id) {
    try {
        const response = await fetch(`/api/barber/services?barbershop_id=${BARBERSHOP_ID}`);
        const services = await response.json();
        const service = services.find(s => s.id === id);

        if (service) {
            document.getElementById('serviceId').value = service.id;
            document.getElementById('serviceName').value = service.name;
            document.getElementById('serviceDescription').value = service.description || '';
            document.getElementById('servicePrice').value = service.price;
            document.getElementById('serviceDuration').value = service.duration_minutes;
            document.getElementById('serviceModalLabel').innerText = 'Edit Service';
            
            const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Error fetching service details:', error);
    }
}

/**
 * Manejador del formulario de servicios.
 */
document.getElementById('serviceForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const id = document.getElementById('serviceId').value;
    const data = {
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value),
        duration_minutes: parseInt(document.getElementById('serviceDuration').value),
        barbershop_id: BARBERSHOP_ID
    };

    try {
        const url = id ? `/api/barber/services/${id}` : '/api/barber/services';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
            loadServices();
        } else {
            alert('Error al guardar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

