import { Clerk } from '@clerk/clerk-js'

const auth = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

export async function initAuth() {
  await auth.load()
  return auth
}

export { auth }
