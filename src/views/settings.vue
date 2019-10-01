<template>
  <v-container>
    <v-btn @click="resetLife" class="red lighten-1" dark>New game</v-btn>
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
    }
  },
  computed: {
    ...mapState([
      'settings',
    ]),
  }

}
</script>