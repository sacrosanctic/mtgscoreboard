<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="addPlayer">add player</v-btn>
        <v-btn @click="removePlayer">remove player</v-btn>
        <v-row>
          <v-col cols="12" sm="4">
              <v-row no-gutters>
                <v-col
                  v-for="player in players"
                  :key="player.id"
                  cols="6"
                >
                  <v-card @click="setCurrentPlayer(player.id)" outlined tile>
                    {{player.name}}
                  </v-card>
                </v-col>
              </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col 
        cols="12" 
        sm="6" 
        lg="3" 
        xl="2"
      >
        <v-card>
          <v-card-title> {{ players[currentPlayerId].name }}</v-card-title>
          <v-list>
            <v-list-item>
              <!-- <card :carduri="players[currentPlayerId].cardURI"></card> -->
              <v-card width="70"
                v-for="(counter, i) in players[currentPlayerId].counter"
                :key="i"
                @click="setCurrentCounter(i)"
                tile
              >
                {{counterList[i]}}  {{players[currentPlayerId].counter[i]}}
              </v-card>
            </v-list-item>
          </v-list>
          <v-card-actions>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,+5)">+5</v-btn>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,1)">+1</v-btn>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,-1)">-1</v-btn>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,-5)">-5</v-btn>
          </v-card-actions>
          <v-list>
            <v-list-item 
              v-for="player in players"
              :key="player.id"
            >
              <v-list-item-title>
                {{player.name}}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-card-actions>
                <v-btn>Cmdr Damage</v-btn>

          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import card from '@/components/card.vue'

export default {
  data: () => ({
    currentPlayerId: 0,
    currentCounter: 0
  }),
  methods: {
    setCurrentPlayer(id) {
      this.currentPlayerId = id
    },
    setCurrentCounter(counter) {
      this.currentCounter = counter
    },
    setCounter(player, counter, amount) {
      const obj = {
        player: player,
        counter: counter,
        amount: amount
      }
      return this.$store.dispatch('setCounter', obj)
    },
    addPlayer() {
      this.$store.dispatch('addPlayer')
    },
    removePlayer() {
      this.$store.dispatch('removePlayer')
    },
  },
  computed: {
    players() {
      return this.$store.state.players
    },
    counterList() {
      return this.$store.state.counterList
    }
  },
  components: {
    // card
  }
};
</script>