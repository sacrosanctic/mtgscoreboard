import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import * as firebase from 'firebase'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counterList: [
      'life',
      'cmdr',
      'experience',
      'energy',
      'poison',
    ],
    players: [
      {
        id: 0,
        name: 'player1',
        counter: [0,0,0,0,0],
        cardURI: 'https://api.scryfall.com/cards/b9d895af-7e8c-419f-bc5d-5596083fbfb6'
      },
      {
        id: 1,
        name: 'player2',
        counter: [0,0,0,0,0],
        cardURI: 'https://api.scryfall.com/cards/c654737d-34ac-42ff-ae27-3a3bbb930fc1'
      }
    ],
    cmdrDmg: [
      [5,6],
      [4,2]
    ]
  },
  mutations: {
    addPlayer(state, payload) {
      const numOfPlayers = state.players.length
      for(var item of state.cmdrDmg) {
        item.push(0)
      }
      var arr = []
      for(var i=0;i<=numOfPlayers;i++) {
        arr.push(0)
      }
      state.cmdrDmg.push(arr)
      state.players.push(payload)
    },
    removePlayer(state) {
      state.cmdrDmg.pop()
      for(var item of state.cmdrDmg) {
        item.pop()
      }
      state.players.pop()
    },
    setCounter(state, payload) {
      Vue.set(
        state.players[payload.player].counter,
        payload.counter,
        state.players[payload.player].counter[payload.counter]+payload.amount
      )
      firebase.database().ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep').update(state)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          console.log('done')
        })
    },
    setCmdrDmg(state, payload) {
      Vue.set(
        state.cmdrDmg[payload.defender],
        payload.attacker,
        state.cmdrDmg[payload.defender][payload.attacker] + payload.amount
      )
    }
  },
  actions: {
    setCmdrDmg({ commit }, payload) {
      commit('setCmdrDmg', payload)
    },
    setCounter({ commit }, payload) {
      commit('setCounter', payload)
    },
    addPlayer({ commit }) {
      const newPlayer = {
        id: this.state.players.length,
        name: 'player' + (this.state.players.length+1),
        counter: [0,0,0,0,0],
        cardURI: 'https://api.scryfall.com/cards/random?q=t%3Alegendary+t%3Acreature'
      }
      commit('addPlayer', newPlayer)
    },
    removePlayer({ commit }) {
      commit('removePlayer')
    }
  },
  getters: {
  },
  // plugins: [vuexLocal.plugin]
})
