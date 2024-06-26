<script>
import { RouterLink } from "vue-router";
import IconCart from "./icons/IconCart.vue";
import IconSearch from "./icons/IconSearch.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import IconRemove from "./icons/IconRemove.vue";
import OrangeOutlineBtn from "./ui/OrangeOutlineBtn.vue";
import OrangeBtn from "./ui/OrangeBtn.vue";

export default {
  data() {
    return {
      search_active: false,
      floating_search_active: false,
      search_suggestions: [],
    };
  },
  components: {
    IconCart,
    IconRemove,
    IconSearch,
    RouterLink,
    OrangeBtn,
    OrangeOutlineBtn,
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
    ...mapActions(["searchProducts"]),
    search() {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
      this.searchProducts();
    },
    autocompleteSelected(v) {
      this.search_suggestions = [];
      this.setSearchQuery(v);
      this.search();
    },
    searchFocusOut() {
      setTimeout(() => {
        this.search_active = false;
      }, 300);
    },
    floatingSearchFocusOut() {
      setTimeout(() => {
        this.floating_search_active = false;
      }, 300);
    },
    searchInput(v) {
      this.setSearchQuery(v);
      if (v.length < 2) {
        this.search_suggestions = [];
        return;
      }
      window.axios.get("products/search/autocomplete/" + v).then((response) => {
        if (response.data.data) {
          this.search_suggestions = response.data.data;
        } else {
          this.search_suggestions = [];
        }
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
  <div id="floating-header" class="gap-x-2">
    <div class="header-search w-1/3 ms-auto">
      <input
        type="text"
        class="block form-input appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded search-input"
        :value="search_query"
        placeholder="Найти товар"
        @focusin="floating_search_active = true"
        @focusout="floatingSearchFocusOut"
        @keydown.enter="
          search($event.target.value);
          floatingSearchFocusOut();
        "
        @click="searchInput($event.target.value)"
        @input="searchInput($event.target.value)"
      />
      <div
        class="header-autocomplete-search"
        v-if="search_suggestions.length && floating_search_active"
      >
        <div
          v-for="(item, index) in search_suggestions"
          :key="index"
          @click="autocompleteSelected(item.name)"
          class="header-autocomplete-item"
        >
          {{ item.name }}
        </div>
      </div>
      <IconSearch
        v-if="!search_query.length"
        :color="search_icon_color"
        class="header-search__btn"
      />
      <IconRemove
        v-else
        :color="search_icon_color"
        class="header-remove-search__btn"
        @click="
          setSearchQuery('');
          search();
        "
      />
    </div>

    <RouterLink :to="{ name: 'cart' }" class="header-cart button">
      <div class="header-cart-price">{{ getCartPrice }} ₽</div>
      <div class="header-cart-line"></div>
      <div class="header-cart__btn">
        <IconCart></IconCart>{{ getCartCount }}
      </div>
    </RouterLink>
  </div>

  <header>
    <div class="lg:container px-5 xl:px-20 mx-auto flex-col flex">
      <div class="flex items-center justify-between">
        <RouterLink :to="{ name: 'home' }" class="header-left flex">
          <div class="header-left-info flex flex-col">
            <h1 class="header-title">Korzinochka</h1>
            <h2 class="header-desc">продукты оптом в Осетии</h2>
          </div>
        </RouterLink>
        <div class="header-search me-3 w-1/3 ms-auto hidden md:flex">
          <input
            type="text"
            class="block form-input appearance-none w-full py-1 px-2 bg-white text-gray-800 border border-gray-200 rounded-full search-input header-search-input"
            :value="search_query"
            placeholder="Найти товар"
            @focusin="search_active = true"
            @focusout="searchFocusOut"
            @keydown.enter="
              search($event.target.value);
              searchFocusOut();
            "
            @click="searchInput($event.target.value)"
            @input="searchInput($event.target.value)"
          />
          <div
            class="header-autocomplete-search"
            v-if="search_suggestions.length && search_active"
          >
            <div
              v-for="(item, index) in search_suggestions"
              :key="index"
              @click="autocompleteSelected(item.name)"
              class="header-autocomplete-item"
            >
              {{ item.name }}
            </div>
          </div>
          <IconSearch
            v-if="!search_query.length"
            :color="search_icon_color"
            class="header-search__btn"
          />
          <IconRemove
            v-else
            :color="search_icon_color"
            class="header-remove-search__btn"
            @click="
              setSearchQuery('');
              search();
            "
          />
        </div>
        <div class="header-right flex">
          <RouterLink :to="{ name: 'cart' }" class="header-cart button">
            <div class="header-cart-price">{{ getCartPrice }} ₽</div>
            <div class="header-cart-line"></div>
            <div class="header-cart__btn">
              <IconCart></IconCart>{{ getCartCount }}
            </div>
          </RouterLink>
        </div>
      </div>
      <div
        class="header-search header-search-mobile relative flex-grow max-w-full flex-1 flex md:hidden me-0"
      >
        <input
          type="text"
          class="block form-input appearance-none w-full bg-white border rounded-full search-input"
          :value="search_query"
          placeholder="Найти товар"
          @focusin="search_active = true"
          @focusout="searchFocusOut"
          @keydown.enter="
            search($event.target.value);
            searchFocusOut();
          "
          @click="searchInput($event.target.value)"
          @input="searchInput($event.target.value)"
        />
        <div
          class="header-autocomplete-search"
          v-if="search_suggestions.length"
        >
          <div
            v-for="(item, index) in search_suggestions"
            :key="index"
            @click="autocompleteSelected(item.name)"
            class="header-autocomplete-item"
          >
            {{ item.name }}
          </div>
        </div>
        <IconSearch
          v-if="!search_query.length"
          :color="search_icon_color"
          class="header-search__btn"
        />
        <IconRemove
          v-else
          :color="search_icon_color"
          class="header-remove-search__btn"
          @click="
            setSearchQuery('');
            search();
          "
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.header-search-mobile {
  margin-top: 30px;
}
.header-search__btn,
.header-remove-search__btn {
  position: absolute;
  right: 20px;
  top: 50%;
  overflow: visible;
  width: 20px;
  cursor: pointer;
  height: 20px;
  transform: translateY(-50%);
}
.header-remove-search__btn {
  width: 15px;
  z-index: 10;
  height: 15px;
}
.header-autocomplete-search {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  background: #fff;
  border: 1px solid $ui-border-color;
  color: $default-text-color;
  z-index: 2;
  overflow: hidden;
  display: flex;
  border-radius: 30px;
  flex-direction: column;
  width: 100%;
}
.header-autocomplete-item {
  display: flex;
  align-items: center;
  padding: 15px 50px 15px 20px !important;
  cursor: pointer;
  &:hover {
    background: $light-hover-bg;
    color: $orange-color;
  }
}
.header-right {
  height: 55px;
  gap: 5px;
}
.header-search {
  position: relative;
  .search-input {
    height: 55px !important;
    border-radius: 30px;
    padding: 10px 50px 10px 20px !important;
  }
  .header-search-input {
    position: relative;
    background: transparent;
    z-index: 2;
  }
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
  background-color: $orange-color;
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
.header-left {
  position: relative;
}
.header-left-info {
  background: #fff;
  z-index: 5;
}
header {
  padding: 30px 0;
  border-bottom: 1px solid $ui-border-color;
  margin-bottom: 20px;
}

.header-title {
  line-height: 1em !important;
  margin: 0;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 1.7rem;
}
.header-desc {
  margin: 0;
  line-height: 1em !important;
  color: $orange-color;
  font-size: 1rem;
}
.header-cart-price{
  text-wrap:nowrap
}

@media (max-width: 800px) {
  #floating-header {
    .header-search {
      display: none;
    }
    top: auto;
    bottom: 25px;
    right: auto;
    left:-200px;
    &.active {
      transform: translateX(-50%);
      right:auto;
      left: 50%;
    }
  }
  header{
    .header-cart{
      padding: 10px 20px;
    }
  }
}
@media (max-width: 440px) {
  .header-title {
    font-size: 1rem;
  }
  .header-desc {
    font-size: 0.6rem;
  }
}
</style>
