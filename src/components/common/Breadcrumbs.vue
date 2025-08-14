<template>
  <div class="flex items-center gap-2 px-6 py-6 -mb-3 text-xs text-primary-600">
    <button
      type="button"
      @click="goBack"
      class="inline-flex items-center gap-2 hover:text-primary-800 hover:underline border-r border-gray-300 pr-2"
    >
      <ArrowLeftIcon class="w-4" />
      Back
    </button>
    <div v-if="breadcrumbs.length" class="truncate flex items-center gap-2">
      <router-link
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
        :to="breadcrumb.path"
        class="inline-flex items-center gap-2 hover:text-primary-800 hover:underline"
      >
        <span v-if="index > 0">/</span>
        <span :class="{ 'text-gray-500': index === breadcrumbs.length - 1 }">
          {{ breadcrumb.name }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/vue/24/outline";
import axios from "axios";

onMounted(async () => {
  await fetchProducts();
});

const allProducts = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/products");
    allProducts.value = response.data.content;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const route = useRoute();
const router = useRouter();

const product = computed(() => {
  const productId = route.params.id;
  return allProducts.value
    ? allProducts.value.find((product) => product.id === productId)
    : null;
});

const breadcrumbs = computed(() => {
  const pathArray = route.path.split("/").filter((p) => p);
  const breadcrumbsArray = pathArray.map((path, index) => {
    let name;
    let breadcrumbPath = "/" + pathArray.slice(0, index + 1).join("/");

    if (index === 0) {
      name = "All Products";
      breadcrumbPath = "/products";
    } else if (index === 1 && product.value) {
      name = product.value.name;
    } else {
      name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    }
    return { path: breadcrumbPath, name: name };
  });
  return breadcrumbsArray;
});

const goBack = () => {
  router.go(-1);
};
</script>
