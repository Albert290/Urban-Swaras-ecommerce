// This file assumes zoho-token-exchange.js is loaded BEFORE this file in your HTML.
// It relies on functions like addToCart, updateCartItemQuantity, deleteCartItem, getStorefrontProducts, getCartId from that file.

let currentCart = {
    cart_id: null,
    items: [],
    total_price: 0,
    count: 0
};

const CART_STORAGE_KEY = 'urbanSwarasCartData'; // Key for localStorage


/**
 * Initializes the shopping cart on page load.
 * Tries to load existing cart data from localStorage.
 */
function initShoppingCart() {
    loadCartFromLocalStorage();
    renderCart(); // Render cart on page load
    updateCartCounter(); // Update counter in UI
}

/**
 * Loads cart data from localStorage.
 */
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
        try {
            const parsedCart = JSON.parse(storedCart);
            // Basic validation to ensure it's a valid cart structure
            if (parsedCart.cart_id && Array.isArray(parsedCart.items)) {
                currentCart = parsedCart;
                setCartId(currentCart.cart_id); // Ensure cart_id is also set in zoho-token-exchange context
                console.log("Cart loaded from localStorage:", currentCart);
            } else {
                console.warn("Invalid cart data in localStorage. Starting with empty cart.");
                clearCart();
            }
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            clearCart();
        }
    } else {
        console.log("No cart data found in localStorage. Starting with empty cart.");
        clearCart(); // Ensure a clean start if nothing found
    }
}

/**
 * Saves current cart data to localStorage.
 */
function saveCartToLocalStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
    console.log("Cart saved to localStorage:", currentCart);
}

/**
 * Clears the current cart state and localStorage.
 */
function clearCart() {
    currentCart = {
        cart_id: null,
        items: [],
        total_price: 0,
        count: 0
    };
    setCartId(null); // Clear cart_id from zoho-token-exchange context
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCounter();
    renderCart();
    console.log("Cart cleared.");
}

/**
 * Updates the global cart state and saves it to localStorage.
 * @param {object} newCartPayload - The payload received from Zoho API (Add/Update).
 */
function updateCartState(newCartPayload) {
    currentCart.cart_id = newCartPayload.cart_id;
    currentCart.items = newCartPayload.items || [];
    currentCart.total_price = newCartPayload.total_price || 0;
    currentCart.count = newCartPayload.count || 0;
    currentCart.symbol_formatted = newCartPayload.symbol_formatted || '$0.00'; // Store formatted price
    currentCart.sub_total_formatted = newCartPayload.sub_total_formatted || '$0.00'; // Store formatted sub_total

    saveCartToLocalStorage();
    updateCartCounter();
    renderCart(); // Re-render cart on cart-related pages
}

