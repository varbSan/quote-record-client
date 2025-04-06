import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { clerk } from '@/main'

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    await clerk.load()
    if (clerk.isSignedIn) {
      next()
    }
    else {
      next({ name: 'signin' })
    }
  } catch (err) {
    console.error(err)
    next(false)
  }
}
