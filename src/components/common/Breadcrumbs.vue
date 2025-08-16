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
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const product = ref(null);

onMounted(async () => {
  const productId = route.params.id;
  if (productId) {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/products/${productId}`
      );
      product.value = res.data;
    } catch (err) {
      console.error("Failed to fetch product for breadcrumbs:", err);
    }
  }
});

const breadcrumbs = computed(() => {
  const pathArray = route.path.split("/").filter((p) => p);
  return pathArray.map((path, index) => {
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

    return { path: breadcrumbPath, name };
  });
});

const goBack = () => {
  router.go(-1);
};
</script>
