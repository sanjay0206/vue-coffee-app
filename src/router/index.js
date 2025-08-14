// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import websiteRoutes from "./modules/websiteRoutes";
import accountRoutes from "./modules/accountRoutes";
import adminRoutes from "./modules/adminRoutes";

const routes = [
  ...adminRoutes,
  ...websiteRoutes,
  ...accountRoutes,
  { path: "/:catchAll(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/coffeeshop/" : "/"
  ),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

router.beforeEach((to, from, next) => {
  // Get isSignedIn flag from localStorage
  const isSignedIn = localStorage.getItem("isSignedIn");

  if (to.path.startsWith("/account") && !isSignedIn) {
    next("/signin");
  } else {
    next();
  }
});

export default router;
