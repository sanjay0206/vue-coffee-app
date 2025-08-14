<template>
  <div>
    <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
      Wishlist
    </h1>
    <p class="mt-1 text-sm leading-6 text-gray-500">Your wishlist items.</p>
    <ProductList :products="wishlistedProducts" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import ProductList from "@app-components/ProductList.vue";

const wishlistedProducts = ref([]);
const store = useStore();

const isSignedIn = computed(() => store.getters["auth/isSignedIn"]);
const currentUser = computed(() => store.getters["auth/currentUser"]);

const fetchWishlist = async () => {
  try {
    if (isSignedIn.value) {
      const response = await axios.get(
        `http://localhost:8080/api/wishlists/user/${currentUser.value.id}`
      );

      wishlistedProducts.value = response.data.items.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: item.price,
        imageUrl: item.imageUrl,
        flavorProfile: item.flavorProfile,
        roastLevel: item.roastLevel,
      }));
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};

onMounted(async () => {
  fetchWishlist();
});
</script>
