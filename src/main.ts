import { clerkPlugin } from '@clerk/vue'
import ui from '@nuxt/ui/vue-plugin'
import { createApp, h } from 'vue'
import { registerApollo } from './api/apollo'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp({
  render: () => h(App),
})

app.use(ui)
app.use(router)
app.use(clerkPlugin, { publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY });

(async () => {
  await registerApollo(app)
  app.mount('#app')
})()
