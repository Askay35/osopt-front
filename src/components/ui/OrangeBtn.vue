<template>
  <div class="button orange-btn">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.orange-btn{
  color:#fff;
  background:$default-bg-color;
  border: 0;
  &:hover {
    background: $default-hover-bg;
  }
}
</style>
