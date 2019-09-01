import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import * as firebase from 'firebase'

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.VUE_APP_FIREBASE_DATABASEURL,
      projectId: process.env.VUE_APP_FIREBASE_PROJECTID,
      storageBucket: process.env.VUE_APP_FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID,
      appId: process.env.VUE_APP_FIREBASE_APPID      
    })
    firebase.database().ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep')
      .on('value', function(snapshot) {
        store.replaceState(snapshot.val())
      })
  }
}).$mount('#app')
