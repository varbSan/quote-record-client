import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { store } from '@/utils/store'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (store.getIsSignedIn() === 'true') {
    next(true)
  }
  else {
    next({ name: 'signin' })
  }
}
