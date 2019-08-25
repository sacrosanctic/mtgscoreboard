import Vue from 'vue'
import Router from 'vue-router'
import scoreboard from './views/scoreboard.vue'
import tracker from './views/tracker.vue'
import maintracker from './views/tracker-onedevice.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: scoreboard
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: tracker
    },
    {
      path: '/maintracker',
      name: 'maintracker',
      component: maintracker
    }
  ],
  mode: 'history'
})
