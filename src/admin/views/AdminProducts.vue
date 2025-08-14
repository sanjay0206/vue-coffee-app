<template>
  <div>
    <div class="flex justify-between items-center px-8 py-4">
      <h1 class="text-2xl font-bold">Products</h1>
      <button
        @click="openAddModal"
        class="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
        Add Product
      </button>
    </div>

    <!-- Products Table -->
    <div class="border-t border-gray-300 pt-11 overflow-x-auto">
      <h2
        class="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8"
      >
        Product List
      </h2>
      <table class="mt-6 w-full max-w-screen whitespace-nowrap text-left">
        <colgroup>
          <col class="lg:w-auto" />
          <col class="w-full sm:w-4/12" />
          <col class="lg:w-4/12" />
          <col class="lg:w-2/12" />
          <col class="lg:w-1/12" />
          <col class="lg:w-1/12" />
        </colgroup>
        <thead class="border-b border-gray-300 text-sm leading-6 text-gray-900">
          <tr>
            <th scope="col" class="py-2 pl-4 font-semibold sm:pl-6 lg:pl-8">
              ID
            </th>
            <th
              scope="col"
              class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Product Name
            </th>
            <th
              scope="col"
              class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              IMG
            </th>
            <th
              scope="col"
              class="py-2 pl-0 pr-8 font-semibold sm:pl-6 lg:pl-0"
            >
              Price
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Stock
            </th>
            <th
              scope="col"
              class="py-2 pl-0 pr-8 font-semibold sm:pl-6 lg:pl-0"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="py-4 pl-4 sm:pl-6 lg:pl-8">
              <div
                class="font-mono text-sm leading-6 text-gray-600 max-w-[120px] truncate"
                :title="product.productId"
              >
                {{ product.productId }}
              </div>
            </td>
            <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div class="flex items-center gap-x-4">
                <div
                  class="text-sm font-medium leading-6 text-gray-900 max-w-[200px] truncate"
                  :title="product.name"
                >
                  {{ product.name }}
                </div>
              </div>
            </td>
            <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div class="flex items-center gap-x-4">
                <img
                  :src="product.imageUrl"
                  alt=""
                  class="h-10 w-10 -m-1 scale-150"
                />
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div
                class="flex items-center justify-end gap-x-2 sm:justify-start"
              >
                <time class="text-gray-600 sm:block">£{{ product.price }}</time>
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div
                class="flex items-center justify-end gap-x-2 sm:justify-start"
              >
                <div
                  :class="[
                    'flex-none rounded-full p-1',
                    statuses[product.stock],
                  ]"
                >
                  <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                </div>
              </div>
            </td>
            <td
              class="py-4 pl-0 pr-8 text-sm leading-6 text-gray-600 lg:pr-6 text-right"
            >
              <div class="flex space-x-2 justify-end">
                <span
                  @click="openModal(product)"
                  class="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-300 cursor-pointer hover:bg-gray-300 transition-colors"
                >
                  <EyeIcon class="h-3 w-3 mr-1" />
                  View
                </span>
                <span
                  @click="openEditModal(product)"
                  class="inline-flex items-center rounded-md bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200 cursor-pointer hover:bg-primary-200 transition-colors"
                >
                  <PencilIcon class="h-3 w-3 mr-1" />
                  Edit
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="totalItems"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Product Detail Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
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

        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Product Details
          </h2>

          <div v-if="selectedProduct" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="block text-sm font-medium text-gray-700">ID</p>
                <p class="mt-1 text-sm text-gray-600 break-all">
                  {{ selectedProduct.id }}
                </p>
              </div>
              <div>
                <p class="block text-sm font-medium text-gray-700">Name</p>
                <p class="mt-1 text-sm text-gray-600 break-words">
                  {{ selectedProduct.name }}
                </p>
              </div>
            </div>

            <div>
              <p class="block text-sm font-medium text-gray-700">Description</p>
              <p class="mt-1 text-sm text-gray-600 break-words">
                {{ selectedProduct.description }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="block text-sm font-medium text-gray-700">Price</p>
                <p class="mt-1 text-sm text-gray-600">
                  £{{ selectedProduct.price }}
                </p>
              </div>
              <div>
                <p class="block text-sm font-medium text-gray-700">Region</p>
                <p class="mt-1 text-sm text-gray-600 break-words">
                  {{ selectedProduct.region }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="block text-sm font-medium text-gray-700">Weight</p>
                <p class="mt-1 text-sm text-gray-600">
                  {{ selectedProduct.weight }}g
                </p>
              </div>
              <div>
                <p class="block text-sm font-medium text-gray-700">
                  Roast Level
                </p>
                <p class="mt-1 text-sm text-gray-600 break-words">
                  {{ selectedProduct.roastLevel }}
                </p>
              </div>
            </div>

            <div>
              <p class="block text-sm font-medium text-gray-700">
                Flavor Profile
              </p>
              <div class="mt-1 flex flex-wrap gap-2">
                <span
                  v-for="flavor in selectedProduct.flavorProfile"
                  :key="flavor"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ flavor }}
                </span>
              </div>
            </div>

            <div>
              <p class="block text-sm font-medium text-gray-700">
                Grind Options
              </p>
              <div class="mt-1 flex flex-wrap gap-2">
                <span
                  v-for="option in selectedProduct.grindOption"
                  :key="option"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ option }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="block text-sm font-medium text-gray-700">Quantity</p>
                <p class="mt-1 text-sm text-gray-600">
                  {{ selectedProduct.quantity }}
                </p>
              </div>
              <div>
                <p class="block text-sm font-medium text-gray-700">
                  Stock Status
                </p>
                <span
                  :class="[
                    'mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    statuses[selectedProduct.stock],
                  ]"
                >
                  <span class="h-2 w-2 rounded-full bg-current"></span>
                  {{ selectedProduct.stock.replaceAll("_", " ") }}
                </span>
              </div>
            </div>

            <div class="flex justify-center mt-4">
              <img
                :src="selectedProduct.imageUrl"
                alt="Product Image"
                class="w-48 h-48 object-contain rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-gray-50 px-6 py-3 rounded-b-lg flex justify-end space-x-3 border-t"
        >
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closeAddModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>

        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            {{ isEditing ? "Edit Product" : "Add New Product" }}
          </h2>

          <form @submit.prevent="submitProduct" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  >Product Name</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="newProduct.name"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="price"
                  class="block text-sm font-medium text-gray-700"
                  >Price (£)</label
                >
                <input
                  type="number"
                  id="price"
                  v-model="newProduct.price"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                  >Description</label
                >
                <textarea
                  id="description"
                  v-model="newProduct.description"
                  rows="5"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label
                  for="imageUrl"
                  class="block text-sm font-medium text-gray-700"
                  >Image URL</label
                >
                <input
                  type="url"
                  id="imageUrl"
                  v-model="newProduct.imageUrl"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="region"
                  class="block text-sm font-medium text-gray-700"
                  >Region</label
                >
                <input
                  type="text"
                  id="region"
                  v-model="newProduct.region"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="weight"
                  class="block text-sm font-medium text-gray-700"
                  >Weight (g)</label
                >
                <input
                  type="number"
                  id="weight"
                  v-model="newProduct.weight"
                  min="0"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="roastLevel"
                  class="block text-sm font-medium text-gray-700"
                  >Roast Level (1-5)</label
                >
                <select
                  id="roastLevel"
                  v-model="newProduct.roastLevel"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                >
                  <option value="1">1 (Light)</option>
                  <option value="2">2 (Medium-Light)</option>
                  <option value="3">3 (Medium)</option>
                  <option value="4">4 (Medium-Dark)</option>
                  <option value="5">5 (Dark)</option>
                </select>
              </div>

              <div>
                <label
                  for="quantity"
                  class="block text-sm font-medium text-gray-700"
                  >Quantity</label
                >
                <input
                  type="number"
                  id="quantity"
                  v-model="newProduct.quantity"
                  min="0"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="stock"
                  class="block text-sm font-medium text-gray-700"
                  >Stock Status</label
                >
                <select
                  id="stock"
                  v-model="newProduct.stock"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700"
                  >Flavor Profile</label
                >
                <div
                  class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4"
                >
                  <div
                    v-for="flavor in availableFlavors"
                    :key="flavor"
                    class="flex items-center space-x-2"
                  >
                    <input
                      :id="`flavor-${flavor}`"
                      type="checkbox"
                      :value="flavor"
                      v-model="newProduct.flavorProfile"
                      class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      :for="`flavor-${flavor}`"
                      class="text-sm text-gray-700"
                    >
                      {{ flavor }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700"
                  >Grind Options</label
                >
                <div
                  class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4"
                >
                  <div
                    v-for="option in availableGrindOptions"
                    :key="option"
                    class="flex items-center space-x-2"
                  >
                    <input
                      :id="`grind-${option}`"
                      type="checkbox"
                      :value="option"
                      v-model="newProduct.grindOption"
                      class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      :for="`grind-${option}`"
                      class="text-sm text-gray-700"
                    >
                      {{ option }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                @click="closeAddModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {{ isEditing ? "Update Product" : "Save Product" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "@app-components/common/Pagination.vue";
import { useToast } from "@app-utils/toastUtils.js";

const showToast = useToast();

const props = defineProps({
  searchTerm: {
    type: String,
    default: "",
  },
});

const isEditing = ref(false);
const currentProductId = ref(null);

const openEditModal = (product) => {
  isEditing.value = true;
  currentProductId.value = product.id;
  // Populate the form with existing product data
  newProduct.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    region: product.region,
    weight: product.weight,
    flavorProfile: [...product.flavorProfile],
    grindOption: [...product.grindOption],
    roastLevel: product.roastLevel,
    imageUrl: product.imageUrl,
    quantity: product.quantity,
    stock: product.stock,
  };
  isAddModalOpen.value = true;
};

const products = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const selectedProduct = ref(null);
const isModalOpen = ref(false);
const isAddModalOpen = ref(false);

const availableFlavors = ref([
  "Almond",
  "Black Cherry",
  "Blackcurrant",
  "Blueberry",
  "Caramel",
  "Cardamom",
  "Chocolate",
  "Cinnamon",
  "Citrus",
  "Citrusy",
  "Clove",
  "Cocoa",
  "Coconut",
  "Dark Chocolate",
  "Earthy",
  "Espresso",
  "Floral",
  "Fruit",
  "Hazelnut",
  "Honey",
  "Milk Chocolate",
  "Molasses",
  "Nutty",
  "Smoke",
  "Smooth",
  "Spicy",
  "Toffee",
  "Tropical Fruit",
  "Vanilla",
]);

const availableGrindOptions = ref([
  "Cafetiere",
  "Espresso",
  "Filter",
  "French Press",
  "Pour Over",
  "Tea",
  "Whole Bean",
]);

const newProduct = ref({
  name: "",
  description: "",
  price: 0,
  region: "",
  weight: 0,
  flavorProfile: [],
  grindOption: [],
  roastLevel: 3,
  imageUrl: "",
  quantity: 0,
  stock: "IN_STOCK",
});

const openModal = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
};

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  isEditing.value = false;
  currentProductId.value = null;
  resetNewProduct();
};

