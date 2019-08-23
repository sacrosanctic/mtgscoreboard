import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: [
      {
        name: 'player1',
        counter: [0,0,0,0]
      },
      {
        name: 'player2',
        counter: [0,0,0,0]
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
        name: 'player2',
        counter: [0,0,0,0]
      }
      commit('addPlayer', newPlayer)
    }
  },
  getters: {
    getPlayerList(state) {
      const playerList = []
      // console.log(state.players)
      for(var player of state.players) {
        playerList.push(player.name)
        // console.log(player.counter[1])
      }
      return playerList
    }
  }
})
