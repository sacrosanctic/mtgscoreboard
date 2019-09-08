import Vue from 'vue'
import Router from 'vue-router'
import scoreboard from './views/scoreboard.vue'
import tracker from './views/tracker.vue'

Vue.use(Router)

export default new Router({
  base:
    process.env.NODE_ENV === 'production'
      ? '/mtgscoreboard/'
      : '/',
  
  routes: [
    {
      path: '/',
      name: 'scoreboard',
      component: scoreboard
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: tracker
    },
  ],
  mode: 'history'
})
