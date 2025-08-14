<template>
  <div
    v-if="topBarIsVisible"
    class="bg-primary-800 text-primary-100 py-2 px-6 lg:px-8 text-xs flex justify-between"
  >
    <ul class="flex cursor-pointer">
      <li class="flex gap-5 group">
        <span>Developer Mode</span>
        <ul class="hidden group-hover:flex gap-5">
          <router-link as="li" to="/admin" class="hover:text-white">
            admin
          </router-link>
        </ul>
      </li>
    </ul>
    <XMarkIcon class="h-4" @click="closeTopBar" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useToast } from "@app-utils/toastUtils.js";

const store = useStore();
const router = useRouter();
const showToast = useToast();

const topBarIsVisible = ref(true);

const closeTopBar = () => {
  topBarIsVisible.value = false;
};
</script>
