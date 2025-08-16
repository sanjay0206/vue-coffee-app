import { createStore } from "vuex";

import auth from "@app-store/modules/auth";
import products from "@app-store/modules/product";
import checkout from "@app-store/modules/checkout";
import toast from "@app-store/modules/toast";

const store = createStore({
  modules: {
    auth,
    products,
    checkout,
    toast,
  },
});

export default store;
