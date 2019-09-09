<template>
  <v-app>
    <v-navigation-drawer
      app
      disable-resize-watcher
      v-model="drawer"
    >
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>MTG</span>
        <span class="font-weight-light">Scoreboard</span>
      </v-toolbar-title>


      <v-toolbar-items>
        <v-btn class="primary--text" text to="/">Scoreboard</v-btn>
        <v-btn class="primary--text" text to="/tracker">Tracker</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <v-autocomplete
        :items="items"
        :search-input.sync="search"
        class="ax-4"
        color="blue"
        flat
        hide-details
        label="Card Name"
        solo
        hide-no-data
        cache-items
        :loading="loading2"
      ></v-autocomplete>
<!-- 
        v-model="select"


 -->

      <v-toolbar-items>
        <v-btn class="primary--text" text @click="reset()">Reset</v-btn>
        <v-btn class="primary--text" text @click="dialog=true">Invite</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>

  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <!-- <v-btn
          color="red lighten-2"
          dark
          v-on="on"
        >
          Click Me
        </v-btn> -->
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          QR CODE
        </v-card-title>
        <v-img
         height="500px"
         src=".\assets\qr-code1000.png"
        ></v-img>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>


        </v-content>
    <v-footer app>
      <!-- -->
    </v-footer>

  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: false,
    dialog: false,
    entries: [],
    loading2: false,
    search: null,
  }),
  computed: {
    items () {
      return this.entries
    }
  },
  mounted () {
  },
  watch: {
    search (val) {
       // if(this.items.length > 0) return

      if (this.loading2) return

      this.loading2 = true

      this.$axios.get('https://api.scryfall.com/cards/autocomplete?q='+ val)
        .then(response => {
          this.entries = response.data.data
        })
        .catch(err => {console.log(err)})
        .finally(() => (this.loading2 = false))

    }
  },
  methods: {
    reset() {
      this.$store.dispatch('reset')
    },
  },
};
</script>