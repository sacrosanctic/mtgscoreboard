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
                  <v-btn @click="setCurrentPlayer(player.id)" v-text="player.name"></v-btn>
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
          <v-list dense>
            <v-list-item-group color="red" v-model="listValue">
              <v-list-item
                v-for="(counter, i) in players[currentPlayerId].counter"
                :key="i"
                @click="setCurrentCounter(i)"
                :value="'counter-'+i"
              >
                <v-list-item-content>
                  <v-list-item-title>
                  {{counterList[i]}}  {{players[currentPlayerId].counter[i]}}
                  </v-list-item-title>
                </v-list-item-content>
                <!-- <card :carduri="players[currentPlayerId].cardURI"></card> -->
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-card-actions>
                <!-- <v-btn @click="setCounter(currentPlayerId,currentCounter,-5)">-5</v-btn>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,-1)">-1</v-btn>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,+1)">+1</v-btn>
                <v-btn @click="setCounter(currentPlayerId,currentCounter,+5)">+5</v-btn> -->
                <v-btn @click="setValue(-5)">-5</v-btn>
                <v-btn @click="setValue(-1)">-1</v-btn>
                <v-btn @click="setValue(+1)">+1</v-btn>
                <v-btn @click="setValue(+5)">+5</v-btn>
          </v-card-actions>
          <v-list dense>
            <v-list-item-group color="red" v-model="listValue">
              <v-list-item 
                v-for="player in players"
                :key="player.id"
                :value="'player-'+player.id"
              >
                <v-list-item-title>
                  {{player.name}} {{cmdrDmg[currentPlayerId][player.id]}}
                </v-list-item-title>
              </v-list-item>
            </v-list-item-group>
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
    currentCounter: 0,
    listValue: null
  }),
  methods: {
    setCurrentPlayer(id) {
      this.currentPlayerId = id
    },
    setCurrentCounter(counter) {
      this.currentCounter = counter
    },
    setCmdrDmg(attacker, defender, amount) {
      const obj = {
        attacker: attacker,
        defender: defender,
        amount: amount
      }
      this.$store.dispatch('setCmdrDmg', obj)
    },
    setCounter(player, counter, amount) {
      const obj = {
        player: player,
        counter: counter,
        amount: amount
      }
      this.$store.dispatch('setCounter', obj)
    },
    addPlayer() {
      this.$store.dispatch('addPlayer')
    },
    removePlayer() {
      this.$store.dispatch('removePlayer')
    },
    setValue(amount) {
      if(this.listValue == null) return false
      var split = this.listValue.split('-')
      if(split[0]=='player') {
        this.setCmdrdmg(split[1],this.currentPlayerId,amount)
      }else if(split[0]=='counter') {
        this.setCounter(this.currentPlayerId,split[1],amount)
      }
    },
  },
  computed: {
    players() {
      return this.$store.state.players
    },
    counterList() {
      return this.$store.state.counterList
    },
    cmdrDmg() {
      return this.$store.state.cmdrDmg
    }
  },
  components: {
    // card
  }
};
</script>