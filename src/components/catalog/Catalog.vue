<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Product from "./Product.vue";
import VueSelect from "vue-select";

export default {
  components: { Product, VueSelect },
  data() {
    return {
      products_load_interval: null,
      row_items: 5,
      sorting: 1,
      add_interval: null,
      sub_interval: null,
    };
  },
  computed: {
    catalogClassList() {
      return (
        "row-cols-1 " +
        "row-cols-sm-" +
        (this.row_items - 3) +
        " row-cols-md-" +
        (this.row_items - 2) +
        " row-cols-lg-" +
        (this.row_items - 1) +
        " row-cols-xl-" +
        this.row_items
      );
    },
    ...mapState(["catalog", "current_sorting", "sortings"]),
    ...mapGetters(["getCurrentCategory", "getCurrentSubcategories"]),
  },
  watch: {
    sorting(nv, ov) {
      this.selectSorting(nv);
    },
  },
  methods: {
    addPressed(item) {
      this.addToCart(item);
      this.add_interval = setInterval(() => {
        this.addToCart(item);
      }, 100);
    },
    addReleased() {
      clearInterval(this.add_interval);
    },
    subPressed(payload) {
      this.removeFromCart(payload);
      if(this.sub_interval==null){
        this.sub_interval = setInterval(() => {
        this.removeFromCart(payload);
      }, 100);
      }
    },
    subReleased() {
      clearInterval(this.sub_interval);
    },

    ...mapActions(["loadCatalog", "loadMoreProducts"]),
    ...mapMutations([
      "removeFromCart",
      "addToCart",
      "selectSorting",
      "selectSubcategory",
      "selectCategory",
    ]),
    isScrolledToBottomHalf() {
      var scrollTop =
        window.pageYOffset !== undefined
          ? window.pageYOffset
          : (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop;
      var windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      var documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      return scrollTop > (documentHeight - windowHeight) * 0.75;
    },
    scrollHandler() {
      if (
        this.isScrolledToBottomHalf() &&
        this.$store.state.catalog.has_products
      ) {
        this.loadMoreProducts();
      }
    },
  },
  created() {
    if (!this.$store.state.categories) {
      this.loadCatalog();
    }
    if (this.$store.state.catalog.has_products) {
      this.$store.commit("resetProducts");
      this.$store.state.is_loading = true;
      this.loadMoreProducts(30).finally(() => {
        this.$store.state.is_loading = false;
      });
      this.products_load_interval = setInterval(this.scrollHandler, 1000);
    }
  },
  unmounted() {
    this.addReleased();
    this.subReleased();
    clearInterval(this.products_load_interval);
  },
};
</script>

<template>
  <div class="catalog-wrapper">
    <div class="catalog-categories mb-3">
      <div
        @click="selectCategory(-1)"
        class="catalog-category"
        :class="{ active: catalog.current_category == -1 }"
      >
        Все
      </div>
      <div
        v-for="category in catalog.categories"
        :key="category.id"
        @click="selectCategory(category.id, category.name)"
        class="catalog-category"
        :class="{ active: catalog.current_category == category.id }"
      >
        {{ category.name }}
      </div>
    </div>
    <template v-if="getCurrentSubcategories.length > 0">
      <div class="catalog-subcategories">
        <template
          v-for="subcategory in getCurrentSubcategories"
          :key="subcategory.id"
        >
          <div
            @click="selectSubcategory(subcategory.id, subcategory.name)"
            class="catalog-category catalog-subcategory"
            :class="{ active: catalog.current_subcategory == subcategory.id }"
          >
            {{ subcategory.name }}
          </div>
        </template>
      </div>
    </template>
    <div class="d-flex align-items-center mt-3">
      <div
        class="user-select-none catalog-sorting d-flex flex-column flex-sm-row align-items-sm-center fw-bolder"
      >
        Сортировать по:
        <VueSelect
          v-model="sorting"
          autocomplete="false"
          :clearSearchOnSelect="false"
          :searchable="false"
          :reduce="(option) => option.id"
          :options="sortings"
          label="name"
          class="catalog-sorting-select ms-0 ms-sm-2"
        ></VueSelect>
      </div>
      <div class="ms-auto catalog-view-btns">
        <div
          @click="row_items = 4"
          :class="{ active: row_items == 4 }"
          class="view-four-items"
        ></div>
        <div
          @click="row_items = 5"
          :class="{ active: row_items == 5 }"
          class="view-five-items"
        ></div>
      </div>
    </div>
    <div class="catalog-products d-flex" :class="catalogClassList">
      <product
        class="px-3"
        v-for="(product, index) in catalog.products"
        :key="index"
        :product="product"
        @sub-pressed="subPressed"
        @sub-released="subReleased"
        @add-pressed="addPressed"
        @add-released="addReleased"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.catalog-view-btns {
  display: flex;
  & > div {
    cursor: pointer;
    opacity: 0.29;
    width: 25px;
    height: 25px;
    background-repeat: no-repeat;
    background-size: cover;
    &.active {
      opacity: 1;
    }
  }
}
.view-four-items {
  background: url(data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M0%2012.727c0-1.004.814-1.818%201.818-1.818h5.455c1.004%200%201.818.814%201.818%201.818v5.455A1.818%201.818%200%200%201%207.273%2020H1.818A1.818%201.818%200%200%201%200%2018.182v-5.455Zm6.364%200a.91.91%200%200%201%20.909.91v3.636a.91.91%200%200%201-.91.909H2.728a.91.91%200%200%201-.909-.91v-3.636a.91.91%200%200%201%20.91-.909h3.636ZM0%201.818C0%20.814.814%200%201.818%200h5.455C8.277%200%209.09.814%209.09%201.818v5.455A1.818%201.818%200%200%201%207.273%209.09H1.818A1.818%201.818%200%200%201%200%207.273V1.818Zm6.364%200a.91.91%200%200%201%20.909.91v3.636a.91.91%200%200%201-.91.909H2.728a.91.91%200%200%201-.909-.91V2.728a.91.91%200%200%201%20.91-.909h3.636ZM12.727%200a1.818%201.818%200%200%200-1.818%201.818v5.455c0%201.004.814%201.818%201.818%201.818h5.455A1.818%201.818%200%200%200%2020%207.273V1.818A1.818%201.818%200%200%200%2018.182%200h-5.455Zm5.455%202.727a.91.91%200%200%200-.91-.909h-3.636a.91.91%200%200%200-.909.91v3.636c0%20.502.407.909.91.909h3.636a.91.91%200%200%200%20.909-.91V2.728ZM10.91%2012.727c0-1.004.813-1.818%201.817-1.818h5.455c1.004%200%201.818.814%201.818%201.818v5.455A1.818%201.818%200%200%201%2018.182%2020h-5.455a1.818%201.818%200%200%201-1.818-1.818v-5.455Zm6.363%200a.91.91%200%200%201%20.909.91v3.636a.91.91%200%200%201-.91.909h-3.636a.91.91%200%200%201-.909-.91v-3.636a.91.91%200%200%201%20.91-.909h3.636Z%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E);
}
.view-five-items {
  margin-left: 12px;
  background: url(data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M15.9%201.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4V1.9a.4.4%200%200%200-.4-.4h-2.2ZM15%200a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1V1a1%201%200%200%200-1-1h-4ZM15.9%208.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4V8.9a.4.4%200%200%200-.4-.4h-2.2ZM15%207a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1V8a1%201%200%200%200-1-1h-4ZM15.9%2015.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4v-2.2a.4.4%200%200%200-.4-.4h-2.2ZM15%2014a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1v-4a1%201%200%200%200-1-1h-4ZM8.9%2015.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4v-2.2a.4.4%200%200%200-.4-.4H8.9ZM8%2014a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1v-4a1%201%200%200%200-1-1H8ZM1.9%2015.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4v-2.2a.4.4%200%200%200-.4-.4H1.9ZM1%2014a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1v-4a1%201%200%200%200-1-1H1ZM1.9%208.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4V8.9a.4.4%200%200%200-.4-.4H1.9ZM1%207a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1V8a1%201%200%200%200-1-1H1ZM8.9%208.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4V8.9a.4.4%200%200%200-.4-.4H8.9ZM8%207a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1V8a1%201%200%200%200-1-1H8ZM8.9%201.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4V1.9a.4.4%200%200%200-.4-.4H8.9ZM8%200a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1V1a1%201%200%200%200-1-1H8ZM1.9%201.5a.4.4%200%200%200-.4.4v2.2c0%20.22.18.4.4.4h2.2a.4.4%200%200%200%20.4-.4V1.9a.4.4%200%200%200-.4-.4H1.9ZM1%200a1%201%200%200%200-1%201v4a1%201%200%200%200%201%201h4a1%201%200%200%200%201-1V1a1%201%200%200%200-1-1H1Z%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E);
}
.catalog-products {
  padding-top: 60px;
  flex-wrap: wrap;
  flex-direction: row;
}
.catalog-category {
  padding: 10px 30px;
  color: $default-text-color;
  user-select: none;
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  font-weight: 600;
  border-radius: 30px;
  &:hover {
    background: #d9d9d9;
  }
  &.active {
    background: $dark-bg-color;
    color: #fff;
    &:hover {
      background: #373737;
      color: #fff;
    }
  }
}
.catalog-categories,
.catalog-subcategories {
  display: flex;
  overflow: scroll;
  scrollbar-width: 0;
  gap: 10px;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
