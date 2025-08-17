<template>
  <div class="bg-white pb-8">
    <Breadcrumbs />
    <div
      v-if="product"
      class="mx-auto max-w-2xl px-4 py-3 lg:py-8 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:h-full">
        <!-- Image gallery -->
        <div
          class="aspect-square flex items-center rounded-xl lg:h-full overflow-hidden bg-gray-100 max-w-full"
        >
          <!-- Image selector -->
          <div class="mx-auto max-w-2xl sm:block lg:max-w-none">
            <img
              :src="product.imageUrl"
              alt="product image"
              class="mb-4 scale-150 hover:scale-[1.75] transition-transform"
            />
          </div>
        </div>

        <!-- Product info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:h-full">
          <h1 class="text-3xl font-bold tracking-tight text-gray-800">
            {{ product.name }}
          </h1>

          <div class="mt-3">
            <h2 class="sr-only">Product information</h2>
            <p class="text-3xl tracking-tight text-gray-800">
              £{{ product.price }}
            </p>
          </div>

          <div class="mt-3 min-h-[80px]">
            <h3 class="sr-only">Description</h3>
            <div
              class="space-y-6 text-base text-gray-700"
              v-html="product.description"
            />
          </div>

          <div class="mt-3 flex items-center gap-3">
            <h3 class="text-base text-gray-500 font-light">Weight:</h3>
            <p class="space-y-6 text-base text-gray-700">
              {{ product.weight }}g
            </p>
          </div>

          <div class="mt-3 flex items-center gap-3">
            <h3 class="text-base text-gray-500">Region:</h3>
            <p class="space-y-6 text-base text-gray-700">
              {{ product.region }}
            </p>
          </div>

          <div class="mt-3 flex items-center gap-3">
            <h3 class="text-base text-gray-500">Roast Level:</h3>
            <div class="flex items-center gap-x-2">
              <span class="text-base text-gray-700">{{
                product.roastLevel + " /"
              }}</span>
              <span class="flex gap-x-1">
                <span
                  v-for="n in product.roastLevel"
                  class="circle-full w-3 aspect-square rounded-full bg-primary border border-primary"
                  :key="n"
                ></span>
                <span
                  v-for="n in 5 - product.roastLevel"
                  class="circle-empty w-3 aspect-square rounded-full border border-primary-200"
                  :key="5 - n"
                ></span>
              </span>
            </div>
          </div>

          <div class="mt-3 flex items-center gap-3">
            <h3 class="text-base text-gray-500">Flavour:</h3>
            <div class="product-flavour">
              <span class="text-base text-gray-700">{{
                product.flavorProfile.join(", ")
              }}</span>
            </div>
          </div>

          <div class="mt-3 flex items-center gap-3">
            <h3 class="text-base text-gray-500">Grind:</h3>
            <div class="product-grind-options">
              <span class="text-base text-gray-700">{{
                product.grindOption.join(", ")
              }}</span>
            </div>
          </div>

          <form class="mt-6" @submit.prevent="handleAddToCart">
            <div class="mt-10 flex">
              <div
                v-if="cart && cartItem"
                class="flex relative flex-col max-w-xs flex-1 border border-transparent sm:w-full"
              >
                <!-- Quantity selector -->
                <div class="relative flex items-center justify-center w-full">
                  <button
                    @click="decrementQuantity()"
                    type="button"
                    class="flex justify-center items-center text-white bg-primary-600 hover:bg-primary-500 border-0 border-gray-300 rounded-s-lg p-3 h-12 w-1/5 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                  >
                    <MinusIcon class="w-5" />
                  </button>
                  <input
                    type="text"
                    v-model.number="cartItem.quantity"
                    @input="updateQuantity()"
                    class="bg-gray-50 border-x-0 border-gray-300 h-12 text-center text-gray-900 w-3/5 text-sm focus:ring-0 focus:border-primary-600 block py-2.5"
                  />
                  <button
                    @click="incrementQuantity()"
                    type="button"
                    class="flex justify-center items-center text-white bg-primary-600 hover:bg-primary-500 border-0 border-gray-300 rounded-e-lg p-3 h-12 w-1/5 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                  >
                    <PlusIcon class="w-5" />
                  </button>
                </div>
              </div>
              <button
                v-else-if="cart !== null"
                type="submit"
                class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              >
                Add to Basket
              </button>

              <button
                type="button"
                @click="handleToggleWishlist"
                class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <HeartIcon
                  :class="{
                    'fill-primary': isProductInWishlist,
                    'stroke-primary': isProductInWishlist,
                  }"
                  class="h-6 w-6 flex-shrink-0 text-red"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div v-if="cartItem" class="mt-6">
              <router-link
                :to="{ path: '/cart' }"
                class="text-sm font-medium text-primary-600 hover:text-primary-500"
                >View Shopping Bag</router-link
              >
            </div>
          </form>

          <section aria-labelledby="details-heading" class="mt-12">
            <h2 id="details-heading" class="sr-only">Additional details</h2>
          </section>
        </div>
      </div>
    </div>

    <div class="py-4">
      <h2 class="sm:pl-6 m-3 text-xl">Discover more products</h2>
      <ProductSwiper
        :productIds="productIds"
        :minimalMode="true"
        :promoCard="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";
