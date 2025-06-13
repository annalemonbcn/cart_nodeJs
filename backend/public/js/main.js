const MOCK_CART_ID = "6842b6c39f05988cddb609af";
const API_BASE_URL = "/api";

// --- API Utilities ---
/**
 * Make an HTTP request to the API..
 * @param {string} endpoint The API endpoint (e.g., "/carts/productId").
 * @param {string} method The HTTP method (e.g., "POST", "DELETE").
 * @param {object} [body=null] The request body for POST/PUT methods.
 * @returns {Promise<object>} An object with `success` and either `data` or `message`. */
const apiRequest = async (endpoint, method, body = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.error(`API Error (${method} ${endpoint}):`, data.message);
      return { success: false, message: data.message || "Unknown error" };
    }
  } catch (error) {
    console.error("Network error or unexpected issue:", error);
    return {
      success: false,
      message: "Network error or unexpected issue. Please try again.",
    };
  }
};

// --- Cart Functions ---
/**
 * Add a product to the cart.
 * @param {string} cartId Cart ID.
 * @param {string} productId Product ID.
 * @returns {Promise<object>} Result.
 */
const addProductToCart = (cartId, productId) => {
  if (!productId || !cartId) {
    return Promise.resolve({
      success: false,
      message: "Product ID or Cart ID is missing for adding to cart.",
    });
  }
  return apiRequest(`/carts/${cartId}/product/${productId}`, "POST");
};

/**
 * Remove a product from the cart.
 * @param {string} cartId Cart ID.
 * @param {string} productId Product ID.
 * @returns {Promise<object>} Result.
 */
const removeProductFromCart = (cartId, productId) => {
  if (!productId || !cartId) {
    return Promise.resolve({
      success: false,
      message: "Product ID or Cart ID is missing for deleting from cart.",
    });
  }
  return apiRequest(`/carts/${cartId}/product/${productId}`, "DELETE");
};

/**
 * Update product quantity from the cart.
 * @param {string} cartId Cart ID.
 * @param {string} productId Product ID.
 * @returns {Promise<object>} Resultado de la operación.
 */
const updateProductQuantityInCart = (cartId, productId, quantity) => {
  if (!productId || !cartId || typeof quantity !== "number" || quantity <= 0) {
    return Promise.resolve({
      success: false,
      message: "Invalid Product ID, Cart ID, or quantity for updating cart.",
    });
  }
  return apiRequest(`/carts/${cartId}/product/${productId}`, "PUT", {
    quantity,
  });
};

// --- UI Management ---
/**
 * Handles the click event for adding/removing products from the cart.
 * @param {Event} e Click event.
 * @param {Function} apiCall The API function to call (e.g., addProductToCart, removeProductFromCart).
 * @param {string} successMessage Message to display on success.
 * @param {string} failureMessage Message to display on failure.
 * @param {boolean} shouldReloadPage Reload page if true. */
const handleCartButtonClick = async (
  e,
  apiCall,
  successMessage,
  failureMessage,
  shouldReloadPage = false
) => {
  const button = e.currentTarget;
  const productId = button.dataset.productId;
  const cartId = button.dataset.cartId || MOCK_CART_ID;

  const isAdding = button.classList.contains("product-add-to-cart");
  if (isAdding) {
    button.disabled = true;
    button.textContent = "Adding...";
  }

  try {
    const result = await apiCall(cartId, productId);

    if (result.success) {
      alert(successMessage);
      if (shouldReloadPage) {
        window.location.reload();
      }
    } else {
      alert(`${failureMessage}: ${result.message}`);
    }
  } catch (error) {
    console.error("Error handling cart button click:", error);
    alert("An unexpected error occurred. Please try again.");
  } finally {
    if (isAdding) {
      button.disabled = false;
      button.innerHTML =
        '<img class="add-to-cart-icon" src="/images/shopping-cart-outline.svg" alt="add-to-cart-icon" /> Add to cart';
    }
  }
};

/**
 * Configure the add to cart buttons.
 */
const setupAddToCartButtons = () => {
  const addToCartButtons = document.querySelectorAll(".product-add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) =>
      handleCartButtonClick(
        e,
        addProductToCart,
        "Product added to cart!",
        "Failed to add product"
      )
    );
  });
};

/**
 * Configure the delete product from cart buttons.
 */
const setupRemoveFromCartButtons = () => {
  const removeButtons = document.querySelectorAll(".remove-from-cart");

  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) =>
      handleCartButtonClick(
        e,
        removeProductFromCart,
        "Product removed from cart!",
        "Failed to remove product",
        true
      )
    );
  });
};

/**
 * Configure the delete product from cart buttons.
 */
const setupEditQuantityButtons = () => {
  const editIcons = document.querySelectorAll(".cart-item-edit-icon");

  editIcons.forEach((icon) => {
    icon.addEventListener("click", async (e) => {
      const button = e.currentTarget;
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId || MOCK_CART_ID;

      if (!productId || !cartId) {
        alert("Error: Product ID or Cart ID not found for editing.");
        console.error(
          "Missing data-productId or data-cartId on edit icon or parent."
        );
        return;
      }

      const newQuantityStr = prompt(
        `Enter new quantity for product ${productId}:`
      );

      if (newQuantityStr === null || newQuantityStr.trim() === "") return;

      const newQuantity = parseInt(newQuantityStr);

      if (isNaN(newQuantity) || newQuantity <= 0) {
        alert("Please enter a valid positive number for quantity.");
        return;
      }

      try {
        const result = await updateProductQuantityInCart(
          cartId,
          productId,
          newQuantity
        );

        if (result.success) {
          alert(`Quantity updated successfully to ${newQuantity}!`);
          window.location.reload();
        } else {
          alert(`Failed to update quantity: ${result.message}`);
        }
      } catch (error) {
        console.error("Error updating product quantity:", error);
        alert(
          "An unexpected error occurred while updating quantity. Please try again."
        );
      }
    });
  });
};

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  setupAddToCartButtons();
  setupRemoveFromCartButtons();
  setupEditQuantityButtons();
});
