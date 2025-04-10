import { auth } from '@/api/auth'

export type StoreIsSignedIn = 'true' | 'false'

export const store = {
  setToken: (token: string) => {
    localStorage.setItem('auth-token', token)
  },

  getToken: () => {
    return localStorage.getItem('auth-token')
  },

  removeToken: () => {
    localStorage.removeItem('auth-token')
    return auth.signOut()
  },

  setIsSignedIn: (isSignedIn: StoreIsSignedIn) => {
    localStorage.setItem('is-signed-in', isSignedIn)
  },

  getIsSignedIn: () => {
    return localStorage.getItem('is-signed-in') as StoreIsSignedIn
  },
}
