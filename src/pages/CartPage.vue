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
import Modal from "@/components/ui/Modal.vue";

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
    Modal,
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
    ...mapActions(["createOrder", "loadCatalog","saveCart"]),
  },
};
</script>

<template>
  <div class="flex flex-col pb-10">
    <template v-if="cart.length > 0">
      <div class="flex flex-wrap flex justify-between cart-header">
        <div
          class="relative flex-grow max-w-full flex-1 px-4 flex items-center ps-0"
        >
          <IconCart color="#3F3F3F" width="25" height="25" />
          <div class="ms-2 text-xl font-bold">Корзина</div>
        </div>
        <div
          class="col-auto items-center pe-0 flex text-gray-600"
          @click="clearCart"
          role="button"
        >
          <IconBucket class="me-2" /> Очистить корзину
        </div>
      </div>
      <div class="cart-items flex flex-col">
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <div class="cart-item-left flex-row w-full md:w-3/5 pr-4">
            <img
              :src="$store.state.storage_url + item.image"
              class="cart-item-image"
            />
            <div
              class="w-full md:w-auto cart-item-info justify-content-space-between"
            >
              <div class="flex flex-col items-end md:items-start">
                <div class="cart-item-name">
                  {{ item.name }}
                </div>
                <div class="cart-item-desc mt-2 text-end md:text-start">
                  {{ getCategoryName(item.category_id)
                  }}<br class="block sm:hidden" /><span
                    class="hidden sm:inline"
                  >
                    /</span
                  >
                  {{ item.subcategory }}
                  <br />

                  <div class="catalog-product-attribute">
                    <div class="text-gray-600">В упаковке:</div>
                    <div class="catalog-product-attribute__value">
                      {{ item.count ? item.count + " шт." : "Не указано" }}
                    </div>
                  </div>
                </div>
                <div class="cart-item-price mt-3 block md:hidden">
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
              <div
                class="cart-item-right cart-item-mob-btns flex flex-col md:hidden"
              >
                <div
                  class="cart-item-btns justify-end md:justify-center order-3 md:order-0"
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
                <div class="flex justify-between w-full">
                  <div
                    @click="removeProductFromCart(item.id)"
                    :class="{ 'ms-auto': !item.count }"
                    class="outline-secondary cart-item-remove me-0 md:me-4 order-0 button circle-btn"
                  >
                    <icon-remove />
                  </div>
                  <Checkbox
                    v-if="item.count"
                    class="flex-row-reverse"
                    v-model="item.package"
                    @state-changed="saveCart"
                    ><IconPackage color="#ff7b47"
                  /></Checkbox>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-item-right hidden md:flex w-2/5">
            <div
              class="cart-item-btns justify-end md:justify-center order-3 md:order-0"
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
            <div class="cart-item-price order-2 md:order-0">
              {{
                (
                  getCartProductCount(item.id) *
                  item.price *
                  (item.package ? item.count : 1)
                ).toFixed()
              }}
              ₽
            </div>
            <Checkbox
              v-if="item.count"
              class="flex-row-reverse"
              v-model="item.package"
              @state-changed="saveCart"
              ><IconPackage color="#ff7b47"
            /></Checkbox>
            <div
              @click="removeProductFromCart(item.id)"
              class="outline-secondary cart-item-remove me-0 md:me-4 order-3 md:order-0 button circle-btn"
            >
              <icon-remove />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap mt-4 flex justify-between">
        <div
          class="relative flex-grow max-w-full flex-1 pr-4 flex items-center"
        >
          <div class="cart-bottom-info font-medium">
            Всего товаров:<br class="block sm:hidden" />&nbsp;<span
              class="text-xl font-bold"
              >{{ getCartCount }} шт.</span
            >
          </div>
        </div>
        <div class="col-auto items-center">
          <div class="cart-bottom-info font-medium">
            Сумма заказа:<br class="block sm:hidden" />&nbsp;
            <span class="text-orange float-end sm:float-none text-xl font-bold"
              >{{ getCartPrice }} ₽</span
            >
          </div>
        </div>
      </div>
      <div
        class="flex flex-wrap mt-5 mb-20 md:mb-0 flex cart-bottom-btns justify-between flex-col-reverse sm:flex-row gap-3 sm:gap-0"
      >
        <RouterLink to="/" class="outline-secondary button big-btn">
          Вернуться назад
        </RouterLink>
        <OrangeBtn
          data-toggle="modal"
          data-modal="#orderModal"
          class="col-auto px-5 button big-btn"
        >
          Заказать
        </OrangeBtn>
      </div>
    </template>
    <template v-else>
      <div class="m-auto cart-empty text-center mt-4">
        <div class="text-lg font-bold mb-2">Корзина пуста</div>
        <div class="text-gray-600 mb-5">
          Вероятнее всего, Вы ещё не добавили товары в корзину. <br />
          Для того, чтобы это сделать, перейдите на главную страницу.
        </div>
        <icon-shopping class="mb-10" />
        <RouterLink to="/" class="button dark-btn">Вернуться назад</RouterLink>
      </div>
    </template>

    <Modal id="orderModal"
      ><div>
        <div class="mb-3">
          <label for="phone">
            Телефон (или другой контакт):
          </label>
          <input
            type="text"
            v-model="order.phone"
            required
            class="form-input mt-2 w-3/4"
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
            class="form-input mt-2 w-3/4"
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
        ></VueSelect>
      </div>
      <OrangeBtn
        @click="createOrder"
        class="modal-close ms-auto mt-4 px-5"
        >Заказать</OrangeBtn
      ></Modal
    >
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";

.catalog-product-attribute {
  margin-top: 5px;
}
.cart-item-right {
  justify-content: end;
  align-items: center;
  gap: 30px;
}
.cart-item-image {
  object-fit: contain;
  min-width: 150px;
  border-radius: 10px;
  height: 150px;
  max-width: 150px;
}
.cart-item-name {
  font-weight: 700;
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
      background: $orange-color;
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
  // scrollbar-width: 1px;
  // scrollbar-color: $orange-color;
  // &::-webkit-scrollbar {
  //   background: #FE5F1E;
  // }
}

.cart-item-left {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 20px;
}
.cart-item-mob-btns {
  width: auto;
  gap: 1rem 4rem;
}
.cart-header {
  padding-bottom: 30px;
}
@media (max-width: 768px) {
  .cart-item-image {
    max-width: 130px;
    min-width: 130px;
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
  .cart-item-price {
    font-size: 18px;
  }
  .cart-item-name {
    text-align: right;
    font-size: 16px;
  }
  .cart-item-desc {
    font-size: 14px;
  }
}
.cart-bottom-btns {
  & > .button {
    width: auto;
  }
}
@media (max-width: 575.9px) {
  .cart-item-btns {
    justify-content: space-between;
    min-width: 120px;
  }
  .cart-bottom-btns {
    & > .button {
      width: 100%;
    }
  }
  .cart-item-mob-btns {
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    margin-top: 5px;
  }
}
</style>
