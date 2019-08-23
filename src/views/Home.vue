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
          <v-card-text>
            <v-list>
              <v-list-item v-for="(item, j) in player.counter" :key="item.name">
                <v-list-item-content>{{counterList[j]}}: {{item}}</v-list-item-content>
                <v-list-item-action>
                  <v-card-actions>
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
    counterList: [
      'life',
      'poison',
      'cmdr',
      'experience'
    ]
  }),
  computed: {
    players() {
      return this.$store.state.players
    }
  }
}
</script>
