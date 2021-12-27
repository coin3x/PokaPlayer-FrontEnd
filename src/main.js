import { createApp } from 'vue'
import App from './App.vue'
import './index.sass'
import store from './store'
import router from './router'
createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
