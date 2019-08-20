<template>
  <v-container>
    <v-row>
      <v-col cols="6"
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
  data() {
    return {
      p1cmdr: 0,
      players: [
        {
          name: "player1",
          counter: [
            { name: "life", value: 0 },
            { name: "poison", value: 0 },
            { name: "experience", value: 0 },
            { name: "commander", value: 0 }
          ]
        },
        {
          name: "player2",
          counter: [
            { name: "life", value: 1 },
            { name: "poison", value: 1 },
            { name: "experience", value: 1 },
            { name: "commander", value: 1 }
          ]
        }
      ]
    };
  },
  methods: {
    plusOne(player, i) {
      this.players[player].counter[i].value++;
    }
  }
};
</script>