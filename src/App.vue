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
      <v-autocomplete @input="cardLookUp"
        name="searchbar"
        v-model="currentCard"
        auto-select-first
        :items="items"
        :search-input.sync="search"
        class="ax-4 primary--text"
        flat
        hide-details
        filled
        label="Card Name"
        solo
        hide-no-data
        ref="autocomplete"
      ></v-autocomplete>
<!-- 
        :loading="loading2"
        v-model="select"
        cache-items


 -->

      <v-toolbar-items>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on }">
            <v-btn 
              v-on="on"
              class="primary--text"
              text
            >
              Reset
            </v-btn>
          </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in resetBtn"
            :key="index"
            @click="reset(item.type)"
          >
            <v-list-item-title class="primary--text">{{ item.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
        </v-menu>
        <v-btn class="primary--text" text @click.stop="dialogQR=true">Invite</v-btn>
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
      v-model="dialogQR"
      width="500"
    >
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
      <v-dialog
        v-model="dialog"
        width="unset"
        fullscreen
        @keydown.space="dialog = false"
        ref="dialog"
      >
        <v-card dark>
          <v-img
            contain
            height="100vh"
            :src="currentCardImg"
          ></v-img>
        </v-card>
      </v-dialog>
    </v-content>
    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
import _ from 'lodash'

export default {
  name: "App",
  data: () => ({
    drawer: false,
    dialog: false,
    entries: [],
    loading2: false,
    search: null,
    currentCard: null,
    currentCardImg: null,
    dialogQR: false,
    resetBtn: [
      { 
        value: 'Life',
        type: 'life',
      },
      { 
        value: 'All',
        type: 'all',
      },
    ],
  }),
  computed: {
    items () {
      return this.entries
    }
  },
  mounted () {
    window.addEventListener('keydown', e => {
      if(e.key == 'Escape' || e.key == ' ') {
        this.dialog = false;
      }
    }),
    window.addEventListener('keydown', e => {
      if(e.ctrlKey && e.key == ' ') {
        this.$refs.autocomplete.focus()
        this.currentCard = ''
      }
    })
  },
  watch: {
    search (val) {
      this.find(val)
    }
  },
  methods: {
    find: _.debounce(function(val) {
      this.loading2 = true
      this.$axios.get('https://api.scryfall.com/cards/autocomplete?q='+ val)
        .then(response => {
          this.entries = response.data.data
        })
        .finally(() => {
          this.loading2 = false
        })
    },500),
    reset(val) {
      if(val == 'all') this.$store.dispatch('reset')
      else if (val == 'life') this.$store.dispatch('resetLife')
    },
    cardLookUp() {
      this.$axios.get('https://api.scryfall.com/cards/named?exact=' + this.currentCard)
        .then(response => {
          this.currentCardImg = response.data.image_uris.large
          this.dialog = true
        })
    }
  },
  components: {
  }
};
</script>