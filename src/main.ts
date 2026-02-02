import * as Sentry from '@sentry/vue'
import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

const app = createApp(App)

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  environment: import.meta.env.MODE
})

app.mount('#app')