const resetNewProduct = () => {
  newProduct.value = {
    name: "",
    description: "",
    price: 0,
    region: "",
    weight: 0,
    flavorProfile: [],
    grindOption: [],
    roastLevel: 3,
    imageUrl: "",
    quantity: 0,
    stock: "IN_STOCK",
  };
};

const submitProduct = async () => {
  try {
    const payload = {
      ...newProduct.value,
      price: parseFloat(newProduct.value.price),
      weight: parseInt(newProduct.value.weight),
      roastLevel: parseInt(newProduct.value.roastLevel),
      quantity: parseInt(newProduct.value.quantity),
    };

    let response;
    if (isEditing.value) {
      response = await axios.put(
        `http://localhost:8080/api/admin/products/${currentProductId.value}`,
        payload
      );
      showToast({ message: "Product updated successfully!", type: "success" });
    } else {
      response = await axios.post(
        "http://localhost:8080/api/admin/products",
        payload
      );
      showToast({ message: "Product added successfully!", type: "success" });
    }

    closeAddModal();
    fetchProducts();
  } catch (error) {
    console.error("Error saving product:", error);
    showToast({
      message:
        error.response?.data?.message ||
        (isEditing.value
          ? "Failed to update product"
          : "Failed to add product"),
      type: "error",
    });
  }
};

const fetchProducts = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    if (props.searchTerm && props.searchTerm.trim() !== "") {
      params.searchTerm = props.searchTerm.trim();
    }

    const response = await axios.get(
      `http://localhost:8080/api/admin/products`,
      {
        params,
      }
    );

    products.value = response.data.content;
    totalItems.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.number + 1; // Convert 0-based to 1-based
  } catch (error) {
    console.error("Error fetching products:", error);
    showToast("Failed to fetch products", "error");
  }
};

onMounted(() => {
  fetchProducts();
});

watch([currentPage, pageSize], () => {
  fetchProducts();
});

watch(
  () => props.searchTerm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      currentPage.value = 1;
      fetchProducts();
    }
  }
);

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const statuses = {
  IN_STOCK: "text-green-400 bg-green-400/10",
  OUT_OF_STOCK: "text-orange-400 bg-orange-400/10",
};
</script>
