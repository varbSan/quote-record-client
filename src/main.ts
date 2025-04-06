import { Clerk } from '@clerk/clerk-js'
import { clerkPlugin } from '@clerk/vue'
import ui from '@nuxt/ui/vue-plugin'
import { createApp, h } from 'vue'
import { registerApollo } from './api/apollo'
import App from './App.vue'
import router from './router'
import './assets/main.css'

export const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

const app = createApp({
  render: () => h(App),
})

app.use(clerkPlugin, { publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY })
app.use(router)
app.use(ui)

registerApollo(app);

(async () => {
  app.mount('#app')
})()

