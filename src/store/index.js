import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // host: process.env.VUE_APP_API_URL,
    host: 'https://nails-australia-staging.herokuapp.com',
  },
  mutations: {},
  actions: {},
  modules,
});
