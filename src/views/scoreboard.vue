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
              {{cmdrCastMod(player.manaCost,counters[player.id][1])}}
              ({{counters[player.id][1]}})
            </div>
          </v-card-title>
          <v-card-text>
            {{player.name}}

          </v-card-text>

          <v-row no-gutters>
            <v-col cols="4" class="ma-auto">
              <card :cardname="player.cardName"></card>
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
                  <v-list-item-icon class="mr-2"><v-icon>mdi-flash</v-icon></v-list-item-icon>
                  <v-list-item-content>: {{counters[player.id][3]}}</v-list-item-content>
                </v-list-item>
                  </v-col>
                  <v-col cols="auto">
                <v-list-item>
                  <v-list-item-icon class="mr-2"><v-icon>mdi-emoticon-dead</v-icon></v-list-item-icon>
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
  </v-container>
</template>

<script>
import card from "@/components/card.vue";
import { mapState } from 'vuex'

export default {
  data: () => ({}),
    computed: {
      ...mapState([
      'players', 'counterList', 'counters', 'cmdrDmgs', 'loading', 
    ]),
  },
  methods: {
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
    cardLookUp() {
      // this.$axios.get('https://api.scryfall.com/cards/named?exact=' + this.currentCard)
      //   .then(response => {
      //     this.currentCardImg = response.data.image_uris.large
    }
  },
  components: {
    card
  }
};
</script>