<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Distribuer</p>
    </header>
    <section class="modal-card-body">
      <div v-if="$store.state.player.list">
        <template v-for="(player, index) in $store.state.player.list">
          <b-field :label="player.name">
            <b-numberinput type="is-primary" min="0" max="15" v-model="cardToDistribute[index]"></b-numberinput>
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
  },
  components: {
  },
  data() {
    return {
      cardToDistribute: []
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
        var cardNumberToDistribute = this.cardToDistribute.reduce((a, b) => {return a + b}, 0)
        var message = `${this.$store.state.user.name} distribue `
        for (var index in this.cardToDistribute) {
          message += `${this.cardToDistribute[index]} cartes pour ${this.$store.state.player.list[index].name}, `
        }
        distribute:
        while (cardNumberToDistribute > 0) {
          for (var index in this.cardToDistribute) {
            if (this.cardToDistribute[index] > 0) {
              try {
                await this.$axios.post(`deck/distribute/${this.$store.state.player.list[index].id}`, {headers: {'X-Secret-Token': this.$store.state.secret.token}})
              } catch(error) {
                this.sendNotification('Erreur', 'Une erreur est survenue durant la distribution des cartes', 'danger', 'error')
                break distribute
              }
              this.cardToDistribute[index]--
              cardNumberToDistribute--
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
}
</script>

<style>
</style>