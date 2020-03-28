<template>
  <section class="section">
    <div class="board">
      <template v-for="player in players">
        <board :key="`${player.id}-${player.game_id}`" :player="player" @update-board="sendUpdate()"/>
      </template>
    </div>
    <footer class="hand-footer">
      <hand @update-board="sendUpdate()"/>
    </footer>
  </section>
</template>

<script>
import Hand from '~/components/Hand'
import Board from '~/components/Board'

export default {
  components: {
    Hand,
    Board
  },
  data() {
    return {
      playerData: {},
      secret: undefined,
      socket: null
    }
  },
  watch: {
    playerName() {
      this.secret = this.$store.state.secret.token
    }
  },
  mounted() {
    this.update()
    this.$options.sockets.onmessage = (messageEvent) => {
      this.update()
      if (messageEvent.data != 'update') {
        this.sendNotification('Information', messageEvent.data, 'primary', 'info', 5000)
      }
    }
  },
  methods: {
    sendUpdate(message = "update") {
      this.$socket.send(message)
    },
    sendNotification(title, body, color = 'success', icon = 'done', duration = 4000) {
      this.$vs.notify({
        title: title,
        text: body,
        color: color,
        position: 'top-center',
        icon: icon,
        time: duration
      })
    },
    update() {
      this.getMyPlayerData()
      this.updateGame()
    },
    getMyPlayerData() {
      if (this.$store.state.secret.token !== null) {
        this.$axios.get('players/me', {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
          this.$store.commit('player/setCurrent', response.data)
        }).catch((error) => {
          this.$store.commit('secret/set', null)
          this.sendNotification('Erreur', 'Token incorrecte', 'danger', 'error')
        })
      } else {
        this.$store.commit('player/setCurrent', {})
      }
    },
    updateGame() {
      if (this.$store.state.secret.token !== null) {
        if (this.$store.state.game.game.id) {
          this.$axios.get(`games/${this.$store.state.game.game.id}`).then((response) => {
            this.$store.commit('game/set', response.data)
          }).catch((error) => {
            this.$store.commit('game/set', [])
          })
        }
      } else {
        this.$store.commit('game/set', [])    
      }
    }
  },
  computed: {
    playerName() {
      return this.$store.state.player.current.name
    },
    players() {
      return this.$store.state.game.game.players
    }
  }
}
</script>

<style>
.section {
}
.hand-footer {
  margin: 1vw;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  z-index: 30;
}

.vs-button {
  width: 100%;
  justify-content: left;
}
</style>
