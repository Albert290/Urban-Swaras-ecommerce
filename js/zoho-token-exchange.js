// Zoho API Configuration
// IMPORTANT: Replace with your actual Zoho Commerce details
const ZOHO_CONFIG = {
    client_id: '1000.5LX7HRNCBX104M7IG3XYOKUGBRZCWO', // Your Zoho Client ID
    organization_id: '766739843', // Your Zoho Commerce Organization ID
    redirect_uri: 'http://localhost:5500/oauth-callback.html', // Your registered Redirect URI
    scope: 'ZohoCommerce.products.READ,ZohoCommerce.storefront.products.READ,ZohoCommerce.storefront.carts.CREATE,ZohoCommerce.storefront.carts.READ,ZohoCommerce.storefront.carts.UPDATE,ZohoCommerce.storefront.carts.DELETE', // Ensure all necessary scopes are included
    api_domain: 'https://commerce.zoho.com', // Base API domain for Admin API
    accounts_url: 'https://accounts.zoho.com' // Zoho Accounts URL
};

// Frontend Proxy URL for backend
const PROXY_SERVER_URL = 'http://localhost:3000';

// Your published Zoho Storefront domain
// From your documentation, this is www.urbanswaras.co.ke
const ZOHO_STOREFRONT_DOMAIN = 'www.urbanswaras.co.ke';

// Global variables for token management
let accessToken = localStorage.getItem('zoho_access_token');
let refreshToken = localStorage.getItem('zoho_refresh_token');
let expiresIn = localStorage.getItem('zoho_expires_in'); // Timestamp when token expires
let tokenRefreshTime = localStorage.getItem('zoho_token_refresh_time'); // Timestamp of last successful refresh


// --- Event Listeners and Initial Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if on the OAuth callback page
    if (window.location.pathname.includes('oauth-callback.html')) {
        handleOAuthCallback();
    }

    // Event listener for the "Connect to Zoho Commerce" button (on index.html)
    const connectButton = document.getElementById('connect-to-zoho');
    if (connectButton) {
        connectButton.addEventListener('click', redirectToZohoAuth);
    }

    // Event listeners for buttons on oauth-callback.html
    const testApiButton = document.getElementById('test-api-call');
    if (testApiButton) {
        testApiButton.addEventListener('click', testApiCall);
    }

    // Event listener for "Get Details" button for single product on oauth-callback.html
    const getSingleProductButton = document.getElementById('get-single-product-button');
    if (getSingleProductButton) {
        getSingleProductButton.addEventListener('click', async () => {
            const productId = document.getElementById('product-id-input').value.trim();
            if (productId) {
                const productDetails = await getSingleProductDetails(productId);
                displaySingleProduct(productDetails);
            } else {
                alert('Please enter a Product ID.');
            }
        });
    }

    // Display current token info if available (on oauth-callback.html)
    displayTokenInfo();

    // Initial load for shop.html - call Storefront API to get products
    if (window.location.pathname.includes('products.html') || window.location.pathname.includes('shop.html')) {
        getStorefrontProducts().then(products => {
            // Assumes displayStorefrontProducts is defined globally or in shopping-cart.js
            if (typeof displayStorefrontProducts === 'function') {
                displayStorefrontProducts(products);
            } else {
                console.warn("displayStorefrontProducts function not found. Products might not be displayed.");
            }
        }).catch(error => {
            console.error("Failed to load storefront products on page load:", error);
            const productsGrid = document.getElementById('products-grid') || document.getElementById('product-list');
            if (productsGrid) {
                productsGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
            }
        });
    }

    // Initialize shopping cart (defined in shopping-cart.js)
    // Ensure shopping-cart.js is loaded AFTER this file in your HTML
    if (typeof initShoppingCart === 'function') {
        initShoppingCart();
    } else {
        console.warn("initShoppingCart function not found. Shopping cart functionality may be limited.");
    }
});


// --- Zoho OAuth & Token Management Functions ---

