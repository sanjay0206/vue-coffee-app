<template>
  <div class="swiper-container">
    <swiper v-bind="swiperOptions" class="py-5 px-3">
      <!-- Render product cards for the provided productIds -->
      <swiper-slide v-for="product in featuredProducts" :key="product.id">
        <ProductCard
          :product="product"
          :minimalMode="minimalMode"
          :imageOnly="imageOnly"
          :noPrice="noPrice"
        />
      </swiper-slide>
      <!-- Promo card if enabled -->
      <swiper-slide v-if="promoCard">
        <router-link
          :to="{ path: `/products` }"
          class="aspect-square relative overflow-hidden rounded-xl flex items-center justify-center bg-primary-500 hover:shadow-xl"
        >
          <h3 class="z-10 text-center text-primary-50 font-bold text-xl block">
            Explore <br />Coffee
          </h3>
          <span
            class="bg-coffee h-full w-full absolute opacity-100 mix-blend-multiply"
          ></span>
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ProductCard from "@app-components/ProductCard.vue";

const props = defineProps({
  productIds: {
    type: Array,
    required: true,
  },
  minimalMode: {
    type: Boolean,
    default: false,
  },
  noPrice: {
    type: Boolean,
    default: false,
  },
  imageOnly: {
    type: Boolean,
    default: false,
  },
  promoCard: {
    type: Boolean,
    default: false,
  },
});

const allProducts = ref([]);
const featuredProducts = computed(() =>
  allProducts.value.filter((product) =>
    props.productIds.includes(product.productId)
  )
);

const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/products");
    allProducts.value = response.data.content;
    allProducts.value.slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

onMounted(() => {
  fetchProducts();
});

const swiperOptions = ref({
  modules: [FreeMode],
  slidesPerView: 2.2,
  spaceBetween: 15,
  breakpoints: {
    480: {
      slidesPerView: 2.2,
      spaceBetween: 20,
    },
    720: {
      slidesPerView: 3.2,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 15,
    },
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  freeMode: {
    enabled: true,
    sticky: true,
    momentum: true,
    momentumBounce: true,
  },
  speed: 600,
});
</script>

<style scoped>
.swiper-container {
  width: 100%;
  height: 100%;
}
</style>
