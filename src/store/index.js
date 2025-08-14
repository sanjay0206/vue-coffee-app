import { createStore } from "vuex";

import auth from "@app-store/modules/auth";
import checkout from "@app-store/modules/checkout";
import toast from "@app-store/modules/toast";

const store = createStore({
  modules: {
    auth,
    checkout,
    toast,
  },
});

export default store;
