<template>
  <div class="columns board-player" v-if="player">
    <div class="column is-one-fifth">
      <div @contextmenu.prevent="$refs.boardMenu.open" >
        <vs-chip>
          <vs-avatar />
          {{ player.name }}
        </vs-chip>
      </div>
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
          <vs-button :disabled="$store.state.player.current.id != player.id" color="primary" type="flat"icon="keyboard_arrow_left" @click.prevent="retrieveCard(child.data.card)">Recuperer {{ child.data.card.name }}</vs-button>
        </li>
        <li>
          <vs-button :disabled="$store.state.player.current.id != player.id" color="danger" type="flat" icon="delete" @click.prevent="throwCard(child.data.card)">Defausser {{ child.data.card.name }}</vs-button>
        </li>
      </template>
    </vue-context>
    <vue-context ref="boardMenu">
      <template slot-scope="child">
        <li>
          <vs-button :disabled="$store.state.player.current.id != player.id" color="danger" type="flat" icon="delete" @click.prevent="throwCards()">Defausser toutes les cartes</vs-button>
        </li>
      </template>
    </vue-context>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { VueContext } from 'vue-context';

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
      swiperOptions: {
        slidesPerView: 15,
        spaceBetween: 5,
      },
    }
  },
  mounted() {
  },
  methods: {
    async throwCards() {
      for (var card of this.player.board) {
        await this.$axios.patch(`players/${this.player.id}/cards/${card.id}`, {belongs_to_player: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}})
      }
      this.$emit('card-threw')
    },
    throwCard(card, emit = true) {
      this.$axios.patch(`players/${this.player.id}/cards/${card.id}`, {belongs_to_player: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('card-threw')
      })
    },
    retrieveCard(card) {
      this.$axios.patch(`players/${this.player.id}/cards/${card.id}`, {board: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('card-retrieved')
      })
    }
  }
}
</script>

<style>
.board-player {
    height: 15vh;
    margin: 1vh;
}
</style>