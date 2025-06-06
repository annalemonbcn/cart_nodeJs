const MOCK_CART_ID = "6842b6c39f05988cddb609af";
const API_BASE_URL = "/api/carts";

const navigateToCart = () => {};

const addProductToCart = async (cartId, productId) => {
  if (!productId || !cartId) {
    throw new Error("Product ID or Cart ID is missing for adding to cart.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/carts/${cartId}/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Product added to cart successfully:", data);
      return { success: true, data }; // Devolvemos un objeto con éxito y los datos
    } else {
      const errorData = await response.json();
      console.error("Failed to add product to cart:", errorData.message);
      return { success: false, message: errorData.message || "Unknown error" }; // Devolvemos un objeto con fallo y mensaje
    }
  } catch (error) {
    console.error("Network error or unexpected issue:", error);
    return {
      success: false,
      message: "Network error or unexpected issue. Please try again.",
    };
  }
};

const setupAddToCartButtons = () => {
  const addToCartButtons = document.querySelectorAll(".product-add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId || MOCK_CART_ID;

      button.disabled = true;
      button.textContent = "Adding...";

      try {
        const result = await addProductToCart(cartId, productId);

        if (result.success) {
          alert("Product added to cart!");
          // Aquí podrías actualizar un contador de carrito, etc.
        } else {
          alert(`Failed to add product: ${result.message}`);
        }
      } catch (error) {
        console.error("Error setting up add to cart:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        button.disabled = false;
        button.innerHTML =
          '<img class="add-to-cart-icon" src="/images/shopping-cart-outline.svg" alt="add-to-cart-icon" /> Add to cart';
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", setupAddToCartButtons);
