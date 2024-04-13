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
import Checkbox from "@/components/ui/Checkbox.vue";
import IconPackage from "@/components/icons/IconPackage.vue";

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
    Checkbox,
    IconPackage,
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
      add_pressed: false,
      sub_pressed: false,
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
      if (payload.product_count > 0 && payload.product_count < 1000) {
        this.setProductCount(payload);
      }
    },
    addPressed(item) {
      this.addToCart(item);
      this.add_pressed = true;
      setTimeout(() => {
        if (this.add_pressed) {
          this.add_interval = setInterval(() => {
            this.add_pressed = false;
            this.addToCart(item);
          }, 100);
        }
      }, 600);
    },
    addReleased() {
      this.add_pressed = false;
      clearInterval(this.add_interval);
    },
    subPressed(payload) {
      this.removeFromCart(payload);
      this.sub_pressed = true;
      setTimeout(() => {
        if (this.sub_pressed) {
          this.sub_interval = setInterval(() => {
            this.sub_pressed = false;
            this.removeFromCart(payload);
          }, 100);
        }
      }, 600);
    },
    subReleased() {
      this.sub_pressed = false;
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
          <div class="cart-item-left flex-row col-12 col-md-7">
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
                  {{ getCategoryName(item.category_id)
                  }}<br class="d-block d-sm-none" /><span
                    class="d-none d-sm-inline"
                  >
                    /</span
                  >
                  {{ getSubcategoryName(item.subcategory_id) }}
                  <br />
                  <div class="catalog-product-attribute">
                    <div class="text-secondary">В упаковке:</div>
                    <div class="catalog-product-attribute__value">
                      {{ item.count ? item.count + " шт." : "Не указано" }}
                    </div>
                  </div>
                </div>
                <div class="cart-item-price mt-3 fs-4 d-block d-md-none">
                  {{
                    (
                      getCartProductCount(item.id) *
                      item.price *
                      (item.package ? item.count : 1)
                    ).toFixed()
                  }}
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
                    v-if="count_enter !== item.id"
                    class="cart-item-count"
                  >
                    {{ getCartProductCount(item.id) }}
                  </div>
                  <input
                    min="0"
                    maxlength="3"
                    v-else
                    @change="
                      countChanged({
                        id: item.id,
                        product_count: $event.target.value,
                      })
                    "
                    :value="getCartProductCount(item.id)"
                    type="text"
                    class="cart-item-count-inp"
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
                <Checkbox v-if="item.count" class="flex-row-reverse" v-model="item.package"
                  ><IconPackage color="#ff7b47" /></Checkbox
                >
              </div>
            </div>
          </div>
          <div class="cart-item-right d-none d-md-flex col-5">
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
                @click="countClicked(item.id)"
                v-if="count_enter !== item.id"
                class="cart-item-count"
              >
                {{ getCartProductCount(item.id) }}
              </div>
              <input
                min="0"
                maxlength="3"
                v-else
                @change="
                  countChanged({
                    id: item.id,
                    product_count: $event.target.value,
                  })
                "
                :value="getCartProductCount(item.id)"
                type="text"
                class="cart-item-count-inp"
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
              {{
                (
                  getCartProductCount(item.id) *
                  item.price *
                  (item.package ? item.count : 1)
                ).toFixed()
              }}
              ₽
            </div>
            <Checkbox v-if="item.count" v-model="item.package"
              >Упаковки</Checkbox
            >
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
        <RouterLink to="/" class="outline-secondary button big-btn">
          Вернуться назад
        </RouterLink>
        <OrangeBtn
          data-bs-toggle="modal"
          data-bs-target="#orderModal"
          class="col-auto px-5 button big-btn"
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
  justify-content: end;
  align-items: center;
  gap: 30px;
}
.cart-item-image {
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
.cart-item-count-inp {
  font-size: 18px;
  font-weight: 700;
  outline: 0;
  background: none;
  border-radius: 3px !important;
  width: 40px;
  border: 1px solid #fe5f1e;
  text-align: center;
}
.cart-item-price {
  font-size: 20px;
  font-weight: 700;
  color: $default-text-color;
  text-align: center;
  white-space: nowrap;
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
  scrollbar-width: 1px;
  scrollbar-color: $default-bg-color;
}

.cart-item-left {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 20px;
}
.cart-item-mob-btns {
  width: auto;
  gap: 4rem;
}
.cart-header {
  padding-bottom: 30px;
}
@media (max-width: 768px) {
  .cart-item-image {
    width: 120px;
    height: 150px;
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
    align-items: flex-start;
    min-height: 170px;
  }
}
.cart-bottom-btns {
  & > .button {
    width: auto;
  }
}
@media (max-width: 575.9px) {
  .cart-bottom-btns {
    & > .button {
      width: 100%;
    }
  }
  .cart-item-mob-btns {
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    width: 100%;
    margin-top: 5px;
  }
}
</style>
