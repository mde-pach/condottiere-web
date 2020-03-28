<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Liste des joueurs</p>
    </header>
    <section class="modal-card-body">
      <b-table :data="players">
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" numeric>
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field="name" label="Nom">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="actions" label="Action">
            <b-button disabled type="is-warning" icon-right="pencil" />
            <b-button type="is-danger" icon-right="delete" @click="deletePlayer(props.row)"/>
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
      players: []
    }
  },
  mounted() {
    this.updatePlayers()
  },
  methods: {
    sendUpdate(message = "update") {
      this.$socket.send(message)
    },
    updatePlayers() {
      this.$axios.get('players').then((response) => {
        this.players = response.data
      })
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
    deletePlayer(player) {
      this.$axios.delete(`players/${player.id}`).then((response) => {
        if (this.$store.state.player.current.id === player.id) {
          this.$store.commit('secret/set', null)          
          this.$store.commit('player/setCurrent', {})          
        }
        this.updatePlayers()
        this.sendUpdate()
      }).catch((error) => {
        this.sendNotification('Erreur', 'Une erreur est survenue durant la suppression du joueur', 'danger', 'error')
      })
    },
  },
}
</script>

<style>
</style>