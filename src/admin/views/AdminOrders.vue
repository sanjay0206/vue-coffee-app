<template>
  <div>
    <h1 class="text-2xl font-bold px-8 py-4">Orders</h1>

    <!-- Orders Table -->
    <div class="border-t border-gray-300 pt-11 overflow-x-auto">
      <h2
        class="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8"
      >
        {{ orders.length ? "Order List" : "Nothing to show" }}
      </h2>
      <table class="mt-6 w-full max-w-screen whitespace-nowrap text-left">
        <colgroup>
          <col class="lg:w-auto" />
          <col class="w-full sm:w-4/12" />
          <col class="lg:w-2/12" />
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
              User
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Total
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Status
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Date
            </th>
            <th
              scope="col"
              class="py-2 pl-0 pr-8 font-semibold lg:pr-6 text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="item in orders" :key="item.orderNumber">
            <td class="py-4 pl-4 sm:pl-6 lg:pl-8">
              <div
                class="truncate w-full font-mono text-sm leading-6 text-gray-600"
              >
                {{ item.orderNumber }}
              </div>
            </td>
            <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div class="flex items-center gap-x-4">
                <CubeIcon
                  class="w-6 text-primary-500 rounded-full mix-blend-multiply"
                />
                <div
                  class="truncate text-sm font-medium leading-6 text-gray-900"
                >
                  {{ item.email }}
                </div>
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div
                class="flex items-center justify-end gap-x-2 sm:justify-start"
              >
                <div class="text-gray-600 sm:block">
                  £{{ item.total.toFixed(2) }}
                </div>
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div
                class="flex items-center justify-end gap-x-2 sm:justify-start"
              >
                <div
                  :class="[statuses[item.status], 'flex-none rounded-full p-1']"
                >
                  <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                </div>
                <div class="text-gray-900 sm:block">
                  {{ item.status }}
                </div>
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div class="text-sm leading-6 text-gray-600">
                {{ formatDate(item.datePlaced) }}
              </div>
            </td>
            <td
              class="py-4 pl-0 pr-8 text-sm leading-6 text-gray-600 lg:pr-6 text-right"
            >
              <span
                @click="
                  showToast({
                    message: 'This is just a demo stage.',
                    type: 'info',
                  })
                "
                class="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-300"
              >
                View
              </span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { CubeIcon } from "@heroicons/vue/24/outline";
import { useToast } from "@app-utils/toastUtils.js";
import axios from "axios";
import Pagination from "@app-components/common/Pagination.vue";

const showToast = useToast();

const props = defineProps({
  searchTerm: {
    type: String,
    default: "",
  },
});

const orders = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const fetchOrders = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    if (props.searchTerm && props.searchTerm.trim() !== "") {
      params.searchTerm = props.searchTerm.trim();
    }

    const response = await axios.get(`http://localhost:8080/api/admin/orders`, {
      params,
    });

    orders.value = response.data.content;
    totalItems.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.number + 1;
  } catch (error) {
    showToast({
      message: "Failed to fetch orders. Please try again later.",
      type: "error",
    });
    console.error(error);
  }
};

const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString(navigator.language, options).replace(",", "");
};

const statuses = {
  Pending: "text-orange-400 bg-orange-400/10",
  Completed: "text-green-400 bg-green-400/10",
  Cancelled: "text-rose-400 bg-rose-400/10",
  Paid: "text-blue-400 bg-blue-400/10",
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

onMounted(async () => {
  fetchOrders();
});

// Watch for changes in pagination or search term
watch([currentPage, pageSize], () => {
  fetchOrders();
});

watch(
  () => props.searchTerm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      currentPage.value = 1;
      fetchOrders();
    }
  }
);
</script>
