import Vue from 'vue'
import Router from 'vue-router'
import scoreboard from './views/scoreboard.vue'
import tracker from './views/tracker.vue'
import settings from './views/settings.vue'
import practice from './views/practice.vue'

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
      path: '/scoreboard/:id',
      name: 'scoreboard-specific',
      component: scoreboard,
      props: true,
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: tracker
    },
    {
      path: '/settings',
      name: 'settings',
      component: settings
    },
    {
      path: '/practice',
      name: 'practice',
      component: practice
    },
  ],
  mode: 'history'
})
