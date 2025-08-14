<template>
  <h1 class="text-2xl font-bold px-8 py-4">Stats</h1>
  <div class="px-8">
    <h3 class="text-base font-semibold leading-6 text-gray-900">
      Last 30 days
    </h3>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.name"
        class="overflow-hidden rounded-lg bg-primary-50/50 px-4 py-5 shadow sm:p-6"
      >
        <dt class="truncate text-sm font-medium text-gray-500">
          {{ item.name }}
        </dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {{ item.stat }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const props = defineProps({
  searchTerm: {
    type: String,
    default: "",
  },
});

const stats = ref([
  { name: "Total Orders", stat: "0" },
  { name: "Revenue", stat: "£0" },
  { name: "Avg. Order", stat: "£0" },
  { name: "Products per Order", stat: "0" },
]);

const fetchStats = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/admin/stats");

    stats.value = [
      { name: "Total Orders", stat: response.data.totalOrders },
      { name: "Revenue", stat: `£${response.data.totalSales}` },
      { name: "Avg. Order", stat: `£${response.data.averageOrderValue}` },
      { name: "Products per Order", stat: response.data.productsPerOrder },
    ];
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

onMounted(async () => {
  fetchStats();
});
</script>
