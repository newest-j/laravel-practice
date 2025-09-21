import type { Router } from 'vue-router'
import { userAuthStore } from '@/stores/UserStore'

let authChecked = false

export function registerAuthGuards(router: Router) {
  router.beforeEach(async (to) => {
    const store = userAuthStore()

    if (!authChecked) {
      await store.fetchCurrentUser()
      authChecked = true
    }

    // iif the user is not auth and trying to acccess a requireauth show the login
    if (to.meta.requiresAuth && !store.isAuthenticated) {
      return { name: 'login' }
    }

    // if the user is auth and trying to route to a guestonly show the dashboard
    if (to.meta.guestOnly && store.isAuthenticated) {
      return { name: 'dashboard' }
    }
  })
}
