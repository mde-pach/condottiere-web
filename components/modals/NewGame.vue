<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Nouvelle partie</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Nom de la partie">
        <b-input v-model="session_name"></b-input>
      </b-field>
      <b-field label="Jeu auquel jouer">
        <b-select placeholder="Choisissez un jeu" v-model="name">
          <option value="condottiere">Condottiere</option>
          <option value="citadelle">Citadelle</option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-danger" @click="$parent.close()">Annuler</b-button>
      <b-button type="is-primary" @click="createGame()">C'est parti</b-button>
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
      session_name: '',
      name: 'condottiere'
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
    createGame() {
      this.$axios.post('/games', {name: this.name, session_name: this.session_name}).then((response) => {
        this.sendNotification('Succes', 'Une nouvelle partie a été créée')
        this.$parent.close()
      }).catch((error) => {
        this.sendNotification('Erreur', 'Le nom que vous avez choisi est incorrect ou deja pris', 'danger', 'error')
      })
    },
  },
}
</script>

<style>
</style>
