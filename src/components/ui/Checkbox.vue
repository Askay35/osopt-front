<template>
  <div @click="changeState" class="checkbox-wrapper">
      <div  :class="{checked:checked}" class="checkbox">
        <div class="checkbox-circle"></div>
      </div>
      <div class="checkbox-circle-text prevent-select"><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue","stateChanged"],
  methods: {
    changeState(e) {
      this.checked = !this.checked;
      this.$emit("update:modelValue", this.checked);
      this.$emit("stateChanged");
    },
  },
  created(){
    this.checked = this.modelValue;
  },
  data() {
    return {
      checked: false,
    };
  },
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

.checkbox {
  border: 2px solid $secondary-border-color;
  border-radius: 50%;
  padding: 4px;
  width: 32px;
  height: 32px;
  justify-content: center;
  &.checked {
    .checkbox-circle {
      background: $orange-color !important;
    }
  }
}
.checkbox-circle {
  width: 100%;
  transition-duration: .1s;
  pointer-events: none;
  height: 100%;
  background: transparent;
  border-radius: 50%;
}
.checkbox-wrapper{
  display: flex;
  gap: 5px;
  cursor: pointer;
  align-items: center;
}
.checkbox-circle-text {
  font-weight: 500;
  pointer-events: none;
}
</style>
