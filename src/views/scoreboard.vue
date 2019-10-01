<template>
  <v-container v-if="!loading">
    <v-row>
      <v-col
        cols="12"
        sm="3"
        lg="3"
        xl="2"
        v-for="(player, i) in players"
        :key="i"
      >
        <v-card>
          <v-card-title>
            <div style="font-size:2em">
              {{counters[player.id][0]}}
            </div>
            <v-spacer></v-spacer>
            <div style="font-size:.65em">
              <component :is="{template:'<div>'+cmdrCastMod(player.manaCost,counters[player.id][1])+'</div>'}"/>
            </div>
          </v-card-title>
          <v-card-text>{{player.name}}</v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div>
                <card :cardName="player.cardName">
                  <v-card-title
                    class="justify-end align-end fill-height"
                  >
                    {{counters[player.id][1]}}
                </v-card-title>
              </card>
              </div>
            </v-col>
            <v-col cols="12" v-if="settings.format=='commander'">
              <v-container style="padding:0 12px">
                <v-row>
                  <v-col>
                    <v-card outlined>
                      <mtg-icon>poison</mtg-icon>
                      {{counters[player.id][4]}}
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card outlined>
                      <mtg-icon>experience</mtg-icon>
                      {{counters[player.id][2]}}
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card outlined>
                      <mtg-icon>energy</mtg-icon>
                      {{counters[player.id][3]}}
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col v-if="settings.format=='commander'">
              <v-container>
                <v-row>
                  <v-col
                    v-for="(player2, k) in players"
                    :key="k"
                    cols="12"
                    sm="3"
                  >
                    <v-card
                      flat
                      style="text-align:center"
                      :class="cmdrDmgColour(cmdrDmgs[player2.id][player.id])"
                    >
                      <!-- :style="'background-color:'+cmdrDmgColour(cmdrDmgs[player2.id][player.id])" -->
                      {{zeroReplacement(cmdrDmgs[player2.id][player.id])}}
                    </v-card>
                    <!-- {{player2.name.substring(0,1)}} -->
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import card from '@/components/card.vue'

import mtgIcon from '@/components/mtg_symbols/mtgIcon.vue'
import Vue from 'vue'
Vue.component('mtg-icon',mtgIcon)

export default {
  data: () => ({
  }),
    computed: {
      ...mapState([
        'players', 'counterList', 'counters', 'cmdrDmgs', 'loading', 'settings',
    ]),
  },
  watch: {
  },
  methods: {
    cmdrDmgColour(dmg) {
      let colour = ''
      if(dmg <= 4) colour = ''
      if(dmg > 4) colour = 'yellow lighten-5'
      if(dmg > 6) colour = 'yellow lighten-4'
      if(dmg > 8) colour = 'yellow lighten-3'
      if(dmg > 10) colour = 'yellow lighten-2'
      if(dmg > 12) colour = 'amber lighten-4'
      if(dmg > 14) colour = 'amber lighten-3'
      if(dmg > 16) colour = 'amber lighten-2'
      if(dmg > 18) colour = 'red lighten-3'
      if(dmg > 19) colour = 'red lighten-2'
      if(dmg > 20) colour = 'red lighten-1'
      return colour
    },
    zeroReplacement(val) {
      if(val == 0) {
        return '-'
      }
      return val
    },
    getArt(cardName) {
      var art = ''
      this.$axios.get("https://api.scryfall.com/cards/named?exact=" + encodeURI(cardName))
        .then(response=>{
          return response.data.image_uris.art_crop
        })
      return art
    },
    cmdrCastMod(manaCost,cast) {
      let regex = /{(\d+)}/g
      if(manaCost.search(regex) >= 0) {
        manaCost = manaCost.replace(regex,function(match,p1) {
          if(Number(p1)+cast*2>0)
            return '{' + (Number(p1) + cast * 2) + '}'
          else
            return ''
        })
      } else if(cast>0) {
        manaCost = '{' + (cast * 2) + '}' + manaCost
      }
      let regex2 = /{([wubrgWUBRG1-9sScCxX](\/[wubrgWUBRGP])*)}/g
      if(manaCost.search(regex2) >= 0) {
        manaCost = manaCost.replace(regex2,function(match,p1) {
          return "<mtg-icon>" + p1 + "</mtg-icon>"
        })
      }
      return manaCost
    },
  },
  components: {
    card,
    mtgIcon
  }
};
</script>