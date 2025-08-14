<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-start py-12 sm:px-6 lg:px-8 bg-primary-900/50"
  >
    <div class="bg-coffee absolute w-full h-full top-0 left-0 z-[-1]"></div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100"
      >
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form @submit.prevent="signup" class="space-y-6">
          <!-- First Name and Last Name in same row -->
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div class="mt-2">
                <input
                  v-model="firstName"
                  id="firstName"
                  name="firstName"
                  type="text"
                  autocomplete="given-name"
                  required
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                for="lastName"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div class="mt-2">
                <input
                  v-model="lastName"
                  id="lastName"
                  name="lastName"
                  type="text"
                  autocomplete="family-name"
                  required
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div class="mt-2">
              <input
                v-model="email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <!-- Password and Confirm Password -->
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div class="mt-2">
                <input
                  v-model="password"
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  minlength="6"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                for="password_confirm"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div class="mt-2">
                <input
                  v-model="passwordConfirm"
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  autocomplete="new-password"
                  required
                  minlength="6"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="acceptTerms"
                id="termsandconditions"
                name="termsandconditions"
                type="checkbox"
                required
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                for="termsandconditions"
                class="ml-3 block text-sm leading-6 text-gray-900"
              >
                Accept the
                <button type="button" class="underline">
                  Terms and Conditions
                </button>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Register</span>
              <span v-else>Processing...</span>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-center text-sm text-red-600">
            {{ errorMessage }}
          </div>
        </form>

        <!-- Sign In Link -->
        <p class="mt-8 text-sm text-gray-500">
          Already have an account?
          <router-link
            :to="{ path: '/signin' }"
            class="font-semibold leading-6 text-primary hover:text-primary-400 hover:underline"
          >
            Sign in
          </router-link>
        </p>
      </div>

      <!-- Support Link -->
      <p class="mt-10 text-center text-sm text-gray-100">
        Need help?
        <a
          href="#"
          class="font-semibold leading-6 text-primary hover:text-primary-400 hover:underline"
        >
          Contact support
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "@app-utils/toastUtils.js";

const router = useRouter();
const showToast = useToast();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const acceptTerms = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);

const signup = async () => {
  errorMessage.value = "";

  if (!firstName.value || !lastName.value) {
    errorMessage.value = "First name and last name are required";
    return;
  }

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters";
    return;
  }

  if (!acceptTerms.value) {
    errorMessage.value = "You must accept the terms and conditions";
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post("http://localhost:8080/api/auth/signup", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    showToast({
      message: "Registration successful! Please sign in",
      type: "success",
    });

    router.push("/signin");
  } catch (error) {
    errorMessage.value = error.response.data.message;
    showToast({
      message: errorMessage.value || "Registration failed, please try again",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
