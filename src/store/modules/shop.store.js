/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

const state = {
  categories: null,
  commodities: [],
  selectedSectionName: '',
  totalCommodities: 0,
  commodity: null,
  activeCategory: null,
  fullListOfCategories: [],
  skip: 0,
};

const getters = {
  categoriesEndpoint: (state, getters, rootState) => `${rootState.host}/shop/categories`,
  commoditiesEndpoint: (state, getters, rootState) => `${rootState.host}/shop/commodities`,
  commodityEndpoint: (state, getters, rootState) => `${rootState.host}/shop/commodity`,
  searchEndpoint: (state, getters, rootState) => `${rootState.host}/shop/search`,
};

const mutations = {
  SHOP_CATEGORIES: (state, payload) => {
    state.fullListOfCategories = payload.reduce((prev, curr) => {
      prev.push(curr);
      if (Array.isArray(curr.subcategories) && curr.subcategories.length) {
        prev = prev.concat(curr.subcategories);
      }
      return prev;
    }, []);
    state.categories = payload;
  },
  SHOP_COMMODITIES: (state, payload) => {
    state.commodities = payload.commodities;
    state.skip = payload.commodities.length;
    state.totalCommodities = payload.total;
  },
  SHOP_MORE_COMMODITIES: (state, payload) => {
    state.commodities = state.commodities.concat(payload.commodities);
    state.totalCommodities = payload.total;
    state.skip = payload.totalCommodities.length;
  },
  SHOP_COMMODITY: (state, payload) => {
    state.commodity = payload.commodity[0];
  },
  CLEAR_COMMODITY: (state) => {
    state.commodity = null;
  },
  CLEAR_COMMODITIES: (state) => {
    state.commodities = [];
  },
  SET_ACTIVE_CATEGORY: (state, payload) => {
    const fullName = payload.parentName
      ? `${payload.parentName} > ${payload.name}`
      : `${payload.name} > View all`;
    state.activeCategory = { ...payload, fullName };
  },
  ADD_NEW_COMMODITY: (state, payload) => {
    state.commodities.push(payload);
    console.log('add new commodity payload', payload);
  },
};

const actions = {
  async GET_SHOP_CATEGORIES({ state, getters, commit }) {
    const response = (
      await (await fetch(`${getters.categoriesEndpoint}`)).json()
    ).categories;
    commit('SHOP_CATEGORIES', response);
    return state.categories;
  },
  async SEARCH_COMMODITIES({ state, getters, commit }, { search, skip }) {
    const response = await (
      await fetch(`${getters.searchEndpoint}/?query=${search}&skip=${skip}`)
    ).json();
    commit('SHOP_COMMODITIES', response);
    return state.comodities;
  },
  async GET_SHOP_COMMODITIES(
    { state, getters, commit },
    { categoryId, skip, show },
  ) {
    state.skip = 0;
    const response = await (
      await fetch(
        `${getters.commoditiesEndpoint}/${categoryId}?skip=${skip}&withHidden=${show}`,
      )
    ).json();
    commit('SHOP_COMMODITIES', response);
    return state.comodities;
  },
  async GET_MORE_SHOP_COMMODITIES(
    { state, getters, commit },
    { categoryId, skip, show },
  ) {
    const response = await (
      await fetch(
        `${getters.commoditiesEndpoint}/${categoryId}?skip=${state.skip}&withHidden=${show}`,
      )
    ).json();
    commit('SHOP_MORE_COMMODITIES', response);
    return state.comodities;
  },
  async GET_COMMODITY({ state, getters, commit }, { commodityId }) {
    const response = await (
      await fetch(`${getters.commodityEndpoint}/${commodityId}`)
    ).json();
    commit('SHOP_COMMODITY', response);
    return state.commodity;
  },
  async CREATE_COMMODITY({ state, getters, commit }, { data }) {
    const formData = new FormData();
    Object.keys(data).map((key) => formData.append(key, data[key]));
    try {
      const response = await fetch(
        'https://nails-australia-staging.herokuapp.com/shop/new/commodity',
        {
          method: 'POST',
          body: formData,
        },
      );
      const { data, error } = await response.json();
      // if (data) {
      //   this.$notify({
      //     group: 'foo',
      //     title: 'Commodity created',
      //   });
      // }
      // if (error) {
      //   this.$notify({
      //     group: 'foo',
      //     title: 'Error',
      //     type: 'error',
      //     text: error,
      //   });
      // }
      commit('ADD_NEW_COMMODITY', data);
      return data;
    } catch (error) {
      console.log(error);
      // this.$notify({
      //   group: 'foo',
      //   title: error.message || 'Something went wrong',
      //   type: 'error',
      // });
      return null;
    }
  },
  async UPDATE_COMMODITY({ state, getters, commit }, { data, id }) {
    const formData = new FormData();
    Object.keys(data).map((item) => formData.append(item, data[item]));
    try {
      const response = await fetch(
        `https://nails-australia-staging.herokuapp.com/shop/commodity/${id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      const { data } = await response.json();

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  async UPLOAD_IMAGES({ state, getters, commit }, { data, id }) {
    const formData = new FormData();
    [...data].map((item) => formData.append('files', item));
    try {
      const response = await fetch(
        `https://nails-australia-staging.herokuapp.com/shop/commodity/files/${id}`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const { updatedCommodity, error } = await response.json();
      if (updatedCommodity) {
        this.$notify({
          group: 'foo',
          title: 'Images uploaded',
        });
      }
      if (error) {
        this.$notify({
          group: 'foo',
          title: 'Error',
          type: 'error',
          text: error,
        });
      }
      return updatedCommodity;
    } catch (error) {
      this.$notify({
        group: 'foo',
        type: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong',
      });
      return null;
    }
  },
  async DELETE_IMAGE({ state, getters, commit }, { id }) {
    try {
      const response = await fetch(
        `https://nails-australia-staging.herokuapp.com/shop/file/${id}`,
        {
          method: 'DELETE',
        },
      );
      const { deleted, error } = await response.json();
      if (deleted) {
        this.$notify({
          group: 'foo',
          title: 'Image deleted',
        });
      }
      if (error) {
        this.$notify({
          group: 'foo',
          title: 'Error',
          type: 'error',
          text: error,
        });
      }
      return deleted;
    } catch (error) {
      this.$notify({
        group: 'foo',
        type: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong',
      });
      return null;
    }
  },
  async DELETE_COMMODITY({ state, getters, commit }, { id }) {
    try {
      const response = await fetch(
        `https://nails-australia-staging.herokuapp.com/shop/commodity/${id}`,
        {
          method: 'DELETE',
        },
      );

      const { deleted, error } = await response.json();
      if (deleted) {
        this.$notify({
          group: 'foo',
          title: 'Commodity deleted',
        });
      }
      if (error) {
        this.$notify({
          group: 'foo',
          title: 'Error',
          type: 'error',
          text: error,
        });
      }
      return deleted;
    } catch (error) {
      this.$notify({
        group: 'foo',
        type: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong',
      });
      return null;
    }
  },
  SET_NEW_CATEGORY({
    state, getters, commit, dispatch,
  }, { category }) {
    commit('SET_ACTIVE_CATEGORY', category);
    dispatch('GET_SHOP_COMMODITIES', {
      categoryId: category._id,
      skip: 0,
    });
    return state.commodity;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
