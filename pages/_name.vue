<template>
  <section class="section">
    <div class="board">
      <b-modal :active.sync="isModalActive" has-modal-card trap-focus aria-role="dialog" aria-modal>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Connexion</p>
          </header>
          <section class="modal-card-body">
            <b-field label="Votre token secret">
              <b-input v-model="secret" required></b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button type="is-primary" @click="checkSecret()">Ok</b-button>
          </footer>
        </div>
      </b-modal>
    </div>
      <template v-for="board in boards">
        <board :board="board" :player="getPlayerFromBoard(board)" :cards="board.cards" :secret="secret" @card-retrieved="updateGame()" @card-threw="updateGame()"/>
      </template>
    </div>
    <footer class="hand-footer">
      <hand v-if="secret" :secret="secret" :cards="hand" :board-id="boardId" :player-id="playerId" @card-played="updateGame()" @card-threw="updateGame()"/>
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
      hand: [],
      players: [],
      boards: [],
      name: '',
      playerId: 0,
      boardId: 0,
      secret: undefined,
      isModalActive: false,
      isDistributeModalActive: false,
      updateGameInterval: undefined,
    }
  },
  mounted() {
    this.secret = this.$store.state.secret.token
    this.name = this.$route.params.name
    if (this.secret) {
      this.$buefy.dialog.alert({
        title: 'Votre token secret (conservez le bien)',
        message: this.secret,
        confirmText: 'Bien retenu !'
      })  
      this.updateGameInterval = setInterval(this.updateGame, 5000)
    } else {
      this.isModalActive = true // TODO make it true
    }
    this.getPlayerId()
    this.getBoards()
  },
  methods: {
    updateGame() {
      this.getMyCards()
      this.updateBoards()
    },
    getMyCards() {
      this.$axios.get(`players/${this.playerId}/cards`, {headers: {'x-secret-token': this.secret}}).then((response) => {
        this.hand = response.data
      }).catch((error) => {
        this.$router.push('/')
        clearInterval(this.updateGameInterval)
      })
    },
    checkSecret() {
      this.$axios.post(`players/${this.playerId}/auth`, {secret: this.secret}).then((response) => {
        this.$vs.notify({
          title: 'Succes',
          text: 'Votre token est correct !',
          color: 'success',
          position: 'top-center',
          icon:'done'
        })
        this.$store.commit('secret/set', this.secret)
        this.isModalActive = false
        this.updateGame()
        this.updateGameInterval = setInterval(this.updateGame, 5000)
      }).catch((error) => {
        this.$vs.notify({
          title: 'Erreur',
          text: 'Votre token est incorrect',
          color: 'danger',
          position: 'top-center',
          icon:'error'
        })
      })
    },
    getPlayerId() {
      this.$axios.get('players').then((response) => {
        for (var playerId in response.data) {
          if (response.data[playerId].name === this.name) {
            this.playerId = Number(playerId)
          }
          response.data[playerId].cardToDistribute = 0
          this.players.push(response.data[playerId])
        }
        if (this.playerId == 0) {
          this.$router.push('/')
        }
      })
    },
    getBoards() {
      this.$axios.get('boards').then((response) => {
        this.boards = []
        for (var boardId in response.data) {
          if (response.data[boardId].player == this.playerId) {
            this.boardId = Number(boardId)
          }
          this.boards.push(response.data[boardId])
        }
      })
    },
    updateBoards() {
      this.$axios.get('boards').then((response) => {
        this.boards = response.data
      })
    },
    getPlayerFromBoard(board) {
      for (var player in this.players) {
        if (this.players[player].id == board.player) {
          return this.players[player]
        }
      }
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
