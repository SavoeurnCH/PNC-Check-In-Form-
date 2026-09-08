import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { registerInterceptors } from './services/api/interceptors'
import { router } from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

registerInterceptors(router)

app.mount('#app')
