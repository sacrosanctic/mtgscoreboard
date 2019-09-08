import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

import { rtdbPlugin } from 'vuefire'

Vue.use(rtdbPlugin)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    this.$store.dispatch('init')
  }
}).$mount('#app')
