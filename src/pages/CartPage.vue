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
  created() {
    this.$store.state.is_loading = true;
  },
  async mounted() {
    if (!this.$store.state.catalog.categories.length) {
      await this.loadCatalog();
    }
    this.$store.state.is_loading = false;
  },
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
  data() {
    return {
      add_interval: null,
      sub_interval: null,
      count_enter: false,
    };
  },
  unmounted() {
    this.addReleased();
    this.subReleased();
  },
  methods: {
    countClicked(id) {
      this.count_enter = id;
    },
    countChanged(payload) {
      this.count_enter = false;
      if (payload.count > 0 && payload.count < 1000) {
        this.setProductCount(payload);
      }
    },
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
      this.sub_interval = setInterval(() => {
        this.removeFromCart(payload);
      }, 100);
    },
    subReleased() {
      clearInterval(this.sub_interval);
    },
    ...mapMutations([
      "removeProductFromCart",
      "clearCart",
      "removeFromCart",
      "setProductCount",
      "addToCart",
      "selectPayType",
    ]),
    ...mapActions(["createOrder", "loadCatalog"]),
  },
};
</script>

<template>
  <div class="container-lg d-flex flex-column pb-5">
    <template v-if="cart.length > 0">
      <div class="row d-flex justify-content-between cart-header">
        <div class="col d-flex align-items-center ps-0">
          <IconCart color="#3F3F3F" width="25" height="25" />
          <div class="ms-2 fs-3 fw-bolder">Корзина</div>
        </div>
        <div
          class="col-auto align-items-center pe-0 d-flex text-secondary"
          @click="clearCart"
          role="button"
        >
          <IconBucket class="me-2" /> Очистить корзину
        </div>
      </div>
      <div class="cart-items d-flex flex-column">
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <div class="cart-item-left flex-row col-12 col-md-8">
            <img
              :src="$store.state.storage_url + item.image"
              class="cart-item-image"
            />
            <div
              class="w-100 w-md-auto cart-item-info justify-content-space-between"
            >
              <div
                class="d-flex flex-column align-items-end align-items-md-start"
              >
                <div class="cart-item-name">
                  {{ item.name }}
                </div>
                <div class="cart-item-desc mt-1 text-end text-sm-start">
                  {{ getCategoryName(item.category_id) }}<br class="d-block d-sm-none"><span class="d-none d-sm-inline"> /</span>
                  {{ getSubcategoryName(item.subcategory_id) }}
                </div>
                <div class="cart-item-price mt-3 fs-4 d-block d-md-none">
                  {{ (getCartProductCount(item.id) * item.price).toFixed() }}
                  ₽
                </div>
              </div>
              <div class="cart-item-right cart-item-mob-btns d-md-none">
                <div
                  class="cart-item-btns justify-content-end justify-content-md-center order-3 order-md-0"
                >
                  <orange-outline-btn
                    class="button circle-btn cart-rem"
                    @mousedown="
                      subPressed({ id: item.id, can_remove_all: false })
                    "
                    @mouseup="subReleased"
                    @mouseleave="subReleased"
                    ><icon-minus></icon-minus
                  ></orange-outline-btn>
                  <div
                    @click="countClicked(item.id)"
                    v-if="count_enter!==item.id"
                    class="cart-item-count"
                  >
                    {{ getCartProductCount(item.id) }}
                  </div>
                  <input
                    min="0"
                    maxlength="3"
                    v-else
                    @change="
                      countChanged({ id: item.id, count: $event.target.value })
                    "
                    :value="getCartProductCount(item.id)"
                    type="text"
                    id="cart-item-count-inp"
                  />
                  <orange-outline-btn
                    class="button circle-btn cart-add"
                    @mousedown="addPressed(item)"
                    @mouseup="addReleased"
                    @mouseleave="addReleased"
                    ><icon-plus></icon-plus
                  ></orange-outline-btn>
                </div>
                <div
                  @click="removeProductFromCart(item.id)"
                  class="outline-secondary cart-item-remove me-0 me-md-3 order-1 order-md-0 button circle-btn"
                >
                  <icon-remove />
                </div>
              </div>
            </div>
          </div>
          <div class="cart-item-right d-none d-md-flex col-4">
            <div
              class="cart-item-btns justify-content-end justify-content-md-center order-3 order-md-0"
            >
              <orange-outline-btn
                class="button circle-btn cart-rem"
                @mousedown="subPressed({ id: item.id, can_remove_all: false })"
                @mouseup="subReleased"
                @mouseleave="subReleased"
                ><icon-minus></icon-minus
              ></orange-outline-btn>
              <div
                @click="countClicked"
                v-if="!count_enter"
                class="cart-item-count"
              >
                {{ getCartProductCount(item.id) }}
              </div>
              <input
                min="0"
                maxlength="3"
                v-else
                @change="
                  countChanged({ id: item.id, count: $event.target.value })
                "
                :value="getCartProductCount(item.id)"
                type="text"
                id="cart-item-count-inp"
              />
              <orange-outline-btn
                class="button circle-btn cart-add"
                @mousedown="addPressed(item)"
                @mouseup="addReleased"
                @mouseleave="addReleased"
                ><icon-plus></icon-plus
              ></orange-outline-btn>
            </div>
            <div class="cart-item-price order-2 order-md-0">
              {{ (getCartProductCount(item.id) * item.price).toFixed() }} ₽
            </div>
            <div
              @click="removeProductFromCart(item.id)"
              class="outline-secondary cart-item-remove me-0 me-md-3 order-1 order-md-0 button circle-btn"
            >
              <icon-remove />
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4 d-flex justify-content-between">
        <div class="col d-flex align-items-center">
          <div class="cart-bottom-info">
            Всего товаров:<br class="d-block d-sm-none" />&nbsp;<span
              class="fw-bolder"
              >{{ getCartCount }} шт.</span
            >
          </div>
        </div>
        <div class="col-auto align-items-center">
          <div class="cart-bottom-info">
            Сумма заказа:<br class="d-block d-sm-none" />&nbsp;
            <span class="text-orange float-end float-sm-none fw-bolder"
              >{{ getCartPrice }} ₽</span
            >
          </div>
        </div>
      </div>
      <div
        class="row mt-5 d-flex cart-bottom-btns justify-content-between flex-column-reverse flex-sm-row gap-2 gap-sm-0"
      >
        <RouterLink
          to="/"
          class="outline-secondary button big-btn w-100 w-sm-auto"
        >
          Вернуться назад
        </RouterLink>
        <OrangeBtn
          data-bs-toggle="modal"
          data-bs-target="#orderModal"
          class="col-auto px-5 w-100 w-sm-auto"
        >
          Заказать
        </OrangeBtn>
      </div>
    </template>
    <template v-else>
      <div class="m-auto cart-empty text-center mt-4">
        <div class="display-6 fw-bold mb-2">Корзина пуста</div>
        <div class="text-secondary mb-5">
          Вероятнее всего, Вы ещё не добавили товары в корзину. <br />
          Для того, чтобы это сделать, перейдите на главную страницу.
        </div>
        <icon-shopping class="mb-5" />
        <RouterLink to="/" class="button dark-btn">Вернуться назад</RouterLink>
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
                <input
                  type="text"
                  v-model="order.phone"
                  required
                  class="form-control"
                  id="phone"
                />
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label"
                  >Сообщение к заказу (не обязательно):</label
                >
                <textarea
                  v-model="order.message"
                  maxlength="300"
                  class="form-control"
                  id="message-text"
                ></textarea>
              </div>
              <label class="col-form-label">Тип оплаты:</label>
              <VueSelect
                v-model="order.current_pay_type"
                autocomplete="false"
                :options="order.pay_types"
                :clearSearchOnSelect="false"
                :searchable="false"
                class="mb-3"
              ></VueSelect>
            </div>
            <OrangeBtn
              @click="createOrder"
              data-bs-dismiss="modal"
              class="ms-auto mt-4 px-5"
              >Заказать</OrangeBtn
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.cart-item-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cart-item-image {
  height: 100%;
  object-fit: cover;
  width: 150px;
  border-radius: 10px;
}
.cart-item-name {
  font-weight: 600;
  text-align: right;
  font-size: 20px;
}
.cart-item-desc {
  font-size: 16px;
  line-height: 1.1em;
  color: #ff672bf2;
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
#cart-item-count-inp {
  font-size: 18px;
  font-weight: 700;
  border: 0 !important;
  outline: 0 !important;
  background: none;
  border-radius: 0 !important;
  width: 33px;
}
.cart-item-price {
  font-size: 20px;
  font-weight: 700;
  color: $default-text-color;
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
.cart-bottom-info {
  font-size: 1.25rem;
}
.cart-item {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 30px 0;
  border-top: 1px solid $ui-border-color;
}
.cart-items {
  max-height: 400px;
  overflow-y: scroll;
  border-bottom: 1px solid $ui-border-color;
}
.cart-item-left {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 15px;
}
.cart-item-mob-btns{
  width: auto;
  gap: 3rem;
}
.cart-header {
  padding-bottom: 30px;
}
@media (max-width: 768px) {
  .cart-item-image {
    height: 100%;
    width: 120px;
  }
  .cart-items {
    max-height: none;
  }
  .cart-item-info {
    height: 100%;
    align-items: end;
    justify-content: space-between;
  }
  .cart-bottom-info {
    font-size: 1rem;
  }
  .cart-item-left {
    height: 170px;
  }
}
@media (max-width: 575.9px) {
  .cart-bottom-btns {
    & > .button {
      max-width: 100%;
    }
  }
  .cart-item-mob-btns{
    gap:0;
    width:100%;
  }
}
</style>
