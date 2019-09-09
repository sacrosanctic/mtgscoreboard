import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import energyIcon from '@/components/energyIcon.vue'

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'mdi',
  icons: {
    energy: {
      component: energyIcon
    }
  },
});
