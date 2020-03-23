<template>
  <section class="section">
    <div class="board">
      <template v-for="player in $store.state.player.list">
        <board :player="player" @card-retrieved="sendUpdate()" @card-threw="sendUpdate()"/>
      </template>
    </div>
    <footer class="hand-footer">
      <hand @card-played="sendUpdate()" @card-threw="sendUpdate()"/>
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
    this.updateGame()
    this.$options.sockets.onmessage = (messageEvent) => {
      this.updateGame()
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
    updateGame() {
      this.getMyPlayerData()
      this.updatePlayers()
    },
    getMyPlayerData() {
      if (this.$store.state.secret.token !== null) {
        this.$axios.get('players/me', {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
          this.$store.commit('player/setCurrent', response.data)
        }).catch((error) => {
          this.$store.commit('secret/set', null)
          this.sendNotification('Erreur', 'Token incorrecte', 'danger', 'error')
        })
      }
    },
    updatePlayers() {
      this.$axios.get('players').then((response) => {
        this.$store.commit('player/setList', response.data)
      })
    }
  },
  computed: {
    playerName() {
      return this.$store.state.user.name
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
</style>
