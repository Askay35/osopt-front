import "./assets/css/base.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createStore } from "vuex";

const axios_instance = axios.create({
  baseURL: "https://api.os-opt.ru/api/",
  // baseURL: "http://localhost:8000/api/",
});
window.axios = axios_instance;

const store = createStore({
  state() {
    return {
      // storage_url: "http://localhost:8080",
      storage_url: "https://storage.os-opt.ru",
      cart: [],
      order: {
        phone: "",
        message: "",
        current_pay_type: "Наличные",
        pay_types: ["Наличные", "Перевод с карты", "Другое"],
      },
      sortings: [
        { id: 1, name: "умолчанию" },
        { id: 2, name: "цене (сначала дешевле)" },
        { id: 3, name: "цене (сначала дороже)" },
        { id: 4, name: "алфавиту" },
      ],
      is_loading: false,
      search_query: "",
      catalog: {
        products: [],
        categories: [],
        subcategories: [],
        brands: [],
        current_category: -1,
        current_subcategory: 0,
        current_brand: 0,
        current_sorting: 1,
        current_page: 1,
        has_products: true,
        per_page: 30,
      },
    };
  },
  getters: {
    getCartCount(state) {
      return state.cart.reduce((acc, i) => acc + i.product_count, 0);
    },
    getCartPrice(state) {
      return state.cart
        .reduce((acc, i) => {
          if (i.package) {
            return acc + i.price * i.product_count * i.count;
          }
          return acc + i.price * i.product_count;
        }, 0)
        .toFixed();
    },
    getCartProductCount: (state) => (id) => {
      for (const item of state.cart) {
        if (item.id === id) {
          return item.product_count;
        }
      }
      return 0;
    },
    getCategoryName: (state) => (id) => {
      let category = state.catalog.categories.find((c) => c.id === id);
      if (category) {
        return category.name;
      }
      return "Нет категории";
    },
    getSubcategoryName: (state) => (id) => {
      let subcategory = state.catalog.subcategories.find((s) => s.id === id);
      if (subcategory) {
        return subcategory.name;
      }
      return "Нет подкатегории";
    },
    getCurrentCategory(state) {
      return state.catalog.categories[state.catalog.current_category];
    },
    getCurrentSubcategories(state) {
      return state.catalog.subcategories.filter(
        (i) => i.category_id === state.catalog.current_category
      );
    },
    getBrandName: (state) => (id) => {
      let brand = state.catalog.brands.find((b) => b.id === id);
      if (brand) {
        return brand.name;
      }
      return "Нет бренда";
    },
  },
  mutations: {
    selectSorting(state, value) {
      state.catalog.current_sorting = value;
      state.catalog.current_page = 1;
      if (state.search_query) {
        store.dispatch("searchProducts");
      } else {
        store.dispatch("loadMoreProducts", { add: false });
      }
    },
    removeProductFromCart(state, id) {
      let index = 0;
      for (let item of state.cart) {
        if (item.id === id) {
          state.cart.splice(index, 1);
          store.dispatch('saveCart');
          return;
        }
        index++;
      }
    },
    setProductCount(state, { id, product_count }) {
      for (let item of state.cart) {
        if (item.id === id) {
          item.product_count = Number.parseInt(product_count);
        }
      }
    },
    addToCart(state, product) {
      if (!("package" in product)) {
        product.package = false;
      }
      for (let item of state.cart) {
        if (item.id === product.id) {
          item.product_count++;
          store.dispatch('saveCart');
          return;
        }
      }
      product.product_count = 1;
      state.cart.push(product);
      store.dispatch('saveCart');
    },
    removeFromCart(state, { id, can_remove_all }) {
      let index = 0;
      if (can_remove_all === undefined) {
        can_remove_all = false;
      }
      for (let item of state.cart) {
        if (item.id === id) {
          if (item.product_count > 1) {
            item.product_count--;
            store.dispatch('saveCart');
            return;
          } else {
            if (can_remove_all) {
              state.cart.splice(index, 1);
              store.dispatch('saveCart');
              return;
            }
          }
        }
        index++;
      }
    },
    clearCart(state) {
      state.cart = [];
      localStorage.removeItem("osopt_cart");
    },
    incrementPage(state) {
      state.catalog.current_page++;
    },
    resetProducts(state) {
      store.commit("resetCatalogPage");
      state.catalog.products = [];
    },
    resetCatalogPage(state) {
      state.catalog.current_page = 1;
      state.catalog.has_products = true;
    },
    setSearchQuery(state, query) {
      state.search_query = query;
    },
    selectCategory(state, id) {
      if (state.catalog.current_category != id) {
        store.commit("resetCatalogPage");
        state.catalog.current_category = id;
        state.catalog.current_subcategory = 0;
        store.dispatch("loadMoreProducts", { add: false });
      }
    },
    selectSubcategory(state, id) {
      store.commit("resetCatalogPage");
      if (state.catalog.current_subcategory != id) {
        state.catalog.current_subcategory = id;
      } else {
        state.catalog.current_subcategory = 0;
      }
      store.dispatch("loadMoreProducts", { add: false });
    },
    selectBrand(state, id) {
      store.commit("resetCatalogPage");
      if (state.catalog.current_brand != id) {
        state.catalog.current_brand = id;
      } else {
        state.catalog.current_brand = 0;
      }
      store.dispatch("loadMoreProducts", { add: false });
    },
  },
  actions: {
    loadCategories() {
      return window.axios.get("categories").then(function (response) {
        if (response.data.status) {
          store.state.catalog.categories = response.data.data;
        }
      });
    },
    saveCart(){
      localStorage.setItem("osopt_cart", JSON.stringify(store.state.cart));
    },
    loadBrands() {
      return window.axios.get("brands").then(function (response) {
        if (response.data.status) {
          store.state.catalog.brands = response.data.data;
        }
      });
    },
    loadSubcategories(state, current = false) {
      let payload = {};
      if (current) {
        payload.params = { category_id: store.state.catalog.current_category };
      }
      return window.axios
        .get("subcategories", payload)
        .then(function (response) {
          if (response.data.status) {
            store.state.catalog.subcategories = response.data.data;
          }
        });
    },
    async loadCatalog() {
      await this.dispatch("loadCategories");
      await this.dispatch("loadBrands");
      await this.dispatch("loadSubcategories");
    },
    createOrder() {
      let order_data = {
        phone: store.state.order.phone,
        payment_type: store.state.order.current_pay_type,
        products: store.state.cart,
      };
      if (store.state.order.message) {
        order_data.message = store.state.order.message;
      }
      store.state.is_loading = true;
      window.axios
        .post("orders", order_data)
        .then(function (response) {
          if (response.data.status) {
            store.state.cart = [];
            localStorage.removeItem("osopt_cart");
            alert("Заказ совершен, мы свяжемся с вами в ближайшее время");
          } else {
            alert("Не удалось совершить заказ");
          }
        })
        .catch((err) => {
          store.state.cart = [];
          localStorage.removeItem("osopt_cart");
          alert("Заказ совершен, мы свяжемся с вами в ближайшее время");
        })
        .finally(() => {
          store.state.is_loading = false;
        });
    },
    searchProducts() {
      if (store.state.search_query) {
        store.state.catalog.has_products = false;
        store.state.catalog.current_page = 1;
        store.state.catalog.products = [];
        let request_params = {
          page: store.state.catalog.current_page,
          per_page: store.state.catalog.per_page,
          sorting: store.state.catalog.current_sorting,
          category_id: store.state.catalog.current_category,
          search: store.state.search_query,
        };
        if (store.state.catalog.current_subcategory != 0) {
          request_params.subcategory_id =
            store.state.catalog.current_subcategory;
        }
        store.state.is_loading = true;
        window.axios
          .get("products/search", {
            params: request_params,
          })
          .then(function (response) {
            if (response.data.status) {
              store.state.catalog.products = response.data.data;
              store.state.catalog.current_page++;
            }
          })
          .finally(() => {
            store.state.is_loading = false;
          });
      } else {
        store.commit("resetCatalogPage");
        store.dispatch("loadMoreProducts");
      }
    },
    loadMoreProducts(state, options = {}) {
      let opts = { per_page: -1, add: true };
      opts.per_page = "per_page" in options ? options.per_page : opts.per_page;
      opts.add = "add" in options ? options.add : opts.add;

      let pp =
        opts.per_page != -1 ? opts.per_page : store.state.catalog.per_page;
      let request_params = {
        page: store.state.catalog.current_page,
        per_page: pp,
        sorting: store.state.catalog.current_sorting,
        category_id: store.state.catalog.current_category,
      };
      if (store.state.catalog.current_subcategory != 0) {
        request_params.subcategory_id = store.state.catalog.current_subcategory;
      }
      if (store.state.catalog.current_brand != 0) {
        request_params.brand_id = store.state.catalog.current_brand;
      }
      return window.axios
        .get("products", {
          params: request_params,
        })
        .then(function (response) {
          if (response.data.status) {
            if (!response.data.data.length) {
              store.state.catalog.has_products = false;
              if (!opts.add) {
                store.state.catalog.products = [];
              }
            } else {
              if (opts.add) {
                store.state.catalog.products.push(...response.data.data);
              } else {
                store.state.catalog.products = response.data.data;
              }
              store.state.catalog.current_page++;
            }
          }
        });
    },
  },
});

if (localStorage.getItem("osopt_cart")) {
  store.state.cart = JSON.parse(localStorage.getItem("osopt_cart"));
}

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
