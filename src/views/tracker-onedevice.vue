<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="addPlayer">add player</v-btn>
        <v-btn @click="removePlayer">remove player</v-btn>
        <v-row>
          <v-col cols="12" sm="4">
              <v-row>
                <v-col
                  v-for="player in players"
                  :key="player.id"
                  cols="6"
                >
                  <div @click="setCurrentPlayer(player.id)">
                    {{player.name}}
                  </div>
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
              <v-list-item-content>
              <v-list-item-title>
                life
                {{players[currentPlayerId].counter[0]}}
                
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-actions>
                <v-btn @click="setCounter(currentPlayerId,0,+5)">+5</v-btn>
                <v-btn @click="setCounter(currentPlayerId,0,1)">+1</v-btn>
                <v-btn @click="setCounter(currentPlayerId,0,-1)">-1</v-btn>
                <v-btn @click="setCounter(currentPlayerId,0,-5)">-5</v-btn>

          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    currentPlayerId: 0
  }),
  methods: {
    setCurrentPlayer(id) {
      this.currentPlayerId = id
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
    }
  }
};
</script>