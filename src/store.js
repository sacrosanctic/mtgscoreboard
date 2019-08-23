import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: [
      {
        id: 0,
        name: 'player1',
        counter: [0,0,0,0]
      },
      {
        id: 1,
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
        id: new Date,
        name: 'player2',
        counter: [0,0,0,0]
      }
      commit('addPlayer', newPlayer)
    }
  },
  getters: {
    getPlayerList(state) {
      const playerList = []
      for(var player of state.players) {
        const obj = {
          id: player.id,
          name: player.name
        }
        playerList.push(obj)
      }
      return playerList
    }
  }
})
