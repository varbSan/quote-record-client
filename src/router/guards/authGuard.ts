import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { auth } from '@/api/auth'

export function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    if (auth.isSignedIn || to.meta.isPublic) {
      next()
    }
  }
  catch (err) {
    console.error(err)
    next(false)
  }
}
