<template>
  <div class="columns board-player" v-if="player">
    <div class="column is-one-fifth" @contextmenu.prevent="$refs.boardMenu.open($event, { player: player })">
      <vs-card class="board-player-data">
        <div class="" slot="header"  >
          <vs-row vs-type="flex" vs-justify="space-between">
            <vs-col vs-w="6" vs-type="flex">
              <vs-avatar color="primary" :text="player.name"/>
              <div class="player-name">
                {{ player.name }}
              </div>
            </vs-col>
            <vs-col vs-w="6" vs-type="flex" vs-justify="flex-end" class="player-hand-count">
              <vs-icon :color="player.hand_count == false ? 'dark' : 'primary'" icon="view_carousel" size="small" />
              <div v-if="typeof(player.hand_count) !== 'boolean'">
                {{ player.hand_count }}              
              </div>
            </vs-col>
          </vs-row>
        </div>
        <div v-if="$store.state.game.game.need_money">
          <vs-row>
            <template v-if="$store.state.player.current.id == player.id">
              <vs-button color="primary" type="line" icon="remove" @click="playerMoney--" />
              <vs-chip color="primary" class="player-money">
                <vs-avatar color="warning" icon="account_balance" />
                {{ playerMoney }}
              </vs-chip>
              <vs-button color="primary" type="line" icon="add" @click="playerMoney++" />
            </template>
            <template v-else>
              <vs-chip color="primary">
                <vs-avatar color="warning" icon="account_balance" />
                {{ player.money }}
              </vs-chip>
            </template>
          </vs-row>
        </div>
        <div slot="footer">
        </div>
      </vs-card>
    </div>
    <div class="column">
      <swiper ref="mySwiper" :options="swiperOptions">
        <template v-for="card in player.board">
          <swiper-slide>
            <img @contextmenu.prevent="$refs.cardMenu.open($event, { card: card })" class="game-card" :src="`/${$store.state.game.game.name}/${card.name}.jpg`" />
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <vue-context ref="cardMenu">
      <template slot-scope="child" v-if="child.data">
        <li>
          <vs-button color="primary" type="flat" icon="visibility" @click.prevent="detail(child.data.card)">Détail</vs-button>
        </li>
        <li>
          <vs-button :disabled="$store.state.player.current.id != player.id" color="primary" type="flat"icon="keyboard_arrow_left" @click.prevent="retrieveCard(child.data.card)">Recuperer {{ child.data.card.name }}</vs-button>
        </li>
        <li>
          <vs-button :disabled="$store.state.player.current.id != player.id" color="danger" type="flat" icon="delete" @click.prevent="throwCard(child.data.card)">Defausser {{ child.data.card.name }}</vs-button>
        </li>
      </template>
    </vue-context>
    <vue-context ref="boardMenu">
      <template slot-scope="child">
        <li v-if="$store.state.player.current.id != player.id">
          <vs-button color="primary" type="flat" icon="compare_arrows" @click.prevent="switchHand(player)">Echanger nos main</vs-button>
        </li>
        <li v-if="$store.state.player.current.id == player.id">
          <vs-button color="danger" type="flat" icon="delete" @click.prevent="throwCards()">Defausser les cartes de mon plateau</vs-button>
        </li>
      </template>
    </vue-context>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { VueContext } from 'vue-context';
import _ from 'lodash';

export default {
  props: {
    player: Object,
  },
  components: {
    Swiper,
    SwiperSlide,
    VueContext
  },
  data() {
    return {
      deleteButtonText: '',
      swiperOptions: {
        slidesPerView: 15,
        spaceBetween: 5,
      },
      playerMoney: this.player.money
    }
  },
  mounted() {
  },
  watch: {
    playerMoney(oldVal, newVal) {
      this.updateMoney()
    }
  },
  methods: {
    updateMoney: _.debounce(function() {
      this.$axios.patch(`players/${this.player.id}`, {money: this.playerMoney}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('update-board')
      })
    }, 1000),
    async throwCards() {
      for (var card of this.player.board) {
        await this.$axios.patch(`players/${this.player.id}/cards/${card.id}`, {belongs_to_player: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}})
      }
      this.$emit('update-board')
    },
    throwCard(card, emit = true) {
      this.$axios.patch(`players/${this.player.id}/cards/${card.id}`, {belongs_to_player: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('update-board')
      })
    },
    retrieveCard(card) {
      this.$axios.patch(`players/${this.player.id}/cards/${card.id}`, {board: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('update-board')
      })
    },
    detail(card) {
      this.$buefy.modal.open(
        `<p class="image">
          <img src="/${this.$store.state.game.game.name}/${card.name}.jpg">
        </p>`
      )
    },
    switchHand(player) {
      this.$axios.post(`players/${this.$store.state.player.current.id}/hand/switch/${player.id}`, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('update-board')
      })
    }
  }
}
</script>

<style lang="scss">
.board-player {
  height: 15vh;
  margin: 1vh;
}

.board-player-data {
  height: 100%;
  .player-name {
    margin: auto 0;
  }
  .player-hand-count {
    margin: auto 0;
  }
  .player-money {
    margin: auto 0;
  }
}
</style>