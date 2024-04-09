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
      order:{
        phone:"",
        message:"",
        current_pay_type:"Наличные",
        pay_types:["Наличные","Перевод с карты", "Другое"]
      },
      current_sorting:1,
      sortings:[
        {id:1, name:"популярности"},
        {id:2, name:"цене"},
        {id:3, name:"алфавиту"},
      ],
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
        per_page: 20,
      },
    };
  },
  getters: {
    getCartCount(state) {
      return state.cart.reduce((acc, i) => acc + i.count, 0);
    },
    getCartPrice(state) {
      return state.cart.reduce((acc, i) => acc + i.price * i.count, 0);
    },
    getCartProductCount: (state) => (id) => {
      for (const item of state.cart) {
        if (item.id === id) {
          return item.count;
        }
      }
      return 0;
    },
    getCategoryName: (state) => (id) => {
      for (const category of state.catalog.categories) {
        if (category.id === id) {
          return category.name;
        }
      }
      return "Нет категории";
    },
    getSubcategoryName: (state) => (id) => {
      for (const subcategory of state.catalog.subcategories) {
        if (subcategory.id === id) {
          return subcategory.name;
        }
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
  },
  mutations: {
    removeProductFromCart(state, id) {
      let index = 0;
      for (let item of state.cart) {
        if (item.id === id) {
          state.cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(state.cart));
          return;
        }
        index++;
      }
    },
    addToCart(state, product) {
      for (let item of state.cart) {
        if (item.id === product.id) {
          item.count++;
          localStorage.setItem("cart", JSON.stringify(state.cart));
          return;
        }
      }
      product.count = 1;
      state.cart.push(product);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart(state, id) {
      let index = 0;
      for (let item of state.cart) {
        if (item.id === id) {
          if (item.count > 1) {
            item.count--;
            localStorage.setItem("cart", JSON.stringify(state.cart));
            return;
          } else {
            state.cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(state.cart));
            return;
          }
        }
        index++;
      }
    },
    clearCart(state) {
      state.cart = [];
      localStorage.removeItem("cart");
    },
    incrementPage(state) {
      state.catalog.current_page++;
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
    createOrder(){
      let order_data = {
          phone: store.state.order.phone,
          payment_type: store.state.order.current_pay_type,
          products: store.state.cart
      };
      if(store.state.order.message){
        order_data.message = store.state.order.message;
      }
      window.axios
        .post("orders", order_data)
        .then(function (response) {
          if (response.data.status) {
            store.state.cart=[];
            localStorage.removeItem("cart");
            alert("Заказ совершен");
          }
          else{
            alert("Не удалось совершить заказ")
          }
        });
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

if (localStorage.getItem("cart")) {
  store.state.cart = JSON.parse(localStorage.getItem("cart"));
}

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
