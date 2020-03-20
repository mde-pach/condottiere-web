<template>
  <section class="section">
    <div class="board">
      
    </div>
      <template v-for="board in boards">
        <board :user-board-id="boardId" :board="board" :player="getPlayerFromBoard(board)" :cards="board.cards" :secret="secret" @card-retrieved="updateGame()" @card-threw="updateGame()"/>
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
      updateGameInterval: undefined,
    }
  },
  watch: {
    playerName() {
      this.secret = this.$store.state.secret.token
      this.name = this.$store.state.user.name
      this.playerId = this.$store.state.user.id
      this.updateGameInterval = setInterval(this.updateGame, 1000)
      this.getBoards()
    }
  },
  methods: {
    updateGame() {
      this.getMyCards()
      this.updateBoards()
      this.updatePlayers()
    },
    getMyCards() {
      if (this.playerId != undefined) {
        this.$axios.get(`players/${this.playerId}/cards`, {headers: {'x-secret-token': this.secret}}).then((response) => {
          this.hand = response.data
        }).catch((error) => {
          clearInterval(this.updateGameInterval)
        })  
      }
    },
    getBoards() {
      this.$axios.get('boards').then((response) => {
        this.boards = []
        for (var boardId in response.data) {
          if (response.data[boardId].player == this.playerId) {
            this.boardId = Number(boardId)
          }
        }
      })
    },
    updateBoards() {
      this.$axios.get('boards').then((response) => {
        this.boards = response.data
      })
    },
    updatePlayers() {
      this.$axios.get('players').then((response) => {
        this.players = Object.values(response.data)
      })
    },
    getPlayerFromBoard(board) {
      for (var player in this.players) {
        if (this.players[player].id == board.player) {
          return this.players[player]
        }
      }
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
