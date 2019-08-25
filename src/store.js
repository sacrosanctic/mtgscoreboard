import Vue from 'vue'
import Vuex from 'vuex'

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
  },
  mutations: {
    addPlayer(state, payload) {
      state.players.push(payload)
    },
    removePlayer(state) {
      state.players.pop()
    },
    setCounter(state, payload) {
      Vue.set(
        state.players[payload.player].counter,
        payload.counter,
        state.players[payload.player].counter[payload.counter]+payload.amount
      )
    }
  },
  actions: {
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
  }
})
