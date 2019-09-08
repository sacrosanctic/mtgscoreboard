import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersistence from 'vuex-persist'
import { db } from '@/db.js'
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import axios from 'axios'

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
      [1,2],
      [3,4]
    ],
    status: null,
    loading: false
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    setStatus(state, payload) {
      state.status = payload
    },
    ...vuexfireMutations,
  },
  actions: {
    init: firebaseAction(function(context) {
      context.commit('setLoading',true)
      context.bindFirebaseRef('counters', db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters'))
      context.bindFirebaseRef('players', db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/players'))
      context.bindFirebaseRef('cmdrDmgs', db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs'))
      context.commit('setLoading',false)
    }),
    setCmdrDmg: firebaseAction((_, payload) => {
      return db
        .ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs/' + payload.player + '/' + payload.type)
        .transaction(value => {
          return value + payload.amount
        })
        .then(() => {
          db
            .ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters/'+ payload.type + '/0')
            .transaction(value => {
              return value - payload.amount
            })
            .catch(() => {})
        })
        .catch(() => {})
    }),
    setCounter: firebaseAction((_, payload) => {
      return db
        .ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters/' + payload.player + '/' + payload.type)
        .transaction(value => {
          return value + payload.amount
        })
        .catch(() => {})
    }),
    reset: firebaseAction(() => {
      const players = [
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
      ]
      const counters = [
        [40,0,0,0,0],
        [40,0,0,0,0]
      ]
      const cmdrDmgs = [
        [0,0],
        [0,0]
      ]
         db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/players/')
          .set(players)
         db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters/')
          .set(counters)
         db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs/')
          .set(cmdrDmgs)

    }),
    addPlayer: firebaseAction(({ state }) => {
      var newPlayerId = state.players.length
      var cardURI = ''
      axios.get('https://api.scryfall.com/cards/random?q=t%3Alegendary+t%3Acreature')
        .then(response => {
          cardURI = response.data.uri

          const newPlayer = {
            id: newPlayerId,
            name: 'player' + (newPlayerId+1),
            cardURI: cardURI
            // cardURI: 'https://api.scryfall.com/cards/random?q=t%3Alegendary+t%3Acreature'
          }

          db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/players/'+ newPlayerId)
            .set(newPlayer)

          for(let i=0;i<newPlayerId;i++) {
            db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs/'+ i + '/' + newPlayerId)
              .set(0)
          }
          var arr = []
          for(let i=0;i<=newPlayerId;i++) {
            arr.push(0)
          }
          db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs/'+ newPlayerId)
          .set(arr)

          db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters/'+ newPlayerId)
          .set([40,0,0,0,0])
        })
    }),
    removePlayer: firebaseAction(({ state }) => {
      var playerId = state.players.length - 1
      db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/players/' + playerId)
        .remove()
      db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters/' + playerId)
        .remove()
      db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs/' + playerId)
        .remove()

      for(let i=0;i<playerId;i++) {
        db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs/'+ i + '/' + playerId)
          .remove()
      }
    // removePlayer(state) {
    //   state.players.pop()
    //   state.cmdrDmg.pop()
    //   for(var item of state.cmdrDmg) {
    //     item.pop()
    //   }
    // },

    // removePlayer({ commit }) {
    //   commit('removePlayer')
    // }
    }), 
  },
  getters: {
  },
})