<template>
  <div class="scroll-top-btn"
  onclick="window.scrollTo({left:0,top:0})"
  >
    <svg
      height="55"
      viewBox="0 0 33 33"
      width="55"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fill-rule="evenodd">
        <path d="m0 0h32v32h-32z" />
        <path
          d="m16 0c8.836556 0 16 7.163444 16 16s-7.163444 16-16 16-16-7.163444-16-16 7.163444-16 16-16zm.1306043 9.67330597h-.1612086c-.2359046.01386477-.4678334.11091814-.6480754.29116012l-5.65685421 5.65685421c-.39052429.3905243-.39052429 1.0236893 0 1.4142136.39052431.3905243 1.02368931.3905243 1.41421361 0l3.9647474-3.9642279-.0007864 9.428694c0 .5522847.4477152 1 1 1 .5522847 0 1-.4477153 1-1l.0007864-9.442694 3.9778932 3.9782279c.3905243.3905243 1.0236893.3905243 1.4142136 0s.3905243-1.0236893 0-1.4142136l-5.6568542-5.65685421c-.180242-.18024198-.4121708-.27729535-.6480754-.29116012z"
          fill="#FE5F1E"
        />
      </g>
    </svg>

    <div class="scroll-top-btn-fill"></div>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/variables.scss";

.scroll-top-btn {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1000;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  svg{
    z-index: 2;
    position: relative;
  }
  div{
    z-index: 1;
    position: absolute;
    left: 5%;
    top: 5%;
    width: 90%;
    height: 90%;
    background: $body-bg;
    border-radius: 100%;
  }
}
</style>
