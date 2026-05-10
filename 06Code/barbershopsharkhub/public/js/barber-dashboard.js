/* ==========================================================================
   SharkHub Barber Dashboard — CRUD Operations
   Handles fetching and managing services and products.
   ========================================================================== */

'use strict';

const BARBERSHOP_ID = 'bf338534-365a-4d8d-b45d-1e961e182467'; // En una app real, esto vendría del perfil del usuario logueado
let productsData = [];
let servicesData = [];

function getModalInstance(modalId) {
    const modalElement = document.getElementById(modalId);

    if (!modalElement) {
        console.error(`No existe el modal con id: ${modalId}`);
        return null;
    }

    let modal = bootstrap.Modal.getInstance(modalElement);

    if (!modal) {
        modal = new bootstrap.Modal(modalElement);
    }

    return modal;
}

function hideModal(modalId) {
    const modal = getModalInstance(modalId);

    if (modal) {
        modal.hide();
    }
}

function formatPrice(value) {
    return `$${parseFloat(value || 0).toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function () {
    loadServices();
    loadProducts();

    // Event listeners para los botones de "Nuevo"
    const addServiceBtn = document.querySelector('#services [data-bs-target="#serviceModal"]');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => openServiceModal());
    }

    const addProductBtn = document.querySelector('#products [data-bs-target="#productModal"]');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductModal());
    }

    setupServiceActions();
    setupProductActions();
});

/**
 * Load Services
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
                <td>${service.duration_minutes || 0} min</td>
                <td>$${parseFloat(service.price || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        servicesData = services;
    } catch (error) {
        console.error('Error cargando servicios:', error);
    }
}

function setupServiceActions() {
    const openEditServicesModalBtn = document.getElementById('openEditServicesModalBtn');
    const openDeleteServicesModalBtn = document.getElementById('openDeleteServicesModalBtn');
    const confirmEditServiceBtn = document.getElementById('confirmEditServiceBtn');
    const confirmDeleteServicesBtn = document.getElementById('confirmDeleteServicesBtn');

    if (openEditServicesModalBtn) {
        openEditServicesModalBtn.addEventListener('click', function () {
            const tableBody = document.getElementById('editServicesTableBody');
            tableBody.innerHTML = '';

            if (servicesData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No hay servicios disponibles para editar.
                        </td>
                    </tr>
                `;
            } else {
                servicesData.forEach(service => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>
                            <input type="radio" name="edit-service-radio" class="edit-service-radio" value="${service.id}">
                        </td>
                        <td>${service.name}</td>
                        <td>${service.duration_minutes || 0} min</td>
                        <td>${formatPrice(service.price)}</td>
                    `;

                    tableBody.appendChild(row);
                });
            }

            getModalInstance('editServicesModal').show();
        });
    }

    if (confirmEditServiceBtn) {
        confirmEditServiceBtn.addEventListener('click', async function () {
            const selectedService = document.querySelector('.edit-service-radio:checked');

            if (!selectedService) {
                alert('Selecciona un servicio para editar.');
                return;
            }

            hideModal('editServicesModal');
            await editService(selectedService.value);
        });
    }

    if (openDeleteServicesModalBtn) {
        openDeleteServicesModalBtn.addEventListener('click', function () {
            const tableBody = document.getElementById('deleteServicesTableBody');
            tableBody.innerHTML = '';

            if (servicesData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No hay servicios disponibles para eliminar.
                        </td>
                    </tr>
                `;
            } else {
                servicesData.forEach(service => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>
                            <input type="checkbox" class="delete-service-checkbox" value="${service.id}">
                        </td>
                        <td>${service.name}</td>
                        <td>${service.duration_minutes || 0} min</td>
                        <td>${formatPrice(service.price)}</td>
                    `;

                    tableBody.appendChild(row);
                });
            }

            getModalInstance('deleteServicesModal').show();
        });
    }

    if (confirmDeleteServicesBtn) {
        confirmDeleteServicesBtn.addEventListener('click', async function () {
            const selectedCheckboxes = document.querySelectorAll('.delete-service-checkbox:checked');

            if (selectedCheckboxes.length === 0) {
                alert('Selecciona al menos un servicio.');
                return;
            }

            for (const checkbox of selectedCheckboxes) {
                await deleteService(checkbox.value);
            }

            hideModal('deleteServicesModal');
            await loadServices();
        });
    }
}

/**
 * Add new service modal
 */
function openServiceModal() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceModalLabel').innerText = 'Agregar Servicio';
    getModalInstance('serviceModal').show();
}

/**
 * edit service modal
 */
async function editService(id) {
    const service = servicesData.find(currentService => currentService.id === id);

    if (!service) {
        return;
    }

    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description || '';
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDuration').value = service.duration_minutes;
    document.getElementById('serviceModalLabel').innerText = 'Editar Servicio';

    getModalInstance('serviceModal').show();
}
/**
 * Delete a service by ID, with optional confirmation.
 * @param {string} id - The ID of the service to delete.
 */


async function deleteService(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        return false;
    }

    try {
        const response = await fetch(`/api/barber/services/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            return true;
        }

        alert('Error al eliminar el servicio');
        return false;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

/**
 * Submit handler for the service form, used for both creating and editing services.
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
            hideModal('serviceModal');
            await loadServices();
        } else {
            alert('Error al guardar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

/**
 * Load Products
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
                <td>${product.stock || 0}</td>
                <td>$${parseFloat(product.price || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        productsData = products;
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

/**
 * Product actions
 */
function setupProductActions() {
    const openEditProductsModalBtn = document.getElementById('openEditProductsModalBtn');
    const openDeleteProductsModalBtn = document.getElementById('openDeleteProductsModalBtn');
    const confirmEditProductBtn = document.getElementById('confirmEditProductBtn');
    const confirmDeleteProductsBtn = document.getElementById('confirmDeleteProductsBtn');

    if (openEditProductsModalBtn) {
        openEditProductsModalBtn.addEventListener('click', function () {
            const tableBody = document.getElementById('editProductsTableBody');

            if (!tableBody) {
                console.error('No existe editProductsTableBody en el HTML.');
                return;
            }

            tableBody.innerHTML = '';

            if (productsData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No hay productos disponibles para editar.
                        </td>
                    </tr>
                `;
            } else {
                productsData.forEach(product => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>
                            <input type="radio" name="edit-product-radio" class="edit-product-radio" value="${product.id}">
                        </td>
                        <td>${product.name}</td>
                        <td>${product.stock || 0}</td>
                        <td>${formatPrice(product.price)}</td>
                    `;

                    tableBody.appendChild(row);
                });
            }

            const modal = getModalInstance('editProductsModal');

            if (modal) {
                modal.show();
            }
        });
    }

    if (confirmEditProductBtn) {
        confirmEditProductBtn.addEventListener('click', async function () {
            const selectedProduct = document.querySelector('.edit-product-radio:checked');

            if (!selectedProduct) {
                alert('Selecciona un producto para editar.');
                return;
            }

            hideModal('editProductsModal');
            await editProduct(selectedProduct.value);
        });
    }

    if (openDeleteProductsModalBtn) {
        openDeleteProductsModalBtn.addEventListener('click', function () {
            const tableBody = document.getElementById('deleteProductsTableBody');

            if (!tableBody) {
                console.error('No existe deleteProductsTableBody en el HTML.');
                return;
            }

            tableBody.innerHTML = '';

            if (productsData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No hay productos disponibles para eliminar.
                        </td>
                    </tr>
                `;
            } else {
                productsData.forEach(product => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>
                            <input type="checkbox" class="delete-product-checkbox" value="${product.id}">
                        </td>
                        <td>${product.name}</td>
                        <td>${product.stock || 0}</td>
                        <td>${formatPrice(product.price)}</td>
                    `;

                    tableBody.appendChild(row);
                });
            }

            const modal = getModalInstance('deleteProductsModal');

            if (modal) {
                modal.show();
            }
        });
    }

    if (confirmDeleteProductsBtn) {
        confirmDeleteProductsBtn.addEventListener('click', async function () {
            const selectedCheckboxes = document.querySelectorAll('.delete-product-checkbox:checked');

            if (selectedCheckboxes.length === 0) {
                alert('Selecciona al menos un producto.');
                return;
            }

            for (const checkbox of selectedCheckboxes) {
                await deleteProduct(checkbox.value);
            }

            hideModal('deleteProductsModal');
            await loadProducts();
        });
    }
}

/**
 * Abre el modal para agregar un nuevo producto.
 */
function openProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalLabel').innerText = 'Agregar Producto';
    getModalInstance('productModal').show();
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
            document.getElementById('productModalLabel').innerText = 'Editar Producto';
            
            getModalInstance('productModal').show();
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

/**
 * Delete products
 */
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
        const response = await fetch(`/api/barber/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
            return true;
        }

        alert('Error al eliminar el producto');
        return false;
    } catch (error) {
        console.error('Error:', error);
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
            const modalElement = document.getElementById('productModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            loadProducts();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



