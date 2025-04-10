import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { auth } from '@/api/auth'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (auth.isSignedIn) {
    next(true)
  }
  else if (to.name === 'signin') {
    next({ name: 'signin' })
  }
  else {
    next(false)
  }
}
