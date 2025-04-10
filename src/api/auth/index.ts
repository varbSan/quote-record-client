import { Clerk } from '@clerk/clerk-js'

export const auth = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
