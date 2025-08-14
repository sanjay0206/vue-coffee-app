<template>
  <nav
    class="flex max-sm:flex-col gap-3 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
  >
    <div class="block">
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ startItem }}</span>
        to
        <span class="font-medium">{{ endItem }}</span>
        of
        <span class="font-medium">{{ totalItems }}</span>
        result
      </p>
    </div>
    <div class="flex flex-1 justify-center sm:justify-end">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        <span class="sr-only">Previous</span>
      </button>
      <template v-for="page in pageNumbers" :key="page">
        <button
          @click="setPage(page)"
          :class="[
            page === currentPage
              ? 'z-10 bg-primary-600 text-white focus-visible:outline-primary-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
          ]"
        >
          {{ page }}
        </button>
      </template>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        <span class="sr-only">Next</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["page-change"]);
const startItem = computed(() =>
  props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
);

const endItem = computed(() =>
  Math.min(props.currentPage * props.pageSize, props.totalItems)
);

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= props.totalPages; i++) {
    pages.push(i);
  }
  return pages;
});

const setPage = (page) => {
  emit("page-change", page);
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    setPage(props.currentPage + 1);
  }
};

const prevPage = () => {
  if (props.currentPage > 1) {
    setPage(props.currentPage - 1);
  }
};
</script>
