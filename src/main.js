import "./assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createStore } from "vuex";

const axios_instance = axios.create({
  baseURL: "http://localhost:8000/api/",
});
window.axios = axios_instance;

const store = createStore({
  state() {
    return {
      cart: [],
      is_loading: false,
      search_query: "",
      catalog: {
        products: [],
        categories: [],
        subcategories: [],
        current_category: -1,
        current_subcategory: 0,
        current_page: 1,
        has_products: true,
        per_page: 16,
      },
    };
  },
  getters: {
    getCartCount(state) {
      return state.cart.length;
    },
    getCartPrice(state) {
      return state.cart.reduce((acc, i) => acc + i.price, 0);
    },
    getCartProductCount: (state) => (id) => {
      return state.cart.filter((v) => v.id == id).length;
    },
    getCurrentCategory(state) {
      return state.catalog.categories[state.catalog.current_category];
    },
    getCurrentSubcategories(state) {
      return state.catalog.subcategories.filter(
        (i) => i.category_id === state.catalog.current_category
      );
    },
  },
  mutations: {
    addToCart(state, product) {
      state.cart.push(product);
      localStorage.setItem('cart', state.cart);
    },
    removeFromCart(state, id) {
      for (const i of state.cart) {
        if (i.id == id) {
          state.cart.splice(state.cart.indexOf(i), 1);
          localStorage.setItem('cart', state.cart);
          break;
        }
      }
    },
    incrementPage(state) {
      state.catalog.current_page++;
      console.log(state.catalog.current_page);
    },
    resetProducts(state) {
      state.catalog.current_page = 1;
      state.catalog.has_products = true;
      state.catalog.products = [];
    },
    setSearchQuery(state, query) {
      state.search_query = query;
    },
    selectCategory(state, id) {
      if (state.catalog.current_category != id) {
        store.commit("resetProducts");
        state.catalog.current_category = id;
        state.catalog.current_subcategory = 0;
        store.dispatch("loadMoreProducts");
      }
    },
    selectSubcategory(state, id) {
      if (state.catalog.current_subcategory != id) {
        store.commit("resetProducts");
        state.catalog.current_subcategory = id;
        store.dispatch("loadMoreProducts");
      }
    },
  },
  actions: {
    loadCategories() {
      window.axios
        .get("categories")
        .then(function (response) {
          if (response.data.status) {
            store.state.catalog.categories = response.data.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadSubcategories() {
      window.axios
        .get("subcategories")
        .then(function (response) {
          if (response.data.status) {
            store.state.catalog.subcategories = response.data.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadCatalog() {
      this.dispatch("loadCategories");
      this.dispatch("loadSubcategories");
    },
    loadMoreProducts(state, per_page = -1) {
      let pp = per_page != -1 ? per_page : store.state.catalog.per_page;
      let request_params = {
        page: store.state.catalog.current_page,
        per_page: pp,
        category_id: store.state.catalog.current_category,
      };
      if (store.state.catalog.current_subcategory != 0) {
        request_params.subcategory_id = store.state.catalog.current_subcategory;
      }
      window.axios
        .get("products", {
          params: request_params,
        })
        .then(function (response) {
          if (response.data.status) {
            if (!response.data.data.length) {
              store.state.catalog.has_products = false;
            } else {
              store.state.catalog.products.push(...response.data.data);
              store.state.catalog.current_page++;
            }
          }
        });
    },
  },
});

if(localStorage.hasItem('cart')){
  store.state.cart = JSON.parse(localStorage.getItem('cart'));
}

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
