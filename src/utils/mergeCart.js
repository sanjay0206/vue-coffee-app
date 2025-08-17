import axios from "axios";
import eventBus from "@app-utils/eventBus";

const LOCAL_STORAGE_CART_KEY = "localCart";

export const getLocalCart = () => {
  const localCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  return localCart ? JSON.parse(localCart) : { items: [] };
};

export const clearLocalCart = () => {
  localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
};

export const mergeLocalCart = async (userId) => {
  try {
    const localCart = getLocalCart();
    if (!localCart.items.length) return;

    // fetch backend cart first
    const response = await axios.get(
      `http://localhost:8080/api/carts/user/${userId}`
    );
    const backendCart = response.data.items || [];

    for (const localItem of localCart.items) {
      const backendItem = backendCart.find(
        (item) => item.productId === localItem.productId
      );

      if (backendItem) {
        // update quantity in backend (add local qty)
        const newQuantity = backendItem.quantity + localItem.quantity;
        await axios.put(
          `http://localhost:8080/api/carts/user/${userId}/items/${localItem.productId}/${newQuantity}`
        );
      } else {
        // create new item in backend cart
        await axios.post(
          `http://localhost:8080/api/carts/user/${userId}/items`,
          {
            productId: localItem.productId,
            productName: localItem.name,
            price: localItem.price,
            quantity: localItem.quantity,
            imageUrl: localItem.imageUrl,
          }
        );
      }
    }

    eventBus.emit("cart-updated");

    clearLocalCart();
  } catch (error) {
    console.error("Error merging carts:", error);
    throw error;
  }
};
