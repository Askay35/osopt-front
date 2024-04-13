<template>
  <div class="catalog-product-item">
    <div class="catalog-product-item-inner">
      <div class="catalog-product-image"><img :src="$store.state.storage_url+product.image" loading="lazy" :alt="product.name" /></div>
      <p class="catalog-product-name">
        {{ product.name }}
      </p>
      <div class="d-flex mt-auto flex-column">
        <div class="catalog-product-price">{{ product.price }} ₽</div>
        <div class="catalog-product-bottom">
          <OutlineOrangeBtn
            class="catalog-product-remove"
            v-if="count > 0"
            @click="remFromCart"
            ><IconMinus
          /></OutlineOrangeBtn>
          <OutlineOrangeBtn
            class="catalog-product-add"
            @click="pushToCart"
            :class="{ active: count > 0 }"
            ><IconPlus />Добавить
            <div class="catalog-product-btn-count" v-if="count > 0">
              {{ count }}
            </div></OutlineOrangeBtn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import IconPlus from "../icons/IconPlus.vue";
import IconMinus from "../icons/IconMinus.vue";
import OutlineOrangeBtn from "../ui/OrangeOutlineBtn.vue";

export default {
  props: {
    product: Object,
  },
  methods: {
    ...mapMutations(["addToCart", "removeFromCart"]),
    ...mapGetters(["getCartProductCount"]),
    pushToCart() {
      this.addToCart(this.product);
      this.count = this.getCartProductCount()(this.product.id);
    },
    remFromCart() {
      this.$store.commit("removeFromCart", {
        id: this.product.id,
        can_remove_all: true,
      });
      this.count = this.getCartProductCount()(this.product.id);
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  created() {
    this.count = this.getCartProductCount()(this.product.id);
  },
  components: { OutlineOrangeBtn, IconPlus, IconMinus },
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

.catalog-product-remove {
  width: 43px;
  padding: 0;
  min-width: 43px;
  svg {
    width: 15px;
  }
}
.catalog-product-btn-count {
  width: 25px;
  height: 25px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 20px;

  color: $default-bg-color;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 1px 1px 0px;
}
.catalog-product-name {
  font-weight: bolder;
  font-size: 18px;
  margin-top: 20px;
  color: $default-text-color;
}

.catalog-product-bottom {
  display: flex;
  margin-top: 12px;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
.catalog-product-item {
  margin-bottom: 60px;
}

.catalog-product-add {
  width: 100%;
  max-width: 100%;

  &.active {
    background: $default-bg-color;
    color: #fff;
    path {
      fill: #fff;
    }
    &:hover {
      background: $default-hover-bg;
    }
  }
  svg {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    margin-top: 1px;
    height: 16px;
    width: 15px;
  }
}
.catalog-product-item-inner {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  .orange-outline-btn {
    height: 43px;
    justify-content: center;
    position: relative;
  }
}
.catalog-product-image {
  overflow: hidden;
  border-radius: 6px;
  img {
    height: 100%;
    object-fit: cover;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.catalog-product-price {
  color: $default-bg-color;
  font-size: 24px;
  font-weight: 700;
}
</style>
