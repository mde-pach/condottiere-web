<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Nouveau joueur</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Name">
        <b-input v-model="name"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-danger" @click="$parent.close()">Annuler</b-button>
      <b-button type="is-primary" @click="createPlayer()">C'est parti</b-button>
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
      name: this.$store.state.player.current.name
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
    createPlayer() {
      this.$axios.post('/players', {name: this.name}).then((response) => {
        this.sendUpdate(`Nouveau joueur: ${this.name}`)
        this.$store.commit('secret/set', response.data.secret)
        this.$store.commit('player/setCurrent', response.data)
        this.$parent.close()
        this.$buefy.dialog.alert({
          title: 'Votre token secret (conservez le bien)',
          message: this.$store.state.secret.token,
          confirmText: 'Bien retenu !',
          scroll: 'keep' 
        })
      }).catch((error) => {
        this.sendNotification('Erreur', 'Le nom que vous avez choisi est incorrect ou deja pris', 'danger', 'error')
      })
    },
  },
}
</script>

<style>
</style>
