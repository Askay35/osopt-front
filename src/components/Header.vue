<script>
import { RouterLink } from "vue-router";
import IconCart from "./icons/IconCart.vue";
import IconSearch from "./icons/IconSearch.vue";
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      search_active: false,
      floating_search_active: false,
    };
  },
  components: {
    IconCart,
    IconSearch,
    RouterLink,
  },
  computed: {
    ...mapState(["search_query"]),
    ...mapGetters(["getCartCount", "getCartPrice"]),
    search_icon_color() {
      return this.search_active ? "#fe5f1e" : "#757575";
    },
    floating_search_icon_color() {
      return this.floating_search_active ? "#fe5f1e" : "#757575";
    },
  },
  methods: {
    ...mapMutations(["setSearchQuery"]),
    search() {
      this.$router.push({
        name: "search",
        params: { query: this.search_query },
      });
    },
  },
  mounted() {
    let cart_btn = document.getElementById("floating-header");
    window.onscroll = () => {
      if (window.scrollY > 250) {
        cart_btn.classList.add("active");
      } else {
        cart_btn.classList.remove("active");
      }
    };
  },
};
</script>

<template>
  <div id="floating-header">
    <div class="header-search col-4 ms-auto">
      <input
        type="text"
        class="form-control"
        :value="search_query"
        @keydown.enter="search"
        placeholder="Найти товар"
        @focusin="floating_search_active = true"
        @focusout="floating_search_active = false"
        v-on:input="setSearchQuery($event.target.value)"
      />
      <IconSearch
        @click="search"
        :color="floating_search_icon_color"
        class="header-search__btn"
      />
    </div>

    <RouterLink :to="{ name: 'cart' }" class="header-cart text-white d-flex">
      <div class="header-cart-price">{{ getCartPrice }} ₽</div>
      <div class="header-cart-line"></div>
      <div class="header-cart__btn"><IconCart></IconCart>{{ getCartCount }}</div>
    </RouterLink>
  </div>

  <header>
    <div
      class="container-xxl flex-column d-flex"
    >
      <div class="d-flex align-items-center justify-content-between">
        <RouterLink :to="{ name: 'home' }" class="header-left d-flex">
          <div class="header-logo"></div>
          <div class="header-left-info d-flex flex-column">
            <div class="header-title fw-bolder">ОС ОПТ</div>
            <div class="header-desc">продукты оптом в Осетии</div>
          </div>
        </RouterLink>
        <div class="header-search col-4 ms-auto d-none d-sm-flex">
          <input
            type="text"
            class="form-control"
            :value="search_query"
            @keydown.enter="search"
            placeholder="Найти товар"
            @focusin="search_active = true"
            @focusout="search_active = false"
            v-on:input="setSearchQuery($event.target.value)"
          />
          <IconSearch
            @click="search"
            :color="search_icon_color"
            class="header-search__btn"
          />
        </div>
        <div class="header-right">
          <RouterLink
            :to="{ name: 'cart' }"
            class="header-cart text-white d-flex"
          >
            <div class="header-cart-price">{{ getCartPrice }} ₽</div>
            <div class="header-cart-line"></div>
            <div class="header-cart__btn">
              <IconCart></IconCart>{{ getCartCount }}
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="header-search header-search-mobile col d-flex d-sm-none me-0">
        <input
          type="text"
          class="form-control"
          :value="search_query"
          @keydown.enter="search"
          placeholder="Найти товар"
          @focusin="search_active = true"
          @focusout="search_active = false"
          v-on:input="setSearchQuery($event.target.value)"
        />
        <IconSearch
          @click="search"
          :color="search_icon_color"
          class="header-search__btn"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.header-search-mobile{
  margin-top: 40px;
}
.header-search__btn {
  position: absolute;
  right: 20px;
  top: 50%;
  width: 20px;
  cursor: pointer;
  height: 20px;
  transform: translateY(-50%);
}
.header-search {
  position: relative;
  margin-right: 20px;
  input {
    height: 55px !important;
    border-radius: 30px;
    background: $body-bg;
    z-index: 1;
    padding: 10px 50px 10px 20px !important;
  }
  svg {
    z-index: 1;
  }
}
.header-title {
  font-size: 28px !important;
}
#floating-header {
  display: flex;
  transition: all 0.3s ease;
  position: fixed;
  top: 40px;
  right: -600px;
  z-index: 100;
  .form-control {
    border-color: transparent;
  }
  .header-cart,
  .header-search input {
    box-shadow: $default-shadow;
  }
  .header-search {
    width: 400px;
  }
  &.active {
    right: 20px;
  }
}
.header-cart {
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 15px 25px;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background-color: $default-bg-color;
}
.header-cart-line {
  width: 1px;
  height: 25px;
  margin: 0 12px;
  background: #ffffff75;
}
.header-cart__btn {
  display: flex;
  gap: 6px;
}
.header-logo {
  svg {
    height: 100%;
    width: 50px;
  }
  position: absolute;
  left: 7px;
  width: 93px;
  height: 80px;
  top: -30%;
  z-index: 1;
  border: 3px solid #fe5f1e;
  border-radius: 10px;
}
.header-left {
  position: relative;
}
.header-left-info {
  position: relative;
  background: #fff;
  z-index: 5;
  padding: 5px 0;
}
header {
  padding: 40px 0;
  border-bottom: 1px solid $ui-border-color;
  margin-bottom: 40px;
}
.header-desc {
  color: #7b7b7b;
  font-size: 14px !important;
}
@media (max-width: 800px) {
  #floating-header {
    .header-search {
      width: 200px;
    }
  }
}
</style>
