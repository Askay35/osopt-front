<template>
  <div class="orange-outline-btn">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.orange-outline-btn {
  user-select: none;
  padding: 8px 18px;
  font-weight: bolder;
  color: $default-bg-color;
  border: 1px solid $default-bg-color;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
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
