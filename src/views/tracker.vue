<template>
  <v-container v-if="!loading">
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
        xl="2"
      >
        <v-select
          label="Current Player"
          :items="players"
          item-text="name"
          item-value="id"
          @change="setCurrentPlayer"
          >
        </v-select>
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
          <v-card-title
            v-show="!commander.edit"
            @click="toggleEdit(commander)"
          >{{ players[currentPlayerId].cardName }}
          </v-card-title>
          <v-card-text
            v-show="commander.edit"
          >
          <v-text-field
            ref="commander"
            hint="Commander"
            :value="players[currentPlayerId].cardName"
            v-model="commander.val"
            @focus="$event.target.select()"
            @blur="saveEdit(commander)"
            @keydown.enter="saveEdit(commander)"
          >
          </v-text-field>
          </v-card-text>
          <v-card-text
            v-show="!player.edit"
            @click="togglePlayer(player)"
          >{{ players[currentPlayerId].name }}
          </v-card-text>
          <v-card-text
            v-show="player.edit"
          >
          <v-text-field
            ref="player"
            hint="Player Name"
            :value="players[currentPlayerId].name"
            v-model="player.val"
            @focus="$event.target.select()"
            @blur="savePlayer(player)"
            @keydown.enter="savePlayer(player)"
          >
          </v-text-field>
          </v-card-text>
          <v-list dense>
            <v-list-item-group class="primary--text" v-model="listValue">
              <v-list-item
                v-for="(counter, i) in counters[currentPlayerId]"
                :key="i"
                @click="setCurrentCounter(i)"
                :value="'counter-'+i"
              >
                <v-list-item-content>
                  <v-list-item-title>
                  {{counterList[i]}}  {{counter}}
                  </v-list-item-title>
                </v-list-item-content>
                <!-- <card :carduri="players[currentPlayerId].cardURI"></card> -->
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-card-actions>
                <v-btn @click="setValue(-5)">-5</v-btn>
                <v-btn @click="setValue(-1)">-1</v-btn>
                <v-btn @click="setValue(+1)">+1</v-btn>
                <v-btn @click="setValue(+5)">+5</v-btn>
          </v-card-actions>
          <v-list dense>
            <v-list-item-group class="primary--text" v-model="listValue">
              <v-container>
                <v-row>
                  <v-col cols="6"
                    v-for="player in players"
                    :key="player.id"
                  >
                    <v-list-item
                      :value="'player-'+player.id"
                    >
                      <v-list-item-title>
                        {{player.name}} {{cmdrDmgs[currentPlayerId][player.id]}}
                      </v-list-item-title>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <!-- <v-col
        cols="12"
        sm="6"
        lg="3"
        xl="2"
      >
        <v-card>
          <p>
            advanced
          </p>
          <v-btn>ping all</v-btn>
          <v-btn>drain all</v-btn>
          <v-btn>drain one</v-btn>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
// import card from '@/components/card.vue'
import { mapState } from 'vuex'

export default {
  data: () => ({
    currentPlayerId: 0,
    currentCounter: 0,
    listValue: null,
    test: {},
    player: {
      val: '',
      edit: false,
    },
    commander: {
      val: '',
      edit: false,
    },
  }),
  methods: {
    togglePlayer(value) {
      value.edit = !value.edit
      this.player.val = this.players[this.currentPlayerId].name
      if(value.edit) {
        this.$nextTick(()=>{
          this.$refs.player.focus()
        })
      }
    },
    savePlayer(value) {
      value.edit = false
      const obj = {
        value: this.player.val,
        playerId: this.currentPlayerId,
      }
      this.$store.dispatch('setPlayer', obj)
    },
    toggleEdit(value) {
      value.edit = !value.edit
      if(value.edit) {
          this.commander.val = this.players[this.currentPlayerId].cardName
        this.$nextTick(()=>{
          this.$refs.commander.focus()
        })
      }
    },
    saveEdit(value) {
      value.edit = false
      const obj = {
        value: this.commander.val,
        playerId: this.currentPlayerId,
      }
      this.$store.dispatch('setCommander', obj)
    },
    setCurrentPlayer(id) {
      this.currentPlayerId = id
    },
    setCurrentCounter(counter) {
      this.currentCounter = counter
    },
    setValue(amount) {
      if(this.listValue == null) return false
      var split = this.listValue.split('-')

      const obj = {
        player : this.currentPlayerId,
        type: split[1],
        amount: amount
      }

      if(split[0]=='player') {
        this.$store.dispatch('setCmdrDmg', obj)
      } else if(split[0]=='counter') {
        this.$store.dispatch('setCounter', obj)
      }
    },
  },
  computed: {
    ...mapState([
      'players', 'counterList', 'counters', 'cmdrDmgs', 'loading'
    ]),
  },
  components: {
    // card
  },
  mounted () {
  },
};
</script>