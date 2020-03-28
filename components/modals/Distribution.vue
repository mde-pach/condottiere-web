<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Distribuer {{ deck.name }}</p>
    </header>
    <section class="modal-card-body">
      <div v-if="$store.state.player.list">
        <template v-for="(player, index) in $store.state.game.game.players">
          <b-field :label="player.name">
            <b-numberinput type="is-primary" min="0" :max="deck.count - totalCardToDistribute + (cardToDistribute[index] ? cardToDistribute[index] : 0)" v-model="cardToDistribute[index]"></b-numberinput>
          </b-field>
        </template>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-primary" @click="distributeCard()">Go</b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    deck: Object
  },
  components: {
  },
  data() {
    return {
      cardToDistribute: [],
    }
  },
  mounted() {
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
    async distributeCard() {
      if (this.$store.state.secret.token !== null) {
        var message = `${this.$store.state.player.current.name} distribue `
        for (var index in this.cardToDistribute) {
          message += `${this.cardToDistribute[index]} cartes pour ${this.$store.state.game.game.players[index].name}, `
        }
        distribute:
        while (this.totalCardToDistribute > 0) {
          for (var index in this.cardToDistribute) {
            if (this.cardToDistribute[index] > 0) {
              try {
                await this.$axios.post(`decks/${this.deck.id}/distribute/${this.$store.state.game.game.players[index].id}`, {headers: {'X-Secret-Token': this.$store.state.secret.token}})
              } catch(error) {
                this.sendNotification('Erreur', 'Une erreur est survenue durant la distribution des cartes', 'danger', 'error')
                break distribute
              }
              this.$set(this.cardToDistribute, index, this.cardToDistribute[index] - 1)
            }
            else {
              break distribute 
            }
          }
        }
        this.sendUpdate(message)
        this.$parent.close()
      }
      else {
        this.sendNotification('Erreur', 'Vous devez être connecté pour pouvoir distribuer', 'danger', 'error')
      } 
    },
  },
  computed: {
    totalCardToDistribute() {
      return this.cardToDistribute.reduce((a, b) => {return a + b}, 0)
    }
  }
}
</script>

<style>
</style>