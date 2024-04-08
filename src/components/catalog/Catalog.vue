<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Product from './Product.vue';

export default {
  components: { Product },
  data(){
    return {
      products_load_interval:null
    }
  },
  computed: {
    ...mapState(["catalog"]),
    ...mapGetters(["getCurrentCategory", "getCurrentSubcategories"]),
  },
  methods: {
    ...mapActions(["loadCatalog","loadMoreProducts"]),
    ...mapMutations(["selectSubcategory", "selectCategory"]),
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
      if (this.isScrolledToBottomHalf()) {
        this.loadMoreProducts();
      }
    },
  },
  created() {
    this.$store.commit('resetProducts');
    this.loadCatalog();
    this.loadMoreProducts(50);
    this.products_load_interval = setInterval(this.scrollHandler, 1500);
  },
  unmounted(){
    clearInterval(this.products_load_interval);
  }
};
</script>

<template>
  <div class="catalog-wrapper">
    <div class="catalog-categories mb-4">
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
        @click="selectCategory(category.id)"
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
            @click="selectSubcategory(subcategory.id)"
            class="catalog-category catalog-subcategory"
            :class="{ active: catalog.current_subcategory == subcategory.id }"
          >
            {{ subcategory.name }}
          </div>
        </template>
      </div>
    </template>
    <div class="catalog-products d-flex row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5">
      <product class="px-3 mb-5" v-for="(product, index) in catalog.products" :key="index" :product="product" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";


.catalog-products{
  padding-top: 60px;
  flex-wrap: wrap;
  flex-direction: row;
}
.catalog-category {
  padding: 10px 30px;
  color: $default-text-color;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  font-weight: 600;
  border-radius: 30px;
  &:hover {
    background: #f1f1f1;
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
