// frontend/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import toastPlugin from './plugins/toast'

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(toastPlugin)

app.mount('#app')
