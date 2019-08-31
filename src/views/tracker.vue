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
        v-for="(player, i) in players"
        :key="i"
      >
        <v-card
        >
          <v-card-title>{{player.name}}</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(item, j) in player.counter" :key="item.name">
                <v-list-item-content>{{item.name}}: {{item.value}}</v-list-item-content>
                <v-list-item-action>
                  <v-card-actions>
                    <v-btn @click="plusOne(i,j)">+1</v-btn>
                  </v-card-actions>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
  }),
  methods: {
    plusOne(player, i) {
      this.players[player].counter[i].value++
    },
    addPlayer() {
      this.$store.dispatch('addPlayer')
    }
  },
  computed: {
    players() {
      return this.$store.state.players
    }
  }
};
</script>