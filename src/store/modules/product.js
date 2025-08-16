const state = {
  currentPage: 1,
  pageSize: 10,
  params: {},
  filters: {},
  search: "",
};

const mutations = {
  SET_PAGE(state, page) {
    state.currentPage = page;
  },
  SET_PAGE_SIZE(state, size) {
    state.pageSize = size;
  },
  SET_PARAMS(state, params) {
    state.params = { ...params };
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...filters };
  },
  SET_SEARCH(state, search) {
    state.search = search;
  },
};

const getters = {
  currentPage: (state) => state.currentPage,
  pageSize: (state) => state.pageSize,
  params: (state) => state.params,
  filters: (state) => state.filters,
  search: (state) => state.search,
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
