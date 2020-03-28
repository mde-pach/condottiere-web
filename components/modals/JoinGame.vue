<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Rejoindre une partie</p>
    </header>
    <section class="modal-card-body">
      <b-table :data="games">
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" numeric>
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field="name" label="Nom de la partie">
            {{ props.row.session_name }}
          </b-table-column>
          <b-table-column field="name" label="Nom du jeu">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="actions" label="Action">
            <b-button type="is-primary" @click="join(props.row)">Rejoindre</b-button>
          </b-table-column>
        </template>
      </b-table>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-danger" @click="$parent.close()">Annuler</b-button>
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
      games: []
    }
  },
  mounted() {
    this.$axios.get('games').then((response) => {
      this.games = response.data
    })
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
    join(game) {
      this.$axios.patch(`players/${this.$store.state.player.current.id}`, {game_id: game.id}).then((response) => {
        this.sendNotification('Succes', `Vous avez rejoint la partie de ${game.session_name}: ${game.name}`)
        this.$axios.get(`games/${game.id}`).then((response) => {
          this.$store.commit('game/set', response.data)
          this.$store.commit('player/setCurrent', {})
          this.sendUpdate()
          this.$parent.close()
        })
      })
    }
  },
}
</script>

<style>
</style>