import ProductSwiper from "@app-components/ProductSwiper.vue";
import Breadcrumbs from "@app-components/common/Breadcrumbs.vue";
import { useToast } from "@app-utils/toastUtils.js";
import eventBus from "@app-utils/eventBus";

const route = useRoute();
const showToast = useToast();
const store = useStore();

const isProductInWishlist = ref(false);
const LOCAL_STORAGE_CART_KEY = "localCart";
const productIds = ref([]);
const product = ref(null);
const products = ref([]);
const cart = ref(null);

const isSignedIn = computed(() => store.getters["auth/isSignedIn"]);
const currentUser = computed(() => store.getters["auth/currentUser"]);

const cartItem = computed(() => {
  if (!cart.value || !product.value) return null;
  return cart.value.items.find((item) => item.productId === product.value.id);
});

const checkIfProductInWishlist = async () => {
  if (!isSignedIn.value || !product.value) return false;

  try {
    const response = await axios.get(
      `http://localhost:8080/api/wishlists/user/${currentUser.value.id}`
    );
    const wishlist = response.data;

    isProductInWishlist.value = wishlist.items.some(
      (item) => item.productId === product.value.id
    );
  } catch (error) {
    if (error.response?.status === 404) {
      isProductInWishlist.value = false;
    } else {
      console.error("Error checking wishlist:", error);
    }
  }
};

const handleToggleWishlist = async () => {
  if (!isSignedIn.value) {
    showToast({ message: "Please sign in to use this feature", type: "info" });
    return;
  }

  if (!product.value) return;

  try {
    if (isProductInWishlist.value) {
      await removeFromWishlist();
    } else {
      await addToWishlist();
    }
    await checkIfProductInWishlist();
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    showToast({ message: "Failed to update wishlist", type: "error" });
  }
};

const addToWishlist = async () => {
  try {
    await axios.post(
      `http://localhost:8080/api/wishlists/add/${currentUser.value.id}`,
      {
        productId: product.value.id,
        productName: product.value.name,
        price: product.value.price,
        imageUrl: product.value.imageUrl,
        flavorProfile: product.value.flavorProfile,
        roastLevel: product.value.roastLevel,
      }
    );
    showToast({ message: "Added to wishlist", type: "success" });
  } catch (error) {
    throw error;
  }
};

const removeFromWishlist = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/wishlists/user/${currentUser.value.id}`
    );
    const wishlist = response.data;

    const productToRemove = wishlist.items.find(
      (item) => item.productId === product.value.id
    );

    if (productToRemove) {
      const updatedItems = wishlist.items.filter(
        (item) => item.productId !== product.value.id
      );

      await axios.put(`http://localhost:8080/api/wishlists/${wishlist.id}`, {
        userId: currentUser.value.id,
        items: updatedItems,
      });

      showToast({ message: "Removed from wishlist", type: "success" });
    }
  } catch (error) {
    throw error;
  }
};

const getLocalCart = () => {
  const localCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  return localCart ? JSON.parse(localCart) : { items: [] };
};

const setLocalCart = (cartData) => {
  localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartData));
};

const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/products");
    products.value = response.data.content;
    productIds.value = products.value
      .map((product) => product.productId)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

