<!-- src/views/Signout.vue -->
<template>
  <div>Signing out...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useToast } from "@app-utils/toastUtils.js";

const router = useRouter();
const store = useStore();
const showToast = useToast();

onMounted(async () => {
  // Dispatch logout action to clear Vuex store
  await store.dispatch("auth/logout");

  router.push("/");
  showToast({ message: "You have been signed out", type: "success" });
});
</script>
