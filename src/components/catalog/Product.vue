<template>
  <div class="catalog-product-item">
    <div class="catalog-product-item-inner">
      <div class="flex flex-col">
        <div class="catalog-product-image">
          <img
            :src="$store.state.storage_url + product.image"
            loading="lazy"
            :alt="product.name"
          />
        </div>
        <p class="catalog-product-name">
          {{ product.name }}
        </p>
        <div class="catalog-product-attribute">
          <div class="text-gray-600">В упаковке:</div>
          <div class="catalog-product-attribute__value">
            {{ product.count ? product.count + " шт." : "Не указано" }}
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex flex-col">
          <div class="catalog-product-price">{{ product.price }} ₽</div>
          <div class="catalog-product-bottom">
            <OutlineOrangeBtn
              class="catalog-product-remove"
              v-if="in_cart"
              @click="removeProductFromCart(product.id)"
              ><IconMinus
            /></OutlineOrangeBtn>
            <OutlineOrangeBtn
              class="catalog-product-add"
              @click="addClick"
              :class="{ active: in_cart }"
              ><IconPlus v-if="!in_cart" /><IconCart class="cart-icon" v-else />{{
                in_cart ? "В корзину" : "Добавить"
              }}
            </OutlineOrangeBtn>
          </div>
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
import IconCart from "../icons/IconCart.vue";

export default {
  props: {
    product: Object,
  },
  methods: {
    ...mapMutations(["addToCart", "removeProductFromCart"]),
    ...mapGetters(["getCartProductCount", "getSubcategoryName"]),
    addClick() {
      if (!this.in_cart) {
        this.product.subcategory = this.getSubcategoryName()(
          this.product.subcategory_id
        );
        this.addToCart(this.product);
      } else {
        this.$router.push({ name: "cart" });
      }
    },
  },
  computed: {
    in_cart() {
      return this.getCartProductCount()(this.product.id) > 0;
    },
  },
  components: { OutlineOrangeBtn, IconPlus, IconMinus, IconCart },
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

.catalog-product-remove {
  width: 43px;
  padding: 0;
  min-width: 43px;
  svg {
    width: 11px;
    height: 3px;
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

  color: $orange-color;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 1px 1px 0px;
}
.catalog-product-name {
  font-weight: bolder;
  margin-bottom: 5px;
  font-size: 18px;
  margin-top: 30px;
  color: $default-text-color;
}

.catalog-product-bottom {
  display: flex;
  margin-top: 12px;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}

.catalog-product-add {
  width: 100%;
  max-width: 100%;

  &.active {
    background: $orange-color;
    color: #fff;
    path {
      fill: #fff;
    }
    &:hover {
      background: $orange-hover-color;
    }
  }
  svg {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    margin-top: 1px;
    width: 12px;
    &.cart-icon{
      width: 16px;
    }
  }
}
.catalog-product-item-inner {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  color: $orange-color;
  font-size: 24px;
  font-weight: 700;
  margin-top: 20px;
}
</style>
