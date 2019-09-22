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
              <!-- <div :is="test()"></div> -->
              <!-- <div :is="cmdrCastMod(player.manaCost,counters[player.id][1])"></div> -->
              <!-- {{cmdrCastMod(player.manaCost,counters[player.id][1])}} -->
              <!-- <component :is="{template:cmdrCastMod(player.manaCost,counters[player.id][1])}"/> -->
              {{cmdrCastMod(player.manaCost,counters[player.id][1])}}
              ({{counters[player.id][1]}})
            </div>
          </v-card-title>
          <v-card-text>
            {{player.name}}

          </v-card-text>

          <v-row no-gutters>
            <v-col cols="12" class="ma-auto">
              <div class="container">
              <card :cardName="player.cardName"></card>
              </div>
            </v-col>
            <v-col cols="12">
              <v-list dense>
                <v-container>
                <v-row no-gutters>
                  <v-col cols="auto">
                <v-list-item>
                  <v-list-item-icon class="mr-2"><v-icon>mdi-alert-circle</v-icon></v-list-item-icon>
                  <v-list-item-content>: {{counters[player.id][2]}}</v-list-item-content>
                </v-list-item>
                  </v-col>
                  <v-col cols="auto">
                <v-list-item>
                  <v-list-item-icon class="mr-2"><mtg-icon>energy</mtg-icon></v-list-item-icon>
                  <!-- <v-list-item-icon class="mr-2"><v-icon>mdi-flash</v-icon></v-list-item-icon> -->
                  <v-list-item-content>: {{counters[player.id][3]}}</v-list-item-content>
                </v-list-item>
                  </v-col>
                  <v-col cols="auto">
                <v-list-item>
                  <v-list-item-icon class="mr-2"><mtg-icon>poison</mtg-icon></v-list-item-icon>
                  <v-list-item-content>: {{counters[player.id][4]}}</v-list-item-content>
                </v-list-item>
                  </v-col>
                </v-row>
                </v-container>
              </v-list>
            </v-col>
            <v-col>
              <v-list>
                <v-list-item v-for="(player2, k) in players" :key="k">
                  <v-list-item-content>{{player2.name + ": " + cmdrDmgs[player2.id][player.id]}}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <mtg-icon>energy</mtg-icon>
    <mtg-icon>poison</mtg-icon>
    <mtg-icon>W</mtg-icon>
    <mtg-icon>U</mtg-icon>
    <mtg-icon>B</mtg-icon>
    <mtg-icon>R</mtg-icon>
    <mtg-icon>G</mtg-icon>

  </v-container>
</template>

<script>
import card from '@/components/card.vue'
import mtgIcon from '@/assets/mtg_symbols/mtgIcon.vue'
import { mapState } from 'vuex'

export default {
  data: () => ({
  }),
    computed: {
      ...mapState([
      'players', 'counterList', 'counters', 'cmdrDmgs', 'loading', 
    ]),
  },
  watch: {
  },
  methods: {
    getArt(cardName) {
      var art = ''
      this.$axios.get("https://api.scryfall.com/cards/named?exact=" + encodeURI(cardName))
        .then(response=>{
          return response.data.image_uris.art_crop
        })
      return art
    },
    test() {
      return {
        template: '<mtg-icon>B</mtg-icon>'
      }
    },
    cmdrCastMod2(manaCost,cast) {
      let regex = /{[wubrgWUBRG]}/g
      if(manaCost.search(regex) >= 0) {
        return manaCost.replace(/{([wubrgWUBRG])}/g,function(match,p1) {
          return {template: "<mtg-icon>" + p1 + "</mtg-icon>"}
        })
      } else {
        if(cast==0) return manaCost
        return '{' + (cast * 2) + '}' + manaCost
      }
    },
    cmdrCastMod(manaCost,cast) {
      let regex = /{(\d+)}/g
      if(manaCost.search(regex) >= 0) {
        return manaCost.replace(/{(\d+)}/g,function(match,p1) {
          return '{' + (Number(p1) + cast * 2) + '}'
        })
      } else {
        if(cast==0) return manaCost
        return '{' + (cast * 2) + '}' + manaCost
      }
    },
  },
  components: {
    card,
    mtgIcon
  }
};
</script>