<script>
export default {
  props: {
    color: {
      default: "black",
    },
  },
};
</script>

<template>
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="18" :stroke="color" stroke-width="4" />
    <path
      d="M45.7279 48.5563C46.509 49.3374 47.7753 49.3374 48.5563 48.5563C49.3374 47.7753 49.3374 46.509 48.5563 45.7279L45.7279 48.5563ZM31.5858 34.4142L45.7279 48.5563L48.5563 45.7279L34.4142 31.5858L31.5858 34.4142Z"
      :fill="color"
    />
  </svg>
</template>
