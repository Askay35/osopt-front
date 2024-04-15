<template>
  <div class="button orange-outline-btn">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.orange-outline-btn {
  color: $orange-color;
  border: 1px solid $orange-color;
  cursor: pointer;
  &:hover{
    color:#fff;
    background: $orange-color;
    path{
        fill: #fff;
    }
  }
}
</style>
