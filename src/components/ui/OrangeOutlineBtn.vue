<template>
  <div class="button orange-outline-btn">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.orange-outline-btn {
  color: $default-bg-color;
  border: 1px solid $default-bg-color;
  cursor: pointer;
  &:hover{
    color:#fff;
    background: $default-bg-color;
    path{
        fill: #fff;
    }
  }
}
</style>
