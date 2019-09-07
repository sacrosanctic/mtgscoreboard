<template>
  <v-container>
    <v-row>
      <v-col 
        cols="12" 
        sm="6" 
        lg="3" 
        xl="2"
        v-for="(player, i) in players"
        :key="i"
      >
        <v-card
        >
          <v-card-title>{{player.name}}</v-card-title>
            <v-row no-gutters="">
              <v-col cols="4">
              <card :carduri="player.cardURI"></card>
              </v-col>
              <v-col cols="8">
          <v-card-text>
            <v-list>
              <v-list-item 
                v-for="(counter, j) in counters[player.id]" 
                :key="counterList[j]"
              >
                <v-list-item-content>{{counterList[j]}}: {{counter}}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
                
              </v-col>
            </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import card from '@/components/card.vue'

export default {

  data: () => ({
  }),
  computed: {
    counterList() {
      return this.$store.state.counterList
    },
    counters() {
      return this.$store.state.counters
    },
    cmdrDmgs() {
      return this.$store.state.cmdrDmgs
    },
    players() {
      return this.$store.state.players
    },
  },
  components: {
    card
  }
}
</script>
