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
      <v-toolbar-title class="headline text-uppercase" style="padding-right:5px">
        <span>MTG</span>
        <span class="font-weight-light">Scoreboard</span>
      </v-toolbar-title>

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
      <v-toolbar-items>
        <v-btn class="primary--text" text to="/">Scoreboard</v-btn>
        <v-btn class="primary--text" text to="/tracker">Tracker</v-btn>
        <v-btn class="primary--text" text to="/settings">Settings</v-btn>
        <v-btn class="primary--text" text @click.stop="dialogQR=true">{{scoreboardId}}</v-btn>
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
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            text
            @click="dialogQR = false"
          >
            Close
          </v-btn>
        </v-card-title>
          <!-- src=".\assets\qr-code1000.png" -->
        <v-img
          height="500px"
          :src="qrCode"
        ></v-img>
        <v-text-field
          label="invite code"
          single-line
          dense
          filled
          autofocus
          v-model="inviteInput"
        ></v-text-field>
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
import { mapState } from 'vuex'
var en = require("nanoid-good/locale/en")
var generate = require("nanoid-good/generate")(en)

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
    scoreboardId: null,
    inviteInput: '',
  }),
  computed: {
    qrCode() {
      return 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data='+
        encodeURI('http://scottwu.ca/mtgscoreboard/scoreboard/')+
        this.settings.scoreboardId
    },
    items () {
      return this.entries
    },
    ...mapState([
      'settings',
    ])
  },
  mounted () {
    if(this.$route.params.id != null) {
      this.loadScoreboard('qr')
      console.log('qr code')
    }else {
      this.loadScoreboard('localStorage')
    }

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
    inviteInput(val) {
      if(val.length < 7) return
      this.inviteCodeDisable = true
      this.loadScoreboard('inviteCode')
    },
    search(val) {
      this.find(val)
    }
  },
  methods: {
    loadScoreboard(method) {
      let scoreboardId = null

      if(method == 'inviteCode') {
        //load from invite code
        scoreboardId = this.inviteInput.toUpperCase()
        this.inviteCodeDisable = false
        this.inviteInput = ''
        this.dialogQR = false
      } else if(method == 'qr') {
        //load from qr code
        scoreboardId = this.$route.params.id.toUpperCase()
      } else if(method == 'localStorage') {
        //load from local storage
        scoreboardId = localStorage.getItem('scoreboardId')
      } else {
        scoreboardId = null
      }

      if(scoreboardId == null) {
        let id = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',7)
        this.$store.dispatch('createBoard',id)
        localStorage.setItem('scoreboardId',id)
        this.scoreboardId = id
      }
      else {
        this.$store.dispatch('loadBoard',scoreboardId)
          .then(()=> {
            localStorage.setItem('scoreboardId',scoreboardId)
            this.scoreboardId = scoreboardId
            if(this.$router.history.current.path != '/') this.$router.push('/')
          })
          .catch(()=>{
            // console.log('bad invite code')
          })
      }
    },
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