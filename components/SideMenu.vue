<template>
  <div>
    <vs-sidebar parent="body" color="primary" class="sidebarx" spacer v-model="sideBarActive">
      <div class="header-sidebar" slot="header">
        <h2>
          Menu
        </h2>
      </div>
      <vs-sidebar-group title="Deck" open>
        <vs-button color="primary" type="flat" icon="pan_tool" @click="openDistributeInterface()">Distribuer des cartes</vs-button>
        <vs-button ref="shuffleDeckButton" class="vs-con-loading__container" color="primary" type="flat" icon="shuffle" @click="shuffleDeck()">Melanger le deck</vs-button>
        <vs-button ref="resetDeckButton" class="vs-con-loading__container" color="warning" type="flat" icon="refresh" @click="resetDeck()">Reinitialiser le deck</vs-button>
      </vs-sidebar-group>
      <vs-sidebar-group title="Joueurs" open>
        <vs-button color="primary" type="flat" icon="add" @click="openNewPlayerInterface()">Nouveau joueur</vs-button>
        <vs-button color="primary" type="flat" icon="list" @click="">Liste des joueurs</vs-button>
        <vs-button ref="deletePlayersButton" class="vs-con-loading__container" color="danger" type="flat" icon="delete" @click="deletePlayers()">Supprimer les joueurs</vs-button>
      </vs-sidebar-group>
    </vs-sidebar>
    <vs-navbar class="nabarx" color="#ffffff">
      <div slot="title">
        <vs-navbar-title>
          <vs-button  @click="sideBarActive = true" type="line" icon="menu">Menu</vs-button>
        </vs-navbar-title>
      </div>
    </vs-navbar>
    <b-modal :active.sync="isNewPlayerModalActive" has-modal-card trap-focus aria-role="dialog" aria-modal>
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
          <b-button type="is-danger" @click="isNewPlayerModalActive = false">Annuler</b-button>
          <b-button type="is-primary" @click="createPlayer()">C'est parti</b-button>
        </footer>
      </div>
    </b-modal>
    <b-modal :active.sync="isDistributeModalActive" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Distribuer</p>
        </header>
        <section class="modal-card-body">
          <template v-for="(player, index) in players">
            <b-field :label="player.name">
              <b-numberinput type="is-primary" min="0" max="15" v-model="player.cardToDistribute"></b-numberinput>
            </b-field>  
          </template>
        </section>
        <footer class="modal-card-foot">
          <b-button type="is-primary" @click="distributeCard()">Go</b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      sideBarActive: false,
      isNewPlayerModalActive: false,
      isDistributeModalActive: false,
      name: '',
      players: []
    }
  },
  components: {
  },
  methods: {
    openNewPlayerInterface() {
      this.sideBarActive = false
      this.isNewPlayerModalActive = true
    },
    createPlayer() {
      this.$axios.post('/players', {name: this.name}).then((response) => {
        this.$store.commit('secret/set', response.data.secret)
        this.$router.push({
          path: `${response.data.name}`
        })
        this.$axios.post('boards', {player_id: response.data.id}).then((response) => {
          this.$vs.notify({
            title: 'Succes',
            text: 'Nouveau joueur cree !',
            color: 'success',
            position: 'top-center',
            icon:'done'
          })
        }).catch((error) => {
          this.$vs.notify({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la creation de votre plateau de jeu',
            color: 'danger',
            position: 'top-center',
            icon:'error'
          })
        })
      }).catch((error) => {
        this.$vs.notify({
            title: 'Erreur',
            text: 'Le nom que vous avez choisi est incorrect ou deja pris',
            color: 'danger',
            position: 'top-center',
            icon:'error'
          })
      }).finally(() => {
        this.isNewPlayerModalActive = false
      })
    },
    openDistributeInterface() {
      this.sideBarActive = false
      this.$axios.get('players').then((response) => {
        this.players = Object.values(response.data)
        this.isDistributeModalActive = true
      })
    },
    async distributeCard() {
      var cardToDistribute = this.players.reduce((a, b) => {return a + (b.cardToDistribute ? b.cardToDistribute : 0)}, 0)
      while (cardToDistribute > 0) {
        for (var player in this.players) {
          if (this.players[player].cardToDistribute > 0) {
            await this.$axios.post(`deck/pick/${this.players[player].id}`, {card_number: 1})
            this.players[player].cardToDistribute--
            cardToDistribute--
          }
        }
      }
      this.isDistributeModalActive = false
    },
    shuffleDeck() {
      this.$vs.loading({
        background: 'blue',
        color: '#ffffff',
        container: this.$refs.shuffleDeckButton.$el,
        scale: 0.45
      })
      this.$axios.get('deck/shuffle').then((response) => {
        this.$vs.notify({
          title: 'Succes',
          text: 'Le deck a ete correctement melange !',
          color: 'success',
          position: 'top-center',
          icon:'done'
        })
        this.$vs.loading.close(this.$refs.shuffleDeckButton.$el)        
      }).catch((error) => {
        this.$vs.notify({
          title: 'Erreur',
          text: 'Une erreur est survenue durant le melange du deck',
          color: 'danger',
          position: 'top-center',
          icon:'error'
        })
        this.$vs.loading.close(this.$refs.shuffleDeckButton.$el)        
      })
    },
    resetDeck() {
      this.$vs.loading({
        background: 'warning',
        color: '#ffffff',
        container: this.$refs.resetDeckButton.$el,
        scale: 0.45
      })
      this.$axios.delete('deck').then((response) => {
        this.$axios.post('deck').then((response) => {
          this.$vs.notify({
            title: 'Succes',
            text: 'Le deck a bien ete remis a zero !',
            color: 'success',
            position: 'top-center',
            icon:'done'
          })  
          this.$vs.loading.close(this.$refs.resetDeckButton.$el)
        }).catch((error) => {
          this.$vs.notify({
            title: 'Erreur',
            text: 'Une erreur est survenue durant la creation du deck',
            color: 'danger',
            position: 'top-center',
            icon:'error'
          })
          this.$vs.loading.close(this.$refs.resetDeckButton.$el)
        })
      }).catch((error) => {
        this.$vs.notify({
          title: 'Erreur',
          text: 'Une erreur est survenue durant la suppression du deck',
          color: 'danger',
          position: 'top-center',
          icon:'error'
        })
        this.$vs.loading.close(this.$refs.resetDeckButton.$el)
      })
    },
    deletePlayers() {
      this.$vs.loading({
        background: 'danger',
        color: '#ffffff',
        container: this.$refs.deletePlayersButton.$el,
        scale: 0.45
      })
      this.$axios.delete('players').then((response) => {
        this.$axios.delete('boards').then((response) => {
          this.$vs.notify({
            title: 'Succes',
            text: 'Les joueurs ont bien ete supprimes',
            color: 'success',
            position: 'top-center',
            icon:'done'
          })
          this.$vs.loading.close(this.$refs.deletePlayersButton.$el)
        }).catch((error) => {
          this.$vs.notify({
            title: 'Erreur',
            text: 'Une erreur est survenue durant la suppression des plateaux de jeux',
            color: 'danger',
            position: 'top-center',
            icon:'error'
          })
          this.$vs.loading.close(this.$refs.deletePlayersButton.$el)
        })
        this.$vs.loading.close(this.$refs.deletePlayersButton.$el)
      }).catch((error) => {
        this.$vs.notify({
          title: 'Erreur',
          text: 'Une erreur est survenue durant la suppression des joueurs',
          color: 'danger',
          position: 'top-center',
          icon:'error'
        })
        this.$vs.loading.close(this.$refs.deletePlayersButton.$el)
      })
    }
  }
}
</script>

<style>
.nabarx {
  position: fixed !important;
  z-index: 99 !important;
}
</style>