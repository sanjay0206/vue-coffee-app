import { mergeLocalCart } from "@app-utils/cartUtils";

const state = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  isSignedIn: localStorage.getItem("isSignedIn") || false,
};

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
    // Persist to localStorage
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  },
  SET_SIGNED_IN(state, status) {
    state.isSignedIn = status;
    // Persist to localStorage
    if (status) {
      localStorage.setItem("isSignedIn", true);
    } else {
      localStorage.removeItem("isSignedIn");
    }
  },
  CLEAR_AUTH(state) {
    state.currentUser = null;
    state.isSignedIn = false;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("localCart");
  },
};

const actions = {
  initializeAuth({ commit }) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const isSignedIn = localStorage.getItem("isSignedIn");

    if (user && isSignedIn) {
      commit("SET_CURRENT_USER", user);
      commit("SET_SIGNED_IN", true);
    } else {
      commit("CLEAR_AUTH");
    }
  },
  async login({ commit }, userData) {
    commit("SET_CURRENT_USER", userData);
    commit("SET_SIGNED_IN", true);

    try {
      await mergeLocalCart(userData.id);
    } catch (e) {
      console.error("Cart merge failed:", e);
    }
  },
  logout({ commit }) {
    commit("CLEAR_AUTH");
  },
};

const getters = {
  currentUser: (state) => state.currentUser,
  isSignedIn: (state) => state.isSignedIn,
  email: (state) => state.currentUser?.email,
  firstName: (state) => state.currentUser?.firstName,
  lastName: (state) => state.lastName?.lastName,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
