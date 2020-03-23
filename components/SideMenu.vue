<template>
  <div>
    <vs-sidebar parent="body" color="primary" class="sidebarx" spacer v-model="sideBarActive">
      <div class="header-sidebar" slot="header">
        <h2>
          Menu
        </h2>
      </div>
      <vs-sidebar-group title="Deck" open>
        <vs-button color="primary" type="flat" icon="pan_tool" @click="openDistributeInterface()" :disabled="$store.state.secret.token === null">Distribuer des cartes</vs-button>
        <vs-button ref="shuffleDeckButton" class="vs-con-loading__container" color="primary" type="flat" icon="shuffle" @click="shuffleDeck()">Melanger le deck</vs-button>
        <vs-button ref="resetDeckButton" class="vs-con-loading__container" color="warning" type="flat" icon="refresh" @click="resetDeck()">Reinitialiser le deck</vs-button>
      </vs-sidebar-group>
      <vs-sidebar-group title="Joueurs" open>
        <vs-button color="primary" type="flat" icon="account_circle" @click="playerLogin()">Connexion</vs-button>
        <vs-button color="primary" type="flat" icon="add" @click="openNewPlayerInterface()">Nouveau joueur</vs-button>
        <vs-button color="primary" type="flat" icon="list" @click="openListPlayerInterface()">Liste des joueurs</vs-button>
      </vs-sidebar-group>
    </vs-sidebar>
    <vs-navbar class="nabarx" color="#ffffff">
      <div slot="title">
        <vs-navbar-title>
          <vs-button  @click="sideBarActive = true" type="line" icon="menu">Menu</vs-button>
        </vs-navbar-title>
      </div>
    </vs-navbar>
  </div>
</template>

<script>
import ConnectionModal from '~/components/ConnectionModal'
import DistributionModal from '~/components/DistributionModal'
import PlayerListModal from '~/components/PlayerListModal'
import NewPlayerModal from '~/components/NewPlayerModal'

export default {
  props: {
  },
  data () {
    return {
      sideBarActive: false
    }
  },
  components: {
    ConnectionModal,
    DistributionModal,
    PlayerListModal,
    NewPlayerModal
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
    openNewPlayerInterface() {
      this.sideBarActive = false
      this.$buefy.modal.open({
        parent: this,
        component: NewPlayerModal,
        hasModalCard: true,
        trapFocus: true,
        scroll: 'keep'
      })
    },
    openListPlayerInterface() {
      this.sideBarActive = false
      this.$buefy.modal.open({
        parent: this,
        component: PlayerListModal,
        hasModalCard: true,
        trapFocus: true,
        scroll: 'keep'
      })
    },
    playerLogin() {
      this.sideBarActive = false
      this.$buefy.modal.open({
        parent: this,
        component: ConnectionModal,
        hasModalCard: true,
        trapFocus: true,
        scroll: 'keep'
      })
    },
    openDistributeInterface() {
      this.sideBarActive = false
      this.$buefy.modal.open({
        parent: this,
        component: DistributionModal,
        hasModalCard: true,
        trapFocus: true,
        scroll: 'keep'
      })
    },
    shuffleDeck() {
      this.$vs.loading({
        background: 'blue',
        color: '#ffffff',
        container: this.$refs.shuffleDeckButton.$el,
        scale: 0.45
      })
      this.$axios.post('deck/shuffle').then((response) => {
        this.sendNotification('Succes', 'Le deck a ete correctement melange !')
      }).catch((error) => {
        this.sendNotification('Erreur', 'Une erreur est survenue durant le melange du deck', 'danger', 'error')
      }).finally(() => {
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
          this.sendNotification('Succes', 'Le deck a bien ete remis a zero !')
          this.sendUpdate()
        }).catch((error) => {
          this.sendNotification('Erreur', 'Une erreur est survenue durant la creation du deck', 'danger', 'error')
        }).finally(() => {
          this.$vs.loading.close(this.$refs.resetDeckButton.$el)
        })
      }).catch((error) => {
        this.sendNotification('Erreur', 'Une erreur est survenue durant la suppression du deck', 'danger', 'error')
        this.$vs.loading.close(this.$refs.resetDeckButton.$el)
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