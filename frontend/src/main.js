import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'
import i18n from './plugins/i18n.js'
import { useSettingsStore } from './stores/settings.js'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// App mount bo'lishidan oldin settings yuklansin
const settingsStore = useSettingsStore()
settingsStore.fetchSettings()

app.mount('#app')
