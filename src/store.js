import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/db.js'
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settings: {
      startingLife: 40,
      currBoard: 'scoreboard/-Lne7_VJOBzY4Q9e4Eep/',
      scoreboardId: '-Lne7_VJOBzY4Q9e4Eep',
      format: 'commander',
    },
    format: {
      commander: {
        startingLife: 30,
        cmdrDmg: true
      },
      Brawl: {
        startingLife: 30,
        cmdrDmg: false
      }
    },
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
      [40,0,0,0,0],
      [40,0,0,0,0]
    ],
    cmdrDmgs: [
      [0,0],
      [0,0]
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
    bind: firebaseAction(function(context) {
      context.commit('setLoading',true)
      const p1 = context.bindFirebaseRef('counters', db.ref('scoreboard/'+context.state.settings.scoreboardId+'/counters'))
      const p2 = context.bindFirebaseRef('players', db.ref('scoreboard/'+context.state.settings.scoreboardId+'/players'))
      const p3 = context.bindFirebaseRef('cmdrDmgs', db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs'))
      Promise.all([p1, p2, p3]).then(() => {
        context.commit('setLoading',false)
      })
    }),
    createBoard: firebaseAction((context, payload) => {
      return db
              .ref('scoreboard/')
              .set(payload)
                .then(value=>(console.log(value)))
                .catch(error=>(console.log(error)))
    }),
    setCmdrDmg: firebaseAction((context, payload) => {
      return db
        .ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/' + payload.player + '/' + payload.type)
        .transaction(value => {
          return value + payload.amount
        })
        .then(() => {
          db
            .ref('scoreboard/'+context.state.settings.scoreboardId+'/counters/'+ payload.type + '/0')
            .transaction(value => {
              return value - payload.amount
            })
            .catch(() => {})
        })
        .catch(() => {})
    }),
    setPlayer: firebaseAction((context, payload) => {
      db.ref('scoreboard/'+context.state.settings.scoreboardId+'/players/'+ payload.playerId + '/name')
        .set(payload.value)
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
        db.ref('scoreboard/'+context.state.settings.scoreboardId+'/players/'+ payload.playerId)
          .update(newCard)
      })
    }),
    setCounter: firebaseAction((context, payload) => {
      return db
        .ref('scoreboard/'+context.state.settings.scoreboardId+'/counters/' + payload.player + '/' + payload.type)
        .transaction(value => {
          return value + payload.amount
        })
        .catch(() => {})
    }),
    resetLife: firebaseAction((context) => {
      //do it later
      let numOfPlayers = context.state.players.length
      let startingLife = context.state.settings.startingLife
      const cmdrDmgs = Array(numOfPlayers).fill(0).map(()=>Array(numOfPlayers).fill(0))
      const counters = Array(numOfPlayers).fill(0).map(()=>Array(5).fill(startingLife).fill(0,1))
      db.ref('scoreboard/'+context.state.settings.scoreboardId+'/counters/')
        .set(counters)
      db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/')
        .set(cmdrDmgs)
    }),
    reset: firebaseAction((context) => {
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
        db.ref('scoreboard/'+context.state.settings.scoreboardId+'/players/')
        .set(players)
        db.ref('scoreboard/'+context.state.settings.scoreboardId+'/counters/')
        .set(counters)
        db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/')
        .set(cmdrDmgs)
    }),
    addPlayer: firebaseAction(( context ) => {
      var newPlayerId = context.state.players.length
      axios.get('https://api.scryfall.com/cards/random?q=t%3Alegendary+t%3Acreature')
        .then(res => {
          res = res.data

          const newPlayer = {
            id: newPlayerId,
            name: 'player' + (newPlayerId+1),
            cardURI: res.uri,
            cardName:res.name,
            manaCost:res.mana_cost,
          }

          db.ref('scoreboard/'+context.state.settings.scoreboardId+'/players/'+ newPlayerId)
            .set(newPlayer)

          for(let i=0;i<newPlayerId;i++) {
            db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/'+ i + '/' + newPlayerId)
              .set(0)
          }
          var arr = []
          for(let i=0;i<=newPlayerId;i++) {
            arr.push(0)
          }
          db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/'+ newPlayerId)
            .set(arr)

          db.ref('scoreboard/'+context.state.settings.scoreboardId+'/counters/'+ newPlayerId)
            .set([context.state.settings.startingLife,0,0,0,0])
        })
    }),
    removePlayer: firebaseAction(( context ) => {
      var playerId = context.state.players.length - 1
      db.ref('scoreboard/'+context.state.settings.scoreboardId+'/players/' + playerId)
        .remove()
      db.ref('scoreboard/'+context.state.settings.scoreboardId+'/counters/' + playerId)
        .remove()
      db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/' + playerId)
        .remove()

      for(let i=0;i<playerId;i++) {
        db.ref('scoreboard/'+context.state.settings.scoreboardId+'/cmdrDmgs/'+ i + '/' + playerId)
          .remove()
      }
    }),
  },
  getters: {
  },
})