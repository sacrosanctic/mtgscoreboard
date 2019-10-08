<template>
  <v-app>
    <v-navigation-drawer
      app
      disable-resize-watcher
      v-model="drawer"
    >
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase" style="padding-right:5px">
        <span>MTG</span>
        <span class="font-weight-light">Scoreboard</span>
      </v-toolbar-title>

      <v-autocomplete
        @input="cardLookUp"
        name="searchbar"
        v-model="cardName"
        auto-select-first
        :search-input.sync="searchCard"
        :items="entries"
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
        <v-btn class="primary--text" text @click.stop="qrDialog=true">{{scoreboardId}}</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <div class="text-center">
      <v-dialog
        v-model="qrDialog"
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
              @click="qrDialog = false"
            >
              Close
            </v-btn>
          </v-card-title>
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
      v-model="cardDialog"
      width="unset"
      fullscreen
      @keydown.space="cardDialog = false"
      ref="dialog"
    >
      <v-card dark>
        <v-img
          contain
          height="100vh"
          :src="cardImg"
        ></v-img>
      </v-card>
    </v-dialog>
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
    entries: [],
    searchCard: null,
    cardName: null,
    cardImg: null,
    cardDialog: false,
    qrDialog: false,
    scoreboardId: null,
    inviteInput: '',
  }),
  computed: {
    qrCode() {
      //generate invite code for current scoreboard
      return 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data='+
        encodeURI(window.location.hostname + '/mtgscoreboard/scoreboard/') +
        this.settings.scoreboardId
    },
    ...mapState([
      'settings',
    ])
  },
  mounted () {
    if(this.$route.params.id != null) {
      this.loadScoreboard('qr')
    }else {
      this.loadScoreboard('localStorage')
    }

    window.addEventListener('keydown', e => {
      if(e.key == 'Escape' || e.key == ' ') {
        this.cardDialog = false;
      }
    }),
    window.addEventListener('keydown', e => {
      if(e.ctrlKey && e.key == ' ') {
        this.$refs.autocomplete.focus()
        this.cardName = ''
      }
    })
  },
  watch: {
    inviteInput(val) {
      if(val.length < 7) return
      this.inviteCodeDisable = true
      this.loadScoreboard('inviteCode')
    },
    searchCard(val) {
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
            if(this.$route.params.id != null) this.$router.push('/')
          })
          .catch(()=>{
            // console.log('bad invite code')
          })
      }
    },
    find: _.debounce(function(val) {
      this.$axios.get('https://api.scryfall.com/cards/autocomplete?q='+ val)
        .then(response => {
          this.entries = response.data.data
        })
    },500),
    cardLookUp() {
      this.$axios.get('https://api.scryfall.com/cards/named?exact=' + this.cardName)
        .then(response => {
          this.cardImg = response.data.image_uris.large
          this.cardDialog = true
        })
    }
  },
}
</script>