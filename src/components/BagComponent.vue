<template>
  <router-link to="/cart" class="lg:hidden ms-5 flow-root text-sm relative">
    <ShoppingBagIcon
      class="h-6 w-6 flex-shrink-0 text-gray-800 group-hover:text-gray-500"
      aria-hidden="true"
    />
    <span
      class="absolute left-1/2 transform -translate-x-1/2 -top-4 text-xs font-normal text-gray-800 group-hover:text-gray-500"
      >{{ totalQuantity }}</span
    >
    <span class="sr-only">items in cart, view bag</span>
  </router-link>

  <Popover class="max-lg:hidden ms-5 flow-root text-sm relative">
    <template #default="{ close }">
      <PopoverButton
        class="group -m-2 flex items-center p-2 focus:outline-none"
      >
        <ShoppingBagIcon
          class="h-6 w-6 flex-shrink-0 text-gray-800 group-hover:text-gray-500"
          aria-hidden="true"
        />
        <span
          class="absolute left-1/2 transform -translate-x-1/2 -top-4 text-xs font-normal text-gray-800 group-hover:text-gray-500"
          >{{ totalQuantity }}</span
        >
        <span class="sr-only">items in cart, view bag</span>
      </PopoverButton>
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <PopoverPanel
          class="absolute z-20 inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5"
        >
          <div v-if="cartProducts.length">
            <h2 class="sr-only">Shopping Cart</h2>

            <form
              @submit.prevent="handleCartCheckout"
              class="mx-auto max-w-2xl px-4"
            >
              <ul
                role="list"
                class="divide-y divide-gray-200 max-h-96 overflow-y-scroll"
              >
                <li
                  v-for="product in cartProducts"
                  :key="product.productId"
                  class="flex items-center py-6"
                >
                  <router-link
                    :to="{ path: `/product/${product.productId}` }"
                    class="relative"
                  >
                    <img
                      :src="product.imageUrl"
                      :alt="product.name"
                      class="h-16 w-16 flex-none rounded-md border border-gray-200"
                    />
                    <span
                      class="absolute flex items-center justify-center text-[10px] -bottom-2 -right-2 bg-gray-200 rounded-full aspect-square min-w-5 px-1"
                      >{{ product.quantity }}</span
                    >
                  </router-link>
                  <div class="ml-4 flex-auto">
                    <h3 class="font-medium text-gray-900">
                      <router-link
                        :to="{ path: `/product/${product.productId}` }"
                        >{{ product.name }}</router-link
                      >
                    </h3>
                    <p class="text-gray-500">£{{ product.price }}</p>
                  </div>
                  <XMarkIcon
                    class="h-4 text-gray-300 hover:text-red-600 cursor-pointer"
                    @click="removeFromCart(product.productId)"
                  />
                </li>
              </ul>

              <button
                @click="close"
                type="submit"
                class="w-full rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>

              <p class="mt-6 text-center">
                <router-link
                  @click="close"
                  :to="{ path: '/cart' }"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >View Shopping Bag</router-link
                >
              </p>
            </form>
          </div>
          <div v-else class="flex flex-col gap-5 p-4">
            <p class="text-gray-500">Your cart is empty!</p>
            <router-link
              :to="{ path: '/products' }"
              @click="close"
              class="text-center w-full rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >Add Products</router-link
            >
          </div>
        </PopoverPanel>
      </transition>
    </template>
  </Popover>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { useToast } from "@app-utils/toastUtils.js";
import eventBus from "@app-utils/eventBus";

const router = useRouter();
const store = useStore();
const showToast = useToast();
const isSignedIn = computed(() => store.getters["auth/isSignedIn"]);
const currentUser = computed(() => store.getters["auth/currentUser"]);

const LOCAL_STORAGE_CART_KEY = "localCart";
const cartProducts = ref([]);

const getLocalCart = () => {
  const localCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  return localCart ? JSON.parse(localCart) : { items: [] };
};

const setLocalCart = (cartData) => {
  localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartData));
};

const fetchCart = async () => {
  try {
    if (isSignedIn.value) {
      const response = await axios.get(
        `http://localhost:8080/api/carts/user/${currentUser.value.id}`
      );
      cartProducts.value = response.data?.items || [];
    } else {
      const localCart = getLocalCart();
      cartProducts.value = localCart.items;
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    showToast({ message: "Failed to load your cart", type: "error" });
  }
};

const totalQuantity = computed(() => {
  return cartProducts.value.reduce((acc, product) => acc + product.quantity, 0);
});

const handleCartCheckout = () => {
  router.push("/checkout");
};

const removeFromCart = async (productId) => {
  try {
    if (isSignedIn.value) {
      await axios.delete(
        `http://localhost:8080/api/carts/user/${currentUser.value.id}/items/${productId}`
      );
    } else {
      const localCart = getLocalCart();
      localCart.items = localCart.items.filter(
        (item) => item.productId !== productId
      );
      setLocalCart(localCart);
    }

    await fetchCart();
    showToast({ message: "Item removed from cart", type: "success" });
    eventBus.emit("cart-updated");
  } catch (error) {
    console.error("Error removing from cart:", error);
    showToast({ message: "Failed to remove item", type: "error" });
  }
};

// Event bus setup
const setupEventListeners = () => {
  eventBus.on("cart-updated", fetchCart);
};

const cleanupEventListeners = () => {
  eventBus.off("cart-updated", fetchCart);
};

onMounted(async () => {
  await fetchCart();
  setupEventListeners();
});

onUnmounted(() => {
  cleanupEventListeners();
});
</script>