/**
 * Renders the cart contents in the cart.html page.
 * Assumes an HTML structure with a container for cart items and totals.
 */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');

    if (!cartItemsContainer || !cartSummaryContainer) {
        // Not on the cart page, just update counter
        updateCartCounter();
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (currentCart.items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartSummaryContainer.innerHTML = '<p>Total: $0.00</p>';
        return;
    }

    currentCart.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/50'; // Placeholder image
        const itemPrice = item.selling_price * item.quantity; // Calculate total price for this item
        const formattedItemPrice = currentCart.symbol_formatted ? `${currentCart.symbol_formatted}${itemPrice.toFixed(2)}` : `$${itemPrice.toFixed(2)}`;

        itemElement.innerHTML = `
            <img src="${ZOHO_CONFIG.api_domain}${imageUrl}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Price: ${currentCart.symbol_formatted || '$'}${item.selling_price.toFixed(2)}</p>
                <p>Total: ${formattedItemPrice}</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-id="${item.variant_id}" data-action="decrease">-</button>
                    <input type="number" class="quantity-input" data-id="${item.variant_id}" value="${item.quantity}" min="1">
                    <button class="quantity-btn" data-id="${item.variant_id}" data-action="increase">+</button>
                    <button class="remove-btn" data-id="${item.variant_id}">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Render cart summary
    cartSummaryContainer.innerHTML = `
        <p>Subtotal: ${currentCart.sub_total_formatted || 'N/A'}</p>
        <h3>Total: ${currentCart.symbol_formatted || '$'}${currentCart.total_price.toFixed(2)}</h3>
        <button id="proceed-to-checkout-btn" class="btn btn-primary">Proceed to Checkout</button>
    `;

    // Add event listeners for quantity controls and remove buttons
    cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    cartItemsContainer.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
    // Add event listener for input change (direct typing)
    cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', handleQuantityInputChange);
    });

    // Add event listener for checkout button (placeholder)
    const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Proceeding to checkout! (Not yet implemented)');
            window.location.href = 'checkout.html'; // Redirect to checkout page
        });
    }
}

/**
 * Updates the cart counter displayed in the header/navbar.
 * Assumes an element with ID 'cart-counter'.
 */
function updateCartCounter() {
    const cartCounterElement = document.getElementById('cart-counter');
    if (cartCounterElement) {
        cartCounterElement.textContent = currentCart.count || 0;
    }
}


/**
 * Handles adding a product to the cart from a product display page.
 * @param {string} productVariantId - The ID of the product variant to add.
 * @param {number} quantity - The quantity to add.
 */
async function handleAddToCart(productVariantId, quantity = 1) {
    try {
        const updatedCart = await addToCart(productVariantId, quantity);
        updateCartState(updatedCart);
        alert(`${quantity} of item ${productVariantId} added to cart!`);
    } catch (error) {
        console.error("Failed to add item to cart:", error);
        alert("Failed to add item to cart. Please try again.");
    }
}

/**
 * Handles quantity changes from +/- buttons.
 * @param {Event} event - The click event.
 */
async function handleQuantityChange(event) {
    const variantId = event.target.dataset.id;
    const action = event.target.dataset.action;
    const inputElement = event.target.closest('.cart-item-controls').querySelector('.quantity-input');
    let currentQuantity = parseInt(inputElement.value);

    if (action === 'increase') {
        currentQuantity++;
    } else if (action === 'decrease' && currentQuantity > 1) {
        currentQuantity--;
    } else if (action === 'decrease' && currentQuantity === 1) {
        // If quantity is 1 and user clicks decrease, offer to remove
        if (confirm("Are you sure you want to remove this item from your cart?")) {
            handleRemoveItem({ target: { dataset: { id: variantId } } }); // Call remove handler
            return;
        }
    } else {
        return; // Do nothing if quantity is already 1 and decreasing
    }

    await updateItemInCartUI(variantId, currentQuantity);
}

/**
 * Handles quantity changes from direct input typing.
 * @param {Event} event - The change event.
 */
async function handleQuantityInputChange(event) {
    const variantId = event.target.dataset.id;
    const newQuantity = parseInt(event.target.value);

    if (isNaN(newQuantity) || newQuantity <= 0) {
        alert("Quantity must be a positive number.");
        event.target.value = currentCart.items.find(item => item.variant_id === variantId)?.quantity || 1; // Revert to old value
        return;
    }

    await updateItemInCartUI(variantId, newQuantity);
}

/**
 * Centralized function to update item quantity in cart via API and UI.
 * @param {string} variantId
 * @param {number} newQuantity
 */
async function updateItemInCartUI(variantId, newQuantity) {
    try {
        const updatedCart = await updateCartItemQuantity(variantId, newQuantity, getCartId());
        updateCartState(updatedCart); // This will re-render
        alert(`Quantity for item ${variantId} updated to ${newQuantity}.`);
    } catch (error) {
        console.error("Failed to update item quantity in cart:", error);
        alert("Failed to update item quantity. Please try again.");
        // Revert UI quantity if API fails
        const inputElement = document.querySelector(`.quantity-input[data-id="${variantId}"]`);
        if (inputElement) {
            inputElement.value = currentCart.items.find(item => item.variant_id === variantId)?.quantity || 1;
        }
    }
}


/**
 * Handles removing an item from the cart.
 * @param {Event} event - The click event.
 */
async function handleRemoveItem(event) {
    const variantId = event.target.dataset.id;
    if (confirm("Are you sure you want to remove this item from your cart?")) {
        try {
            await deleteCartItem(variantId, getCartId());
            // After successful deletion, update local cart state by removing the item
            currentCart.items = currentCart.items.filter(item => item.variant_id !== variantId);
            // Re-calculate totals manually or ideally fetch if there was a getCartDetails API
            // For now, if Zoho DELETE doesn't return full cart, we rely on local removal
            // For simplicity, let's trigger a full refresh/recalculation if possible,
            // or if we add a 'getCartDetails' in the future, we'd call that.
            // For now, we'll just filter locally and re-save/render.
            
            // Recalculate totals client-side for simplicity, given no Get Cart API
            currentCart.total_price = currentCart.items.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
            currentCart.count = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
            currentCart.sub_total = currentCart.total_price; // Assuming sub_total is same as total for now
            currentCart.sub_total_formatted = currentCart.symbol_formatted ? `${currentCart.symbol_formatted}${currentCart.sub_total.toFixed(2)}` : `$${currentCart.sub_total.toFixed(2)}`;

            saveCartToLocalStorage();
            updateCartCounter();
            renderCart(); // Re-render the cart display
            alert(`Item ${variantId} removed from cart.`);
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            alert("Failed to remove item from cart. Please try again.");
        }
    }
}

// Initialize cart on DOMContentLoaded for any page that includes shopping-cart.js
document.addEventListener('DOMContentLoaded', initShoppingCart);