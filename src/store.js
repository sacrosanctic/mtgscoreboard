import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersistence from 'vuex-persist'
import { db } from '@/db.js'
// import firebase from 'firebase/app'
// import 'firebase/database'

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage
// })

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
        cardURI: 'https://api.scryfall.com/cards/b9d895af-7e8c-419f-bc5d-5596083fbfb6',
      },
      {
        id: 1,
        name: 'player2',
        cardURI: 'https://api.scryfall.com/cards/c654737d-34ac-42ff-ae27-3a3bbb930fc1',
      }
    ],
    counters: [
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    cmdrDmgs: [
      [5,6],
      [4,2]
    ],
    status: null
  },
  mutations: {
    addPlayer(state, payload) {
      //add player
      state.players.push(payload)

      //additional variable to track new player
      for(var item of state.cmdrDmgs) {
        item.push(0)
      }

      //new player gets their own tracker
      var arr = []
      for(var i=0;i<state.players.length;i++) {
        arr.push(0)
      }
      state.cmdrDmg.push(arr)
    },
    removePlayer(state) {
      state.players.pop()
      state.cmdrDmg.pop()
      for(var item of state.cmdrDmg) {
        item.pop()
      }
    },
    setCounter(state, payload) {
      Vue.set(
        state.counters[payload.player],
        payload.type,
        state.counters[payload.player][payload.type] + payload.amount
      )
    },
    setCmdrDmg(state, payload) {
      Vue.set(
        state.cmdrDmgs[payload.player],
        payload.type,
        state.cmdrDmgs[payload.player][payload.type] + payload.amount
      )
    },
    setStatus(state, payload) {
      state.status = payload
    }
  },
  actions: {
    setCmdrDmg({ commit }, payload) {
      commit('setCmdrDmg', payload)
    },
    setCounter({ commit }, payload) {
      commit('setCounter', payload)
      db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep')
        .update(this.state)
        .then(response => {
          commit('setStatus', response)
          // console.log(response)
        })
        .catch(error => {
          commit('setStatus', error)
          // console.log(error)
        })
        .finally(() => {
          commit('setStatus', 'done')
          // console.log('done')
        })
    },
    addPlayer({ commit }) {
      const newPlayer = {
        id: this.state.players.length,
        name: 'player' + (this.state.players.length+1),
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
