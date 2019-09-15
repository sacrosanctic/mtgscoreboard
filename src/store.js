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
        cardURI: 'Muldrotha, the Gravetide',
      },
      {
        id: 1,
        name: 'player2',
        cardURI: 'Karn\'s Bastion',
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
      const p1 = context.bindFirebaseRef('counters', db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/counters'))
      const p2 = context.bindFirebaseRef('players', db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/players'))
      const p3 = context.bindFirebaseRef('cmdrDmgs', db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/cmdrDmgs'))
      Promise.all([p1, p2, p3]).then(() => {
        context.commit('setLoading',false)
      })
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
    setCommander: firebaseAction((context, payload) => {
      axios.get('https://api.scryfall.com/cards/named?fuzzy=' + encodeURI(payload.value))
      .then(res => {
        res = res.data

        const newCard = {
          cardURI: res.uri,
          cardName:res.name,
          manaCost:res.mana_cost,
        }
        db.ref('scoreboard/-Lne7_VJOBzY4Q9e4Eep/players/'+ payload.playerId)
          .update(newCard)
          .then(()=>{
            return res.name
          })
      })
    }),
    setCounter: firebaseAction((context, payload) => {
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
          cardName: 'Muldrotha, the Gravetide',
          cardURI: 'Muldrotha, the Gravetide',
          manaCost: '{3}{B}{G}{U}'
        },
        {
          id: 1,
          name: 'player2',
          cardName: 'Karn\'s Bastion',
          cardURI: 'Karn\'s Bastion',
          manaCost: '{10}'
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
      axios.get('https://api.scryfall.com/cards/random?q=t%3Alegendary+t%3Acreature')
        .then(res => {
          res = res.data

          const newPlayer = {
            id: newPlayerId,
            name: 'player' + (newPlayerId+1),
            cardURI: res.uri,
            cardName:res.name,
            manaCost:res.mana_cost,
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
    }), 
  },
  getters: {
  },
})