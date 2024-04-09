<script>
import IconCart from "@/components/icons/IconCart.vue";
import IconBucket from "@/components/icons/IconBucket.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconMinus from "@/components/icons/IconMinus.vue";
import OrangeOutlineBtn from "@/components/ui/OrangeOutlineBtn.vue";
import IconRemove from "@/components/icons/IconRemove.vue";
import IconShopping from "@/components/icons/IconShopping.vue";
import OrangeBtn from "@/components/ui/OrangeBtn.vue";
import VueSelect from "vue-select";

export default {
  components: {
    IconCart,
    IconBucket,
    IconMinus,
    IconShopping,
    VueSelect,
    IconPlus,
    OrangeBtn,
    OrangeOutlineBtn,
    IconRemove,
  },
  computed: {
    ...mapState(["order", "cart"]),
    ...mapGetters([
      "getCartProductCount",
      "getCartPrice",
      "getCartCount",
      "getCategoryName",
      "getSubcategoryName",
    ]),
  },
  methods: {
    ...mapMutations([
      "removeProductFromCart",
      "clearCart",
      "removeFromCart",
      "addToCart",
      "selectPayType"
    ]),
    ...mapActions(['createOrder'])
  },
};
</script>

<template>
  <div class="container-lg d-flex flex-column pb-5">
    <template v-if="cart.length > 0">
      <div class="row d-flex justify-content-between cart-header">
        <div class="col d-flex align-items-center">
          <IconCart color="#3F3F3F" width="30" height="30" />
          <div class="ms-3 display-6 fw-bolder">Корзина</div>
        </div>
        <div
          class="col-auto align-items-center d-flex text-secondary"
          @click="clearCart"
          role="button"
        >
          <IconBucket class="me-2" /> Очистить корзину
        </div>
      </div>
      <div class="cart-items d-flex flex-column">
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <div class="cart-item-left col-6">
            <img src="/images/flash.jpg" class="cart-item-image" />
            <div class="cart-item-info">
              <div class="cart-item-name">{{ item.name }}</div>
              <div class="cart-item-desc">
                {{ getCategoryName(item.category_id) }} /
                {{ getSubcategoryName(item.subcategory_id) }}
              </div>
            </div>
          </div>
          <div class="cart-item-btns col-2">
            <orange-outline-btn
              class="button circle-btn"
              @click="removeFromCart(item.id)"
              ><icon-minus></icon-minus
            ></orange-outline-btn>
            <div class="cart-item-count">
              {{ getCartProductCount(item.id) }}
            </div>
            <orange-outline-btn
              class="button circle-btn"
              @click="addToCart(item)"
              ><icon-plus></icon-plus
            ></orange-outline-btn>
          </div>
          <div class="cart-item-price col-2">
            {{ getCartProductCount(item.id) * item.price }} ₽
          </div>
          <div
            @click="removeProductFromCart(item.id)"
            class="outline-secondary cart-item-remove col-2 button circle-btn"
          >
            <icon-remove />
          </div>
        </div>
      </div>
      <div class="row mt-4 d-flex justify-content-between">
        <div class="col d-flex align-items-center">
          <div class="fs-5">
            Всего товаров: <span class="fw-bolder">{{ getCartCount }} шт.</span>
          </div>
        </div>
        <div class="col-auto align-items-center">
          <div class="fs-5">
            Сумма заказа:
            <span class="text-orange fw-bolder">{{ getCartPrice }} ₽</span>
          </div>
        </div>
      </div>
      <div class="row mt-5 d-flex justify-content-between">
        <RouterLink to="/" class="outline-secondary big-btn">
          Вернуться назад
        </RouterLink>
        <OrangeBtn
          data-bs-toggle="modal"
          data-bs-target="#orderModal"
          class="col-auto px-5"
        >
          Заказать
        </OrangeBtn>
      </div>
    </template>
    <template v-else>
      <div class="m-auto cart-empty text-center">
        <div class="display-6 fw-bold mb-2">Корзина пуста</div>
        <div class="text-secondary mb-5">
          Вероятнее всего, Вы ещё не добавили товары в корзину. <br />
          Для того, чтобы это сделать, перейдите на главную страницу.
        </div>
        <icon-shopping class="mb-5" />
        <RouterLink to="/" class="dark-btn">Вернуться назад</RouterLink>
      </div>
    </template>

    <div
      class="modal fade"
      id="orderModal"
      tabindex="-1"
      aria-labelledby="orderModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div>
              <div class="mb-3">
                <label for="phone" class="col-form-label"
                  >Телефон (или другой контакт):</label
                >
                <input type="text" v-model="order.phone" required class="form-control" id="phone" />
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label"
                  >Сообщение (не обязательно):</label
                >
                <textarea v-model="order.message" maxlength="300" class="form-control" id="message-text"></textarea>
              </div>
              <label class="col-form-label"
                  >Тип оплаты:</label
                >
              <VueSelect
                v-model="order.current_pay_type"
                :autocomplete="false"
                :options="order.pay_types"
                class="mb-3"
              ></VueSelect>
            </div>
            <OrangeBtn @click="createOrder" data-bs-dismiss="modal" class="ms-auto mt-4 px-5">Заказать</OrangeBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.cart-item-image {
  height: 100%;
  object-fit: cover;
}
.cart-item-name {
  font-weight: 600;
  font-size: 20px;
}
.cart-item-desc {
  font-size: 16px;
  color: $secondary-text-color;
}
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cart-item-count {
  font-size: 18px;
  font-weight: 700;
}
.cart-item-price {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  text-align: center;
}
.cart-item-remove {
  border-width: 2px;
}
.cart-item-btns {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  .orange-outline-btn {
    &:hover {
      background: $default-bg-color;
      path {
        color: #fff;
      }
    }
  }
}
.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cart-item {
  align-items: center;
  display: flex;
  align-items: center;
  height: 140px;
  padding: 30px 0;
  border-top: 1px solid $ui-border-color;
}
.cart-items {
  max-height: 400px;
  overflow-y: scroll;
}
.cart-item-left {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 15px;
}
.cart-header {
  padding-bottom: 30px;
}
</style>
