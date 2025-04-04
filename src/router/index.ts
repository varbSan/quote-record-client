import { createRouter, createWebHistory } from 'vue-router'
import PgHome from '../pages/PgHome/PgHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PgHome,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/PgAbout/PgAbout.vue'),
    },
  ],
})

export default router
