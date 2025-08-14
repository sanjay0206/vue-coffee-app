<template>
  <div>
    <AdminSidebar
      :sidebarOpen="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
    />
    <div class="xl:pl-72">
      <AdminSearchBar
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @search="handleSearch"
      />
      <main>
        <router-view
          :search-term="searchTerm"
          @update:search-term="searchTerm = $event"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdminSidebar from "@app-admin/components/AdminSidebar.vue";
import AdminSearchBar from "@app-admin/components/AdminSearchBar.vue";

const sidebarOpen = ref(false);
const searchTerm = ref("");

const handleSearch = (term) => {
  searchTerm.value = term;
};
</script>
