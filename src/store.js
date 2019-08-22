import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: [
      {
        name: 'player1',
        counter: [
          { name: 'life', value: 0 },
          { name: 'poison', value: 0 },
          { name: 'experience', value: 0 },
          { name: 'commander', value: 0 }
        ]
      },
      {
        name: 'player2',
        counter: [
          { name: 'life', value: 1 },
          { name: 'poison', value: 1 },
          { name: 'experience', value: 1 },
          { name: 'commander', value: 1 }
        ]
      }
    ]
  },
  mutations: {
    addPlayer(state, payload) {
      state.players.push(payload)
    }
  },
  actions: {
    addPlayer({ commit }) {
      const newPlayer = {
        name: 'players',
        counter: [
          { name: 'life', value: 0 },
          { name: 'poison', value: 0 },
          { name: 'experience', value: 0 },
          { name: 'commander', value: 0 }
        ]
      }
      commit('addPlayer', newPlayer)
    }
  },
  getters: {

  }
})
