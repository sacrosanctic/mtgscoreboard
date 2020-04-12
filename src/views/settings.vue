<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-btn @click="resetLife" class="mx-2 red lighten-1" dark>New game</v-btn>
      </v-col>
      <v-col>
        <p>same friends, new game</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
    <v-btn @click="fullReset" class="mx-2 red lighten-1" dark>New board</v-btn>
      </v-col>
      <v-col>
        <p>remove all settings, new invite code</p>
      </v-col>
    </v-row>
    <!-- starting life {{format[settings.format].startingLife}} -->
    <v-btn class="mx-2" @click="addPlayer">add player</v-btn>
    <v-btn class="mx-2" @click="removePlayer">remove player</v-btn>
    <v-container>
      <p>Format</p>
      <v-radio-group v-model="settings.format" mandatory>
        <v-radio label="commander" value="commander"></v-radio>
        <v-radio label="brawl" value="brawl"></v-radio>
      </v-radio-group>
    </v-container>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
var en = require("nanoid-good/locale/en")
var generate = require("nanoid-good/generate")(en)


export default {
  name: "Settings",
  data: () => ({
  }),
  methods: {
    resetLife() {
      this.$store.dispatch('resetLife')
    },
    fullReset() {
      let id = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',7)
      this.$store.dispatch('createBoard',id)
      localStorage.setItem('scoreboardId',id)
      this.$router.push('/')
    },
    addPlayer() {
      this.$store.dispatch('addPlayer')
    },
    removePlayer() {
      this.$store.dispatch('removePlayer')
    },
  },
  computed: {
    ...mapState([
      'settings', 'format'
    ]),
  }

}
</script>