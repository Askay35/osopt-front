<template>
  <div class="button orange-btn">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.orange-btn{
  color:#fff;
  background:$orange-color;
  border: 0;
  &:hover {
    background: $orange-hover-color;
  }
}
</style>
