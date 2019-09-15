<template>
  <v-container v-if="!loading">
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

          <v-card-title
            v-show="!commander.edit"
            @click="toggleEdit(commander)"
          >{{ players[currentPlayerId].cardName }}
          </v-card-title>
          <v-card-text>
          <v-text-field
            ref="commander"
            v-show="commander.edit"
            hint="Commander"
            :value="players[currentPlayerId].cardName"
            v-model="commander.val"
            @focus="$event.target.select()"
            @blur="saveEdit(commander)"

          >
<v-icon>mdi-pencil</v-icon>
          </v-text-field>
          </v-card-text>


          <v-hover
            v-slot:default="{ hover }"
          >
            <v-card-text > {{ players[currentPlayerId].name }}
            <v-text-field
              hint="Player"
              :value="players[currentPlayerId].name"
            ></v-text-field>
          <v-icon v-if="hover" size="16" @click="edit('name')">mdi-pencil</v-icon>
            </v-card-text>
          </v-hover>

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
         size="1"          <v-col cols="6"
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
    commander: {
      val: '',
      edit: false
    },
  }),
  methods: {
    toggleEdit(value) {
      value.edit = !value.edit
      if(value.edit) {
        this.$nextTick(()=>{
          this.$refs.commander.focus()
        })
      }
    },
    saveEdit(value) {
      this.toggleEdit(value)

      const obj = {
        value: this.commander.val,
        playerId: this.currentPlayerId,
      }

      this.$store.dispatch('setCommander', obj)
        .then(()=>{
          this.commander.val = this.players[this.currentPlayerId].cardName
        })

    },
    setCurrentPlayer(id) {
      this.currentPlayerId = id
    },
    setCurrentCounter(counter) {
      this.currentCounter = counter
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
  computed: mapState([
    'players', 'counterList', 'counters', 'cmdrDmgs', 'loading'
  ]),
  components: {
    // card
  },
  mounted () {
  },
};
</script>