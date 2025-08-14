<template>
  <div>
    <h1 class="text-2xl font-bold px-8 py-4">Users</h1>

    <!-- Users Table -->
    <div class="border-t border-gray-300 pt-11 overflow-x-auto">
      <h2
        class="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8"
      >
        {{ users.length ? "User List" : "Nothing to show" }}
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
              Email
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Name
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Registered
            </th>
            <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Status
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
          <tr v-for="user in users" :key="user.id">
            <td class="py-4 pl-4 sm:pl-6 lg:pl-8">
              <div
                class="truncate w-full font-mono text-sm leading-6 text-gray-600"
              >
                {{ user.id }}
              </div>
            </td>
            <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div class="flex items-center gap-x-4">
                <UserCircleIcon
                  class="w-7 bg-white rounded-full mix-blend-multiply"
                />
                <div
                  class="truncate text-sm font-medium leading-6 text-gray-900"
                >
                  {{ user.email }}
                </div>
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div class="text-sm leading-6 text-gray-600">
                {{ user.firstName }} {{ user.lastName }}
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div class="text-sm leading-6 text-gray-600">
                {{ formatDate(user.createdAt) }}
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div class="flex items-center gap-x-2">
                <div
                  :class="[
                    statuses[user.verified],
                    'flex-none rounded-full p-1',
                  ]"
                >
                  <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                </div>
                <div class="text-gray-900">
                  {{ user.verified ? "Verified" : "Unverified" }}
                </div>
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
import { UserCircleIcon } from "@heroicons/vue/24/outline";
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

const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const fetchUsers = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    if (props.searchTerm && props.searchTerm.trim() !== "") {
      params.searchTerm = props.searchTerm.trim();
    }

    const response = await axios.get(`http://localhost:8080/api/admin/users`, {
      params,
    });

    users.value = response.data.content;
    totalItems.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.number + 1;
  } catch (error) {
    showToast({
      message: "Failed to fetch users. Please try again later.",
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
  true: "text-green-400 bg-green-400/10",
  false: "text-rose-400 bg-rose-400/10",
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

onMounted(async () => {
  fetchUsers();
});

// Watch for changes in pagination or search term
watch([currentPage, pageSize], () => {
  fetchUsers();
});

watch(
  () => props.searchTerm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      currentPage.value = 1;
      fetchUsers();
    }
  }
);
</script>
