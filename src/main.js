import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
// import { db } from '@/db.js'
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
    // db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep')
    //   .once('value', function(snapshot) {
    //     store.replaceState(snapshot.val())
    //   })
    this.$store.dispatch('init')
  }
}).$mount('#app')
