<script>
  import Header from "@/components/Header.vue"
  import {RouterView} from "vue-router"

  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';
import { mapState } from 'vuex';

  export default {
    components:{Header, Loading, RouterView},
    computed: {
      ...mapState(['is_loading'])
    }
  }
</script>

<template>
  <Header></Header>
  <Loading v-model:active="is_loading" color="#FE5F1E" />
  <main class="lg:container px-6 xl:px-20 mx-auto">
    <RouterView />
  </main>
</template>
