<template>
  <v-container v-if="!loading">
    <v-row>
      <v-col 
        cols="12" 
        sm="6" 
        lg="3" 
        xl="2" 
        v-for="(player, i) in players" 
        :key="i"
      >
        <v-card>
          <v-card-title>{{player.name}} {{ counters[player.id][0] }} {{counters[player.id][1]}}</v-card-title>
          <v-row no-gutters>
            <v-col cols="4" class="ma-auto">
              <card :carduri="player.cardURI"></card>
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
  computed: mapState([
    'players', 'counterList', 'counters', 'cmdrDmgs', 'loading', 
  ]),
  // computed: {
  // },
  components: {
    card
  }
};
</script>
