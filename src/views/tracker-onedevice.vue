<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="addPlayer">
          add player
        </v-btn>
        <v-btn @click="removePlayer">
          remove player
        </v-btn>

      </v-col>
    </v-row>
    <v-row>
      <v-col 
        cols="12" 
        sm="6" 
        lg="3" 
        xl="2"
      >
        <v-card
        >
          <v-card-title>{{player.name}}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    currentPlayer: []
  }),
  methods: {
    plusOne(player, i) {
      this.players[player].counter[i].value++
    },
    addPlayer() {
      this.$store.dispatch('addPlayer')
    },
    removePlayer() {

    }
  },
  computed: {
    players() {
      return this.$store.state.players
    },
    playerList() {
      return this.$store.getters.getPlayerList
    }
  }
};
</script>