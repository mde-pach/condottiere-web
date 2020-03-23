<template>
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
      <b-button type="is-primary" @click="connection()">Ok</b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean
  },
  components: {
  },
  data() {
    return {
      secret: this.$store.state.secret.token
    }
  },
  methods: {
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
    connection() {
      this.isConnectionModalActive = false
      this.$axios.get('players/me', {headers: {'X-Secret-Token': this.secret}}).then((response) => {
        this.$store.commit('user/setId', Number(response.data.id))
        this.$store.commit('user/setName', Number(response.data.name))
        this.$store.commit('secret/set', this.secret)
        this.sendNotification('Succes', `Bienvenue ${response.data.name} !`)
        this.$parent.close()
      }).catch((error) => {
        this.sendNotification('Erreur', 'Votre token est incorrect', 'danger', 'error')
      })
    }
  },
}
</script>

<style>
</style>