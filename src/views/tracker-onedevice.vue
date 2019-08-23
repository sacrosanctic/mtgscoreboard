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
        <v-row>
          <v-col cols="4">
              <v-row
              >
                <v-col
              v-for="player in players"
              :key="player.id"
              cols="6"

                >
                <div>
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
        <v-card
        >
        <v-card-title>scott</v-card-title>
        <v-list>

          <v-list-item>
            <v-list-item-content>
              life
            </v-list-item-content>
          </v-list-item>
        </v-list>
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