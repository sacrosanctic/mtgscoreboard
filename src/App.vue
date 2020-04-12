<template>
  <v-app>
    <v-navigation-drawer
      app
      disable-resize-watcher
      v-model="drawer"
    >
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase d-none d-sm-flex" style="padding-right:5px">
        <span>MTG</span>
        <span class="font-weight-light">Scoreboard</span>
      </v-toolbar-title>

      <v-autocomplete
        @input="findCardImg"
        name="searchbar"
        v-model="cardName"
        auto-select-first
        :search-input.sync="searchCard"
        :items="entries"
        class="ax-4 primary--text d-none d-sm-flex"
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
        <!-- <v-btn class="primary--text" text to="/practice">practice</v-btn> -->
        <v-btn class="primary--text" text @click.stop="showQR()">{{settings.scoreboardId}}</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid pa-0>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <div class="text-center">
      <v-dialog
        v-model="qrDialog"
        width="500"
        :fullscreen="$vuetify.breakpoint.xsOnly"
      >
        <v-card>
          <!-- <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            QR CODE
            <div class="flex-grow-1"></div>
          </v-card-title> -->
          <v-img
            height="100%"
            :src="qrCode"
          ></v-img>
          <a :href="inviteURL">{{inviteURL}}</a>
          <v-text-field
            label="invite code"
            single-line
            dense
            filled
            autofocus
            v-model="inviteInput"
            :disabled="inviteCodeDisable"
            ref="qrDialog"
          ></v-text-field>
          <div style="text-align:center">
          <v-btn
            class="primary hidden-sm-and-up"
            @click="qrDialog=false"
          >
            Close
          </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog
      v-model="cardDialog"
      width="unset"
      fullscreen
      @keydown.space="cardDialog=false"
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
    inviteCodeDisable: false,
  }),
  computed: {
    inviteURL() {
      return 'https://'+window.location.hostname + '/mtgscoreboard/scoreboard/' + this.settings.scoreboardId
    },
    qrCode() {
      //generate invite code for current scoreboard
      return 'https://api.qrserver.com/v1/create-qr-code/?margin=0&size=500x500&data='+
        encodeURI(window.location.hostname + '/mtgscoreboard/scoreboard/') +
        this.settings.scoreboardId
    },
    ...mapState([
      'settings',
    ])
  },
  mounted () {
    this.loadScoreboard()

    //listen for escape key and space key to exit dialog
    //should be refactored
    window.addEventListener('keydown', e => {
      if(e.key == 'Escape') {
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
    //load scoreboard if invite code is used
    inviteInput(val) {
      if(val.length < 7) return
      this.inviteCodeDisable = true
      this.loadScoreboard()
    },
    searchCard(val) {
      this.find(val)
    }
  },
  methods: {
    showQR() {
      this.qrDialog=true
      this.$nextTick(()=> {
        this.$refs.qrDialog.focus()
      })
    },
    loadScoreboard() {
      let scoreboardId = null
      if(this.inviteCodeDisable == true) {
        //load from invite code
        scoreboardId = this.inviteInput.toUpperCase()
        this.inviteCodeDisable = false
        this.inviteInput = ''
        this.qrDialog = false
      } else if(this.$route.params.id != null) {
        //load from qr code
        scoreboardId = this.$route.params.id.toUpperCase()
      } else if(localStorage.getItem('scoreboardId') != null) {
        //load from local storage
        scoreboardId = localStorage.getItem('scoreboardId')
      } else {
        //new scoreboard
        scoreboardId = null
      }
      if(scoreboardId == null) {
        //new scoreboard
        let id = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',7)
        this.$store.dispatch('createBoard',id)
        localStorage.setItem('scoreboardId',id)
        this.scoreboardId = id
      }
      else {
        //load scoreboard
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
      //list of cards for autocomplete
      this.$axios.get('https://api.scryfall.com/cards/autocomplete?q='+ val)
        .then(response => {
          this.entries = response.data.data
        })
    },500),
    findCardImg() {
      this.$axios.get('https://api.scryfall.com/cards/named?exact=' + this.cardName)
        .then(response => {
          this.cardImg = response.data.image_uris.large
          this.cardDialog = true
        })
    }
  },
}
</script>