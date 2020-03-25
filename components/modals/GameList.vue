<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Liste des parties</p>
    </header>
    <section class="modal-card-body">
      <b-table :data="games">
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" numeric>
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field="name" label="Nom">
            {{ props.row.session_name }}
          </b-table-column>
          <b-table-column field="name" label="Jeu">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="name" label="Nombre de joueurs">
            {{ props.row.players.length }}
          </b-table-column>
          <b-table-column field="name" label="Decks">
            {{ props.row.decks.length }}
          </b-table-column>
          <b-table-column field="actions" label="Action">
            <b-button type="is-danger" icon-right="delete" @click="deleteGame(props.row)"/>
          </b-table-column>
        </template>
      </b-table>
    </section>
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
      games: []
    }
  },
  mounted() {
    this.updateGames()
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
    updateGames() {
      this.$axios.get('games').then((response) => {
        this.games = response.data
      })
    },
    deleteGame(game) {
      this.$axios.delete(`games/${game.id}`).then((response) => {
        this.sendUpdate()
        this.updateGames()
      }).catch((error) => {
        this.sendNotification('Erreur', 'Une erreur est survenue durant la suppression de la partie', 'danger', 'error')
      })
    },
  },
}
</script>

<style>
</style>