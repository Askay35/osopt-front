import { createRouter, createWebHistory } from 'vue-router'
import DefaultView from '../views/DefaultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultView,
      children:[
        {
          path: '',
          name: 'home',
          component: () => import("../pages/HomePage.vue")
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import("../pages/CartPage.vue")
        },
        {
          path: '/login',
          name: 'login',
          component: () => import("../pages/CartPage.vue")
        },
        {
          path: '/register',
          name: 'register',
          component: () => import("../pages/CartPage.vue")
        },
      ]
    },
  ]
})

export default router
