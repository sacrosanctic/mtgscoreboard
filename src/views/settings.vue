<template>
  <v-container>
    <v-btn @click="resetLife" class="mx-2 red lighten-1" dark>New game</v-btn>
    <v-btn @click="$store.dispatch('reset')" class="mx-2 red lighten-1" dark>New board</v-btn>
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

export default {
  name: "Settings",
  data: () => ({
  }),
  methods: {
    resetLife() {
      this.$store.dispatch('resetLife')
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