// Function to redirect to Zoho's authorization page
function redirectToZohoAuth() {
    const authUrl = `${ZOHO_CONFIG.accounts_url}/oauth/v2/auth?scope=${ZOHO_CONFIG.scope}&client_id=${ZOHO_CONFIG.client_id}&response_type=code&access_type=offline&redirect_uri=${ZOHO_CONFIG.redirect_uri}`;
    console.log('Redirecting to Zoho Auth URL:', authUrl);
    window.location.href = authUrl;
}

// Function to handle the OAuth callback (called on oauth-callback.html)
async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const zohoLocation = urlParams.get('location'); // Can be used for regional API domains
    const accountsServer = urlParams.get('accounts-server'); // Can be used for regional accounts servers

    if (code) {
        console.log('Frontend: Authorization code received:', code);
        // Save these if needed for future API calls to specific domains
        if (zohoLocation) localStorage.setItem('zoho_api_location', zohoLocation);
        if (accountsServer) localStorage.setItem('zoho_accounts_server', accountsServer);

        await exchangeForTokens(code, ZOHO_CONFIG.redirect_uri);
    } else {
        console.log('Frontend: No authorization code found in URL.');
    }
}

// Function to exchange authorization code for access and refresh tokens via backend proxy
async function exchangeForTokens(code, redirectUri) {
    console.log('Frontend: Exchanging authorization code via backend proxy...');
    const proxyUrl = `${PROXY_SERVER_URL}/zoho-token-exchange`;

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                redirect_uri: redirectUri,
                client_id: ZOHO_CONFIG.client_id,
                client_secret: 'YOUR_CLIENT_SECRET_IS_ON_SERVER', // Client secret is handled on server for security
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Frontend: Token exchange successful!', data);
            accessToken = data.access_token;
            refreshToken = data.refresh_token;
            expiresIn = Date.now() + (data.expires_in * 1000); // Calculate absolute expiry timestamp
            tokenRefreshTime = Date.now(); // Record when token was obtained/refreshed

            localStorage.setItem('zoho_access_token', accessToken);
            localStorage.setItem('zoho_refresh_token', refreshToken);
            localStorage.setItem('zoho_expires_in', expiresIn);
            localStorage.setItem('zoho_token_refresh_time', tokenRefreshTime);
            localStorage.setItem('zoho_token_type', data.token_type);
            localStorage.setItem('zoho_scope', data.scope);

            displayTokenInfo();
        } else {
            console.error('❌ Frontend: Token exchange failed!', data);
            alert(`Authentication failed: ${data.error_description || data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('❌ Frontend: Network or proxy error during token exchange:', error);
        alert('Authentication failed: Could not connect to backend proxy.');
    }
}

// Function to refresh the access token using the refresh token
async function refreshAccessToken() {
    console.log('Frontend: Refreshing access token via backend proxy...');
    const proxyUrl = `${PROXY_SERVER_URL}/zoho-token-refresh`;

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
                client_id: ZOHO_CONFIG.client_id,
                client_secret: 'YOUR_CLIENT_SECRET_IS_ON_SERVER', // Client secret handled on server
                grant_type: 'refresh_token'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Frontend: Token refresh successful!', data);
            accessToken = data.access_token;
            expiresIn = Date.now() + (data.expires_in * 1000); // Update expiry timestamp
            tokenRefreshTime = Date.now(); // Record when token was refreshed

            localStorage.setItem('zoho_access_token', accessToken);
            localStorage.setItem('zoho_expires_in', expiresIn);
            localStorage.setItem('zoho_token_refresh_time', tokenRefreshTime);
            // Refresh token usually remains the same, but if a new one is provided, update it.
            if (data.refresh_token) {
                refreshToken = data.refresh_token;
                localStorage.setItem('zoho_refresh_token', refreshToken);
            }
            displayTokenInfo();
            return true;
        } else {
            console.error('❌ Frontend: Token refresh failed!', data);
            alert(`Token refresh failed: ${data.error_description || data.error || 'Unknown error'}`);
            // Clear tokens if refresh fails, forcing re-authentication
            localStorage.clear();
            accessToken = null;
            refreshToken = null;
            expiresIn = null;
            tokenRefreshTime = null;
            displayTokenInfo();
            return false;
        }
    } catch (error) {
        console.error('❌ Frontend: Network or proxy error during token refresh:', error);
        alert('Token refresh failed: Could not connect to backend proxy.');
        localStorage.clear(); // Clear tokens on network error
        accessToken = null;
        refreshToken = null;
        expiresIn = null;
        tokenRefreshTime = null;
        displayTokenInfo();
        return false;
    }
}

// Function to ensure the access token is valid before making an API call
async function ensureValidToken() {
    // If no access token, we can't do anything here (likely needs fresh auth)
    if (!accessToken) {
        console.warn("No access token available. Authentication required.");
        return false;
    }

    // Check if the token is expired or about to expire (e.g., within 5 minutes = 300 seconds)
    const safetyBuffer = 300 * 1000; // 5 minutes in milliseconds
    if (expiresIn && (Date.now() + safetyBuffer >= parseInt(expiresIn))) {
        console.log("Access token expired or about to expire. Attempting refresh...");
        return await refreshAccessToken();
    }
    console.log("Access token is valid.");
    return true;
}

// Function to display token info on the HTML page (e.g., oauth-callback.html)
function displayTokenInfo() {
    const accessTokenDisplay = document.getElementById('access-token-display');
    const refreshTokenDisplay = document.getElementById('refresh-token-display');
    const apiDomainDisplay = document.getElementById('api-domain-display');
    const expiresInDisplay = document.getElementById('expires-in-display');
    const tokenTypeDisplay = document.getElementById('token-type-display');
    const scopeDisplay = document.getElementById('scope-display');
    const authCompleteSection = document.getElementById('auth-complete-section');

    // Only update elements if they exist on the current page (e.g., oauth-callback.html)
    if (accessTokenDisplay) accessTokenDisplay.textContent = accessToken ? accessToken.substring(0, 20) + '...' : 'N/A';
    if (refreshTokenDisplay) refreshTokenDisplay.textContent = refreshToken ? refreshToken.substring(0, 20) + '...' : 'N/A';
    if (apiDomainDisplay) apiDomainDisplay.textContent = ZOHO_CONFIG.api_domain || 'N/A'; // Use config value
    
    if (expiresInDisplay && expiresIn) {
        const remainingSeconds = Math.floor((parseInt(expiresIn) - Date.now()) / 1000);
        expiresInDisplay.textContent = `${remainingSeconds > 0 ? remainingSeconds : 0} seconds (approx ${Math.floor(remainingSeconds / 60)} minutes)`;
    } else if (expiresInDisplay) {
        expiresInDisplay.textContent = 'N/A';
    }
    
    if (tokenTypeDisplay) tokenTypeDisplay.textContent = localStorage.getItem('zoho_token_type') || 'N/A';
    if (scopeDisplay) scopeDisplay.textContent = localStorage.getItem('zoho_scope') || 'N/A';

    if (authCompleteSection) {
        authCompleteSection.style.display = accessToken ? 'block' : 'none';
    }
}


// --- Generic Zoho API Call Function (Handles both Admin & Storefront via Proxy) ---
/**
 * Generic function to make API calls to your Node.js proxy.
 * This function handles both Admin API (authenticated) and Storefront API (unauthenticated) calls.
 *
 * @param {string} apiPath - The Zoho API endpoint path (e.g., '/store/api/v1/products', '/storefront/api/v1/cart').
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {object} [body=null] - Request body for POST/PUT/DELETE if applicable.
 * @param {object} [queryParams=null] - Query parameters for GET/DELETE if applicable.
 * @param {boolean} [isStorefront=false] - True if this is a Storefront API call (no OAuth token, requires domain-name header).
 * @returns {Promise<object>} - The API response payload.
 */
async function makeZohoApiRequest(apiPath, method = 'GET', body = null, queryParams = null, isStorefront = false) {
    const proxyUrl = isStorefront ? `${PROXY_SERVER_URL}/zoho-storefront-proxy` : `${PROXY_SERVER_URL}/zoho-api-proxy`;

    const requestBodyForProxy = {
        apiPath: apiPath,
        method: method,
        body: body,
        queryParams: queryParams
    };

    if (isStorefront) {
        requestBodyForProxy.storefrontDomain = ZOHO_STOREFRONT_DOMAIN;
        // No accessToken needed for Storefront API calls
    } else {
        // Ensure Admin API token is valid and add it to the proxy request body
        const tokenIsValid = await ensureValidToken();
        if (!tokenIsValid) {
            console.error("Admin API call failed: Token invalid or could not be refreshed.");
            throw new Error("Admin API call requires valid token. Please re-authenticate.");
        }
        requestBodyForProxy.accessToken = localStorage.getItem('zoho_access_token');
        requestBodyForProxy.organizationId = ZOHO_CONFIG.organization_id; // Pass organization ID to proxy
    }

    try {
        console.log(`Making ${method} request to ${isStorefront ? 'Storefront' : 'Admin'} proxy for: ${apiPath}`);
        console.log("Request body sent to proxy:", requestBodyForProxy);

        const response = await fetch(proxyUrl, {
            method: 'POST', // Frontend always POSTs to the proxy
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBodyForProxy)
        });

        const data = await response.json();

        // Check for Zoho's success status message or api_kind for storefront
        if (response.ok && (data.status_message === 'success' || (isStorefront && data.api_kind))) {
            console.log(`${isStorefront ? 'Storefront' : 'Admin'} API call successful:`, data);
            // Storefront APIs typically return data under a 'payload' key
            // Admin APIs might return direct data or data under a specific key (e.g., 'products')
            return data.payload || data;
        } else {
            console.error(`${isStorefront ? 'Storefront' : 'Admin'} API call failed:`, data);
            // Extract error message from various possible Zoho response structures
            const errorMessage = data.developer_message || data.error?.message || data.error || data.status_message || 'Unknown API error';
            throw new Error(`API call failed: ${errorMessage}`);
        }
    } catch (error) {
        console.error(`Network or proxy error during ${isStorefront ? 'Storefront' : 'Admin'} API call:`, error);
        throw new Error(`API call failed: ${error.message}`);
    }
}


// --- Admin API Functions (Using the new makeZohoApiRequest) ---

// Function to get products using the Zoho Commerce Admin API (for oauth-callback.html)
async function getProducts() {
    console.log('Getting first page of products (Admin API)...');
    const apiPath = '/store/api/v1/products';
    const queryParams = {
        page: 1,
        per_page: 50,
        filter_by: 'Status.Active'
    };

    try {
        const productsData = await makeZohoApiRequest(apiPath, 'GET', null, queryParams, false); // isStorefront = false
        if (productsData && productsData.products) {
            console.log(`Products fetched (Admin API): ${productsData.products.length} items`);
            return productsData.products;
        } else if (productsData) {
            console.log('No products found or unexpected response structure (Admin API):', productsData);
            return [];
        }
    } catch (error) {
        console.error('Error fetching products (Admin API):', error);
        alert(`Error fetching products: ${error.message}`);
        return [];
    }
    return [];
}

// Function to display multiple products on the HTML page (for oauth-callback.html)
// Keep as is, it's a display utility.
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.error('Products container not found in HTML.');
        return;
    }

    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found or failed to load.</p>';
        return;
    }

    const productList = document.createElement('ul');
    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.style.border = '1px solid #ccc';
        listItem.style.margin = '10px 0';
        listItem.style.padding = '10px';
        listItem.style.borderRadius = '5px';

        const productName = document.createElement('h3');
        productName.textContent = product.name;

        const productId = document.createElement('p');
        productId.textContent = `ID: ${product.product_id}`;

        const productPrice = document.createElement('p');
        productPrice.textContent = `Price: $${product.min_rate || 'N/A'}`;

        const productType = document.createElement('p');
        productType.textContent = `Type: ${product.product_type || 'N/A'}`;

        const productStatus = document.createElement('p');
        productStatus.textContent = `Status: ${product.status || 'N/A'}`;

        const variantsDiv = document.createElement('div');
        if (product.variants && product.variants.length > 0) {
            variantsDiv.innerHTML = '<h4>Variants:</h4>';
            const variantList = document.createElement('ul');
            product.variants.forEach(variant => {
                const variantItem = document.createElement('li');
                variantItem.textContent = `${variant.name || 'N/A'} (SKU: ${variant.sku || 'N/A'}, Rate: $${variant.rate || 'N/A'}, Stock: ${variant.available_stock || 'N/A'})`;
                variantList.appendChild(variantItem);
            });
            variantsDiv.appendChild(variantList);
        } else {
            variantsDiv.innerHTML = '<p>No variants for this product.</p>';
        }

        listItem.appendChild(productName);
        listItem.appendChild(productId);
        listItem.appendChild(productPrice);
        listItem.appendChild(productType);
        listItem.appendChild(productStatus);
        listItem.appendChild(variantsDiv);
        productList.appendChild(listItem);
    });

    productsContainer.appendChild(productList);
}

// Function to get details of a single product (for oauth-callback.html)
async function getSingleProductDetails(productId) {
    console.log(`Getting details for product ID: ${productId} (Admin API)`);
    const apiPath = '/store/api/v1/products/editpage';
    const queryParams = {
        product_id: productId
    };

    try {
        const productDetails = await makeZohoApiRequest(apiPath, 'GET', null, queryParams, false); // isStorefront = false
        if (productDetails && productDetails.product) {
            console.log('Single product details fetched (Admin API):', productDetails.product);
            return productDetails.product;
        } else if (productDetails) {
            console.warn('No product found for the given ID or unexpected response structure (Admin API):', productDetails);
            alert('Product not found or an error occurred while fetching details.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching single product details (Admin API):', error);
        alert(`Error fetching product details: ${error.message}`);
        return null;
    }
    return null;
}

// Function to display details of a single product (for oauth-callback.html)
// Keep as is, it's a display utility.
function displaySingleProduct(product) {
    const container = document.getElementById('single-product-details-container');
    if (!container) {
        console.error('Single product details container not found in HTML.');
        return;
    }

    container.innerHTML = '';

    if (!product) {
        container.innerHTML = '<p>No product details to display. Please try again with a valid Product ID.</p>';
        return;
    }

    const detailsDiv = document.createElement('div');
    detailsDiv.innerHTML = `
        <h3>${product.name || 'N/A'} (ID: ${product.product_id || 'N/A'})</h3>
        <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
        <p><strong>Category:</strong> ${product.category ? product.category.category_name : 'N/A'}</p>
        <p><strong>Description:</strong> ${product.product_description || 'N/A'}</p>
        <p><strong>Short Description:</strong> ${product.product_short_description || 'N/A'}</p>
        <p><strong>Status:</strong> ${product.status || 'N/A'}</p>
        <p><strong>Returnable:</strong> ${product.is_returnable ? 'Yes' : 'No'}</p>
        <p><strong>Featured:</strong> ${product.is_featured ? 'Yes' : 'No'}</p>
        <h4>SEO Details:</h4>
        <p><strong>Title:</strong> ${product.seo_title || 'N/A'}</p>
        <p><strong>Keywords:</strong> ${product.seo_keyword || 'N/A'}</p>
        <p><strong>Description:</strong> ${product.seo_description || 'N/A'}</p>
        <h4>Raw Data:</h4>
        <pre>${JSON.stringify(product, null, 2)}</pre>
    `;

    if (product.variants && product.variants.length > 0) {
        const variantsHeader = document.createElement('h4');
        variantsHeader.textContent = 'Variant Details:';
        detailsDiv.appendChild(variantsHeader);

        product.variants.forEach(variant => {
            const variantDiv = document.createElement('div');
            variantDiv.style.border = '1px dashed #ddd';
            variantDiv.style.padding = '10px';
            variantDiv.style.margin = '5px 0';
            variantDiv.innerHTML = `
                <p><strong>Variant Name:</strong> ${variant.name || 'N/A'} (ID: ${variant.variant_id || 'N/A'})</p>
                <p><strong>Rate:</strong> $${variant.rate || 'N/A'}</p>
                <p><strong>Retail Price (Label Rate):</strong> $${variant.label_rate || 'N/A'}</p>
                <p><strong>SKU:</strong> ${variant.sku || 'N/A'}</p>
                <p><strong>Stock On Hand:</strong> ${variant.stock_on_hand || 'N/A'}</p>
                <p><strong>Reorder Level:</strong> ${variant.reorder_level || 'N/A'}</p>
                <p><strong>Status:</strong> ${variant.status || 'N/A'}</p>
            `;
            detailsDiv.appendChild(variantDiv);
        });
    }

    container.appendChild(detailsDiv);
}

// Test API call function (now also displays products for Admin UI)
async function testApiCall() {
    console.log('Testing API call (Admin Products List)...');
    const products = await getProducts();
    if (products && products.length > 0) {
        console.log('API Test Successful! Products received:', products);
        displayProducts(products);
        alert('API Test Successful! Check console and "Products List" below.');
    } else {
        console.warn('API Test completed but no products were returned or an error occurred.');
        alert('API Test completed but no products were returned or an error occurred. Check console.');
        displayProducts([]);
    }
}


// --- Storefront API Functions (Using the new makeZohoApiRequest) ---

/**
 * Gets products using the Zoho Commerce STOREFRONT Listing API.
 * This function now sends a POST request with the search query in the body.
 * @param {string} [searchQuery=''] - Optional search query string.
 * @returns {Promise<Array>} - An array of product objects from the storefront.
 */
async function getStorefrontProducts(searchQuery = '') {
    console.log(`Getting products for storefront using Storefront API (via proxy) with query: "${searchQuery}"`);
    const apiPath = '/storefront/api/v1/search-products';

    try {
        // *** CRUCIAL FIX: Use POST method and pass 'q' in the request body ***
        const payload = await makeZohoApiRequest(apiPath, 'POST', { q: searchQuery }, null, true); // isStorefront = true

        if (payload && Array.isArray(payload.products)) {
            console.log(`Products fetched (Storefront API via proxy): ${payload.products.length} items`);
            return payload.products;
        } else {
            console.log('No products found or unexpected payload structure (Storefront API via proxy):', payload);
            return [];
        }
    } catch (error) {
        console.error('Error fetching storefront products (via proxy):', error);
        // Display an error message on the product grid if available
        const productsGrid = document.getElementById('products-grid') || document.getElementById('product-list');
        if (productsGrid) {
            productsGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
        throw error; // Re-throw to propagate error for calling code to handle
    }
}

// Function to display products in a storefront-like grid
// This function needs to be available to shop.html/products.html
// Consider putting this in shopping-cart.js or a separate ui-renderer.js if it gets too large
function displayStorefrontProducts(products) {
    const productsGrid = document.getElementById('products-grid') || document.getElementById('product-list'); // Account for different IDs
    if (!productsGrid) {
        console.error('Products grid container not found in shop.html/products.html.');
        return;
    }

    productsGrid.innerHTML = ''; // Clear "Loading products..."

    if (products.length === 0) {
        productsGrid.innerHTML = '<p>No products available at the moment.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const imageUrl = (product.images && product.images.length > 0 && product.images[0].url)
                                 ? `${ZOHO_CONFIG.api_domain}${product.images[0].url}` // Use ZOHO_CONFIG.api_domain as base for storefront images
                                 : 'https://via.placeholder.com/150?text=No+Image';

        const displayPrice = product.selling_price || product.label_price || 'N/A';

        // Get the variant_id for the 'Add to Cart' button (assuming the first variant, or adjust as needed)
        const variantId = (product.variants && product.variants.length > 0)
                                  ? product.variants[0].variant_id
                                  : (product.product_id || null); // Fallback to product_id if no variant, though variant_id is preferred for cart

        productCard.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">Ksh ${displayPrice}</p>
            <p class="product-sku">SKU: ${product.sku || 'N/A'}</p>
            <button class="add-to-cart-btn" data-product-id="${product.product_id}" data-variant-id="${variantId}">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const variantId = event.target.dataset.variantId;
            if (variantId) {
                // handleAddToCart is defined in shopping-cart.js, ensure it's loaded
                if (typeof handleAddToCart === 'function') {
                    handleAddToCart(variantId, 1); // Add 1 quantity by default
                } else {
                    console.error("handleAddToCart function is not available. Is shopping-cart.js loaded correctly?");
                    alert("Cart functionality not ready. Please check console.");
                }
            } else {
                alert("Cannot add to cart: Product variant ID not found.");
            }
        });
    });
}


// --- Cart Management Functions (Externalized for shopping-cart.js) ---
// These functions are designed to be imported/used by shopping-cart.js

// Helper function to manage cart_id in localStorage
function getCartId() {
    return localStorage.getItem('urbanSwarasCartId');
}

function setCartId(cartId) {
    if (cartId) {
        localStorage.setItem('urbanSwarasCartId', cartId);
    } else {
        localStorage.removeItem('urbanSwarasCartId');
    }
}

/**
 * Adds an item to the cart.
 * @param {string} productVariantId - The ID of the product variant to add.
 * @param {number} quantity - The quantity to add.
 * @param {string} [existingCartId] - Optional existing cart ID. If not provided, a new one will be created or used from localStorage.
 * @param {Array} [customFields] - Optional array of custom fields.
 * @returns {Promise<object>} - The updated cart payload.
 */
async function addToCart(productVariantId, quantity, existingCartId = getCartId(), customFields = []) {
    const apiPath = '/storefront/api/v1/cart';
    const requestBody = {
        product_variant_id: productVariantId,
        quantity: quantity,
    };
    if (existingCartId) {
        requestBody.cart_id = existingCartId;
    }
    if (customFields && customFields.length > 0) {
        requestBody.custom_fields = customFields;
    }

    console.log(`Adding item to cart:`, requestBody);
    try {
        const payload = await makeZohoApiRequest(apiPath, 'POST', requestBody, null, true);
        if (payload && payload.cart_id) {
            setCartId(payload.cart_id); // Store the returned cart_id
            console.log("Item added to cart successfully. Current cart payload:", payload);
            return payload; // Return the full cart payload
        } else {
            throw new Error("Add to cart failed: No cart_id in response payload.");
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
    }
}

/**
 * Updates the quantity of an item in the cart.
 * @param {string} productVariantId - The ID of the product variant to update.
 * @param {number} quantity - The new quantity.
 * @param {string} cartId - The ID of the cart to update.
 * @returns {Promise<object>} - The updated cart payload.
 */
async function updateCartItemQuantity(productVariantId, quantity, cartId = getCartId()) {
    if (!cartId) {
        throw new Error("Cannot update cart: No cart ID available. Add an item first.");
    }
    const apiPath = '/storefront/api/v1/cart';
    const requestBody = {
        product_variant_id: productVariantId,
        quantity: quantity,
        cart_id: cartId,
    };
    console.log(`Updating cart item quantity:`, requestBody);
    try {
        const payload = await makeZohoApiRequest(apiPath, 'PUT', requestBody, null, true);
        console.log("Cart item quantity updated successfully. Current cart payload:", payload);
        return payload; // Return the full cart payload
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error;
    }
}

/**
 * Deletes an item from the cart.
 * @param {string} productVariantId - The ID of the product variant to delete.
 * @param {string} cartId - The ID of the cart.
 * @returns {Promise<object>} - The API response for deletion (typically a success message).
 */
async function deleteCartItem(productVariantId, cartId = getCartId()) {
    if (!cartId) {
        throw new Error("Cannot delete from cart: No cart ID available.");
    }
    const apiPath = '/storefront/api/v1/cart';
    // DELETE uses query parameters for this API as per Zoho's documentation example.
    const queryParams = {
        product_variant_id: productVariantId,
        cart_id: cartId,
    };
    console.log(`Deleting item from cart:`, queryParams);
    try {
        const payload = await makeZohoApiRequest(apiPath, 'DELETE', null, queryParams, true); // No body for DELETE with query params
        console.log("Item deleted from cart successfully:", payload);
        // Note: Zoho's DELETE response is minimal, doesn't return full cart.
        // shopping-cart.js will need to update its local state based on this success.
        return payload;
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        throw error;
    }
}