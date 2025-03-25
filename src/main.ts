import ui from '@nuxt/ui/vue-plugin'

import { createApp, h } from 'vue'
import { registerApollo } from './api/apollo'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp({
  render: () => h(App),
})

app.use(router)
app.use(ui)

registerApollo(app);

(async () => {
  app.mount('#app')
})()
