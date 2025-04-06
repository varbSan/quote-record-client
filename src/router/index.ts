import VwUserAgreement from '@/pages/PgAbout/views/VwUserAgreement.vue'
import VwUserPrivacyNotice from '@/pages/PgAbout/views/VwUserPrivacyNotice.vue'
import { createRouter, createWebHistory, type RouteRecord, type RouteRecordRaw } from 'vue-router'
import PgHome from '../pages/PgHome/PgHome.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: PgHome,
    // beforeEnter: authGuard,
    meta: { label: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    redirect: '/about/user-agreement',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../pages/PgAbout/PgAbout.vue'),
    // beforeEnter: authGuard,
    meta: { label: 'About' },
    children: [
      {
        name: 'userAgreement',
        path: 'user-agreement',
        component: VwUserAgreement,
        meta: { label: 'User Agreement', icon: 'i-lucide-file-check' },
      },
      {
        name: 'userPrivacyNotice',
        path: 'user-privacy-notice',
        component: VwUserPrivacyNotice,
        meta: { label: 'User Privacy Notice', icon: 'i-lucide-book-open-text' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
