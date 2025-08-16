<template>
  <div class="bg-white pb-3 pt-3">
    <!-- Hero Section -->
    <div
      class="relative isolate px-6 pt-14 lg:px-8 bg-primary-800 rounded-lg mx-3 overflow-hidden"
    >
      <div
        class="bg-coffee absolute w-full h-full top-0 left-0 z-[-1] opacity-15"
      ></div>
      <div class="mx-auto max-w-2xl pb-16 sm:pb-16 lg:pb-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Coffee Shop
          </h1>
          <p class="mt-6 lg:text-lg lg:leading-8 text-white">
            Discover exceptional coffee at our Coffee Shop, where each cup is a
            delightful experience. Savor meticulously brewed coffees crafted
            from the finest beans.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div>
      <!-- Filter/Search Bar -->
      <div class="bg-primary-300 rounded-lg m-3">
        <div
          class="flex items-start sm:items-center justify-between mx-auto p-4 gap-x-2 gap-y-5 w-full flex-wrap lg:flex-nowrap"
        >
          <!-- Active Filters -->
          <div
            v-if="!hasActiveFilters"
            class="p-2 text-xs hidden lg:block max-lg:order-last"
          >
            All Products
          </div>
          <ul
            v-else
            class="flex flex-wrap items-center gap-2 max-lg:order-last"
          >
            <li class="sm:border-r border-primary pr-2 mr-1 w-full sm:w-auto">
              <button
                type="button"
                @click="clearAllFilters"
                class="text-xs p-2 rounded-lg hover:shadow-md hover:bg-primary-100"
              >
                Clear All
              </button>
            </li>
            <!-- Display executed search term -->
            <li
              v-if="executedSearchQuery"
              class="bg-primary-100 rounded-lg p-0.5"
            >
              <span
                class="inline-flex items-center gap-x-0.5 rounded-md px-2 py-1 text-xs"
              >
                Search: {{ executedSearchQuery }}
                <button
                  @click="clearSearch"
                  type="button"
                  class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
                >
                  <span class="sr-only">Remove search</span>
                  <svg
                    viewBox="0 0 14 14"
                    class="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                </button>
              </span>
            </li>
            <!-- Display active filters -->
            <li
              v-for="(values, filter) in activeFilters"
              :key="filter"
              class="bg-primary-100 rounded-lg p-0.5"
            >
              <span
                v-for="value in values"
                :key="value"
                class="inline-flex items-center gap-x-0.5 rounded-md px-2 py-1 text-xs capitalize"
              >
                {{ filter }}: {{ value }}
                <button
                  @click="removeFilter(filter, value)"
                  type="button"
                  class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
                >
                  <span class="sr-only">Remove {{ filter }} filter</span>
                  <svg
                    viewBox="0 0 14 14"
                    class="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                </button>
              </span>
            </li>
          </ul>

          <!-- Search Input -->
          <div class="relative text-gray-700 lg:ml-auto max-lg:flex-grow">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              @blur="handleSearch"
              type="search"
              placeholder="Search products..."
              class="w-full bg-primary-50 focus:bg-white h-10 px-5 pr-10 rounded-full text-sm border-0 focus:outline-none focus:ring-0 hover:shadow focus:shadow-md active:shadow-md"
            />
            <!-- Clear button (X) -->
            <button
              v-if="searchQuery"
              @click="clearSearch"
              type="button"
              class="absolute right-6 top-0 mt-3 mr-4"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <!-- Search button -->
            <button
              @click="handleSearch"
              type="button"
              class="absolute right-0 top-0 mt-3 mr-4"
            >
              <MagnifyingGlassIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Filter Button -->
          <button
            type="button"
            @click="openFilterModal = true"
            class="flex items-center rounded-md hover:shadow-md hover:bg-primary-100"
          >
            <AdjustmentsHorizontalIcon class="w-9 h-9 p-1.5" />
            <span class="hidden md:block ml-1 mr-3 text-xs">Filters</span>
          </button>
        </div>
      </div>

      <!-- Filter Modal -->
      <ProductFilterModal
        :openFilterModal="openFilterModal"
        :activeFilters="activeFilters"
        @close="openFilterModal = false"
        @apply-filters="applyFilters"
      />

      <!-- Product List -->
      <ProductList :products="products" :loading="loading" />

      <!-- Pagination -->
      <div class="px-3 mt-6">
        <Pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total-items="totalItems"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import ProductList from "@app-components/ProductList.vue";
import ProductFilterModal from "@app-components/ProductFilterModal.vue";
import Pagination from "@app-components/common/Pagination.vue";
import axios from "axios";

const store = useStore();

const currentPage = computed(() => store.getters["products/currentPage"]);
const pageSize = computed(() => store.getters["products/pageSize"]);
const activeFilters = computed({
  get: () => store.getters["products/filters"],
  set: (val) => store.commit("products/SET_FILTERS", val),
});

const executedSearchQuery = computed({
  get: () => store.getters["products/search"],
  set: (val) => store.commit("products/SET_SEARCH", val),
});

const totalItems = ref(0);
const totalPages = ref(0);

const products = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const openFilterModal = ref(false);

const hasActiveFilters = computed(
  () =>
    Object.keys(activeFilters.value).length > 0 ||
    executedSearchQuery.value !== ""
);

const fetchProducts = async () => {
  try {
    loading.value = true;

    // rebuild params fresh each time
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };

    if (executedSearchQuery.value?.trim()) {
      params.search = executedSearchQuery.value.trim();
    }

    Object.entries(activeFilters.value).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        params[key] = values.join(",");
      }
    });

    store.commit("products/SET_PARAMS", params);

    const response = await axios.get("http://localhost:8080/api/products", {
      params,
    });

    products.value = response.data.content || [];
    totalItems.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

    store.commit("products/SET_PAGE", response.data.number + 1);
  } catch (err) {
    console.error("Error fetching products:", err);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  executedSearchQuery.value = searchQuery.value;
  store.commit("products/SET_PAGE", 1);
  fetchProducts();
};

const clearSearch = () => {
  searchQuery.value = "";
  executedSearchQuery.value = "";
  store.commit("products/SET_SEARCH", "");
  store.commit("products/SET_PAGE", 1);
  fetchProducts();
};

const applyFilters = (filters) => {
  activeFilters.value = filters;
  store.commit("products/SET_PAGE", 1);
  fetchProducts();
};

const removeFilter = (filter, value) => {
  const newFilters = { ...activeFilters.value };
  newFilters[filter] = newFilters[filter].filter((item) => item !== value);
  if (newFilters[filter].length === 0) {
    delete newFilters[filter];
  }
  activeFilters.value = newFilters;
  store.commit("products/SET_PAGE", 1);
  fetchProducts();
};

const clearAllFilters = () => {
  activeFilters.value = {};
  searchQuery.value = "";
  executedSearchQuery.value = "";
  store.commit("products/SET_FILTERS", {});
  store.commit("products/SET_SEARCH", "");
  store.commit("products/SET_PAGE", 1);
  store.commit("products/SET_PARAMS", {});
  fetchProducts();
};

const handlePageChange = (newPage) => {
  store.commit("products/SET_PAGE", newPage);
  fetchProducts();
};

onMounted(() => {
  fetchProducts();
});
</script>
