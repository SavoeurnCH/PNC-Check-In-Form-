import { createRouter, createWebHashHistory } from 'vue-router'

import { useCheckInStore } from '@/stores/checkin.store'

const routes = [
  {
    path: '/',
    redirect: { name: 'checkin' },
  },
  {
    path: '/checkin',
    name: 'checkin',
    component: () => import('@/pages/CheckInPage.vue'),
  },
  {
    path: '/checkin/success',
    name: 'checkin-success',
    component: () => import('@/pages/CheckInSuccessPage.vue'),

    beforeEnter: () => {
      const checkin = useCheckInStore()

      if (!checkin.isSubmitted) {
        return { name: 'checkin' }
      }

      return true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router