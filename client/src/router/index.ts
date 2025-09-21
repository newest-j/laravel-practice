import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/SignupVIew.vue'
import OAuthCallback from '@/views/OAuthCallback.vue'
// import { userAuthStore } from '@/stores/UserStore'
import { registerAuthGuards } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signup',
      component: HomeView,
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },

    {
      //this part is from the backend socialauth where the oauth/callbackis appended to the spa
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: OAuthCallback,
      meta: { guestOnly: true },
    },
  ],
})

// let authChecked = false

// router.beforeEach(async (to) => {
//   const store = userAuthStore()

//   if (!authChecked) {
//     await store.fetchCurrentUser()
//     authChecked = true
//   }

//   if (to.meta.requiresAuth && !store.isAuthenticated) {
//     return { name: 'login' }
//   }

//   if (to.meta.guestOnly && store.isAuthenticated) {
//     return { name: 'dashboard' }
//   }
// })
registerAuthGuards(router)
export default router
