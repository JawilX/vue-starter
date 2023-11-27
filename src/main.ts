import App from './App.vue'
import { setupRouter } from './router'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/main.css'

async function setupApp() {
  const app = createApp(App)
  app.use(createPinia())
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
