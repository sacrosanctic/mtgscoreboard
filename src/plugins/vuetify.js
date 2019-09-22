import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import mtgEnergy from '@/assets/mtg_symbols/mtgEnergy.vue'
import mtgPoison from '@/assets/mtg_symbols/mtgPoison.vue'

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'mdi',
  icons: {
    values: {
      mtgPoison: {
        component: mtgPoison,
      },
      mtgEnergy: {
        component: mtgEnergy,
      },
    }
  },
});
