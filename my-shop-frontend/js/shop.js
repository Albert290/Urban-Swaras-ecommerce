// my-shop-frontend/js/shop.js

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Replace with your Laravel backend URL if different

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    const loadingDiv = document.getElementById('loading');
    const errorMessageDiv = document.getElementById('errorMessage');
    const productsGrid = document.getElementById('productsGrid');

    loadingDiv.classList.remove('d-none'); // Show loading spinner
    errorMessageDiv.classList.add('d-none'); // Hide error message
    productsGrid.innerHTML = ''; // Clear previous products

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const products = data.products || []; // Zoho API returns 'products' array

        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="col-12 text-center">No products found.</p>';
            return;
        }

        products.forEach(product => {
            const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
            const imageUrl = product.images && product.images.length > 0 ? product.images[0].image_thumb_url : 'https://via.placeholder.com/150?text=No+Image';

            const productCard = `
                <div class="col">
                    <div class="card product-card h-100" data-product-id="${product.product_id}">
                        <img src="${imageUrl}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text flex-grow-1">${product.product_description ? product.product_description.substring(0, 100) + '...' : 'No description available.'}</p>
                            <p class="card-text text-success fs-5 mt-auto"><strong>Price: $${firstVariant ? firstVariant.rate : 'N/A'}</strong></p>
                            <button class="btn btn-primary btn-sm mt-2 view-details-btn" data-bs-toggle="modal" data-bs-target="#productDetailsModal" data-product-id="${product.product_id}">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });

        // Add event listeners to "View Details" buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                fetchProductDetails(productId);
            });
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        errorMessageDiv.classList.remove('d-none'); // Show error message
    } finally {
        loadingDiv.classList.add('d-none'); // Hide loading spinner
    }
}

async function fetchProductDetails(productId) {
    const productDetailsContent = document.getElementById('productDetailsContent');
    productDetailsContent.innerHTML = '<p>Loading details...</p>'; // Reset content

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const product = await response.json(); // Zoho API returns 'product' object directly for details

        // Construct HTML for product details
        let detailsHtml = `
            <h2>${product.name}</h2>
            <p><strong>Product ID:</strong> ${product.product_id}</p>
            <p><strong>URL Handle:</strong> ${product.url}</p>
            <p><strong>Product Type:</strong> ${product.product_type}</p>
            <p><strong>Status:</strong> ${product.status}</p>
            <p><strong>Returnable:</strong> ${product.is_returnable ? 'Yes' : 'No'}</p>
            <p><strong>Show in Storefront:</strong> ${product.show_in_storefront ? 'Yes' : 'No'}</p>
            <p><strong>Description:</strong> ${product.product_description || 'No description available.'}</p>
        `;

        if (product.images && product.images.length > 0) {
            detailsHtml += '<h5 class="mt-3">Images:</h5><div class="row">';
            product.images.forEach(img => {
                detailsHtml += `<div class="col-md-4 mb-3"><img src="${img.image_large_url}" class="img-fluid rounded" alt="${product.name}"></div>`;
            });
            detailsHtml += '</div>';
        }

        if (product.variants && product.variants.length > 0) {
            detailsHtml += '<h5 class="mt-3">Variants:</h5><table class="table table-bordered table-sm"><thead><tr><th>Name</th><th>Rate</th><th>SKU</th><th>Stock</th></tr></thead><tbody>';
            product.variants.forEach(variant => {
                detailsHtml += `
                    <tr>
                        <td>${variant.name}</td>
                        <td>$${variant.rate}</td>
                        <td>${variant.sku || 'N/A'}</td>
                        <td>${variant.actual_available_stock || 'N/A'}</td>
                    </tr>
                `;
            });
            detailsHtml += '</tbody></table>';
        }

        productDetailsContent.innerHTML = detailsHtml;

    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetailsContent.innerHTML = '<p class="text-danger">Failed to load product details.</p>';
    }
}