const fetchProduct = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/products/${route.params.id}`
    );
    product.value = response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    showToast({ message: "Failed to load product", type: "error" });
  }
};

const initializeCart = async () => {
  if (isSignedIn.value) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/carts/user/${currentUser.value.id}`
      );
      cart.value = response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        cart.value = { items: [] };
      } else {
        console.error("Error initializing cart:", error);
        showToast({ message: "Error loading your cart", type: "error" });
      }
    }
  } else {
    // Use localStorage cart for guest users
    cart.value = getLocalCart();
  }
};

const handleAddToCart = async () => {
  if (!product.value) return;

  try {
    if (isSignedIn.value) {
      const response = await axios.post(
        `http://localhost:8080/api/carts/user/${currentUser.value.id}/items`,
        {
          productId: product.value.id,
          productName: product.value.name,
          price: product.value.price,
          quantity: 1,
          imageUrl: product.value.imageUrl,
        }
      );
      cart.value = response.data;
    } else {
      const localCart = getLocalCart();
      const existingItem = localCart.items.find(
        (item) => item.productId === product.value.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        localCart.items.push({
          productId: product.value.id,
          productName: product.value.name,
          price: product.value.price,
          quantity: 1,
          imageUrl: product.value.imageUrl,
        });
      }

      setLocalCart(localCart);
      cart.value = localCart;
    }

    eventBus.emit("cart-updated");
    showToast({ message: "Item added to basket", type: "success" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    showToast({ message: "Failed to add item to cart", type: "error" });
  }
};

const updateCartItemQuantity = async (quantity) => {
  if (!product.value) return;

  try {
    if (isSignedIn.value) {
      const response = await axios.put(
        `http://localhost:8080/api/carts/user/${currentUser.value.id}/items/${product.value.id}/${quantity}`
      );
      cart.value = response.data;
    } else {
      const localCart = getLocalCart();
      const item = localCart.items.find(
        (item) => item.productId === product.value.id
      );

      if (item) {
        item.quantity = quantity;
        setLocalCart(localCart);
        cart.value = localCart;
      }
    }

    showToast({ message: "Quantity updated", type: "success" });
  } catch (error) {
    throw error;
  }
};

const removeFromCart = async () => {
  if (!product.value) return;

  try {
    if (isSignedIn.value) {
      await axios.delete(
        `http://localhost:8080/api/carts/user/${currentUser.value.id}/items/${product.value.id}`
      );

      try {
        const response = await axios.get(
          `http://localhost:8080/api/carts/user/${currentUser.value.id}`
        );
        cart.value = response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          cart.value = { items: [] };
        } else {
          throw error;
        }
      }
    } else {
      const localCart = getLocalCart();
      localCart.items = localCart.items.filter(
        (item) => item.productId !== product.value.id
      );
      setLocalCart(localCart);
      cart.value = localCart;
    }

    showToast({ message: "Item removed from basket", type: "success" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    const errorMessage =
      error.response.data.message || "Failed to remove item from cart";
    showToast({ message: errorMessage, type: "error" });
  }
};

const decrementQuantity = async () => {
  if (!cartItem.value) return;

  try {
    const newQuantity = cartItem.value.quantity - 1;
    if (newQuantity < 1) {
      await removeFromCart();
    } else {
      await updateCartItemQuantity(newQuantity);
    }

    eventBus.emit("cart-updated");
  } catch (error) {
    console.error("Error decrementing quantity:", error);
    showToast({ message: "Failed to update quantity", type: "error" });
  }
};

const incrementQuantity = async () => {
  if (!cartItem.value) return;

  try {
    const newQuantity = cartItem.value.quantity + 1;
    await updateCartItemQuantity(newQuantity);

    eventBus.emit("cart-updated");
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    showToast({ message: "Failed to update quantity", type: "error" });
  }
};

const updateQuantity = async () => {
  if (!cartItem.value) return;

  try {
    const newQuantity = parseInt(cartItem.value.quantity);
    if (isNaN(newQuantity)) return;

    if (newQuantity < 1) {
      await removeFromCart();
    } else {
      await updateCartItemQuantity(newQuantity);
    }

    eventBus.emit("cart-updated");
  } catch (error) {
    console.error("Error updating quantity:", error);
    showToast({ message: "Failed to update quantity", type: "error" });
  }
};

onMounted(async () => {
  await initializeCart();
  await fetchProduct();
  await fetchProducts();
  if (isSignedIn.value) {
    await checkIfProductInWishlist();
  }
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchProduct();
      if (isSignedIn.value) {
        await checkIfProductInWishlist();
      }
    }
  }
);
</script>
