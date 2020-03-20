<template>
  <div>
    <template>
      <div class="columns">
      </div>
    </template>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      players: {}
    }
  },
  mounted() {
    this.$axios.get('/players').then((response) => {
      this.players = response.data
    }).catch((error) => {
      this.$vs.notify({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la recuperation des joueurs',
        color: 'danger',
        position: 'top-center',
        icon:'error'
      })
    })
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>
</style>