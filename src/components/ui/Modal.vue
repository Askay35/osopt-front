<template>
  <div class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-content rounded-2xl px-5 py-6">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let modal_btns = document.querySelectorAll('*[data-toggle="modal"]');
    let modals = document.querySelectorAll(".modal");
    let modal_bg = document.createElement("div");
    modal_bg.id = "modal-bg";
    modal_bg.onclick = () => {
      for (const modal of modals) {
        modal.classList.remove("active");
        modal
          .getElementsByClassName("modal-content")[0]
          .classList.remove("active");
        modal_bg.classList.remove("active");
        document.body.removeChild(modal_bg);
        document.body.classList.remove("modal-open");
      }
    };
    for (const modal of modals) {
      modal.querySelector(".modal-close").onclick = () => {
        modal.classList.remove("active");
        modal
          .getElementsByClassName("modal-content")[0]
          .classList.remove("active");
        modal_bg.classList.remove("active");
        document.body.removeChild(modal_bg);
        document.body.classList.remove("modal-open");
      };
    }

    for (const btn of modal_btns) {
      btn.onclick = () => {
        let modal = document.querySelector(btn.dataset.modal);
        if (document.querySelectorAll("#modal-bg").length) {
          modal_bg.classList.remove("active");
          document.body.removeChild(modal_bg);
          document.body.classList.remove("modal-open");
        }
        document.body.appendChild(modal_bg);
        document.body.classList.add("modal-open");
        modal_bg.classList.add("active");
        modal.classList.add("active");
        modal
          .getElementsByClassName("modal-content")[0]
          .classList.add("active");
      };
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

#modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  background: #000000a9;
  z-index: 1001;
  &.active {
    opacity: 1;
  }
}
.modal {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  z-index: 1050;
  min-width: 500px;
  visibility: hidden;
  transition: opacity 0.2s ease top 0.15s ease;
  &.active {
    opacity: 1;
    visibility: visible;
    top: 25%;
  }

  .modal-content {
    background: #fff;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .modal {
    min-width: unset;
    width: calc(100% - 20px);
  }
}
</style>
