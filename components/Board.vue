<template>
  <div class="columns board-player" v-if="player">
    <div class="column is-one-fifth">
      <vs-chip>
        <vs-avatar />
        {{ player.name }}
      </vs-chip>
    </div>
    <div class="column">
      <swiper ref="mySwiper" :options="swiperOptions">
        <template v-for="card in cards">
          <swiper-slide>
            <img @contextmenu.prevent="$refs.menu.open($event, { card: card })" class="game-card" :src="`/${card.name}.jpg`" />
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <vue-context ref="menu">
      <template slot-scope="child" v-if="child.data">
        <li>
          <vs-button :disabled="userBoardId != board.id" color="primary" type="flat"icon="keyboard_arrow_left" @click.prevent="retrieveCard(child.data.card)">Recuperer {{ child.data.card.name }}</vs-button>
        </li>
        <li>
          <vs-button :disabled="userBoardId != board.id" color="danger" type="flat" icon="delete" @click.prevent="throwCard(child.data.card)">Defausser {{ child.data.card.name }}</vs-button>
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
    cards: Array,
    player: Object,
    secret: String,
    board: Object,
    userBoardId: Number
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
    throwCard(card) {
      this.$axios.post(`players/${this.player.id}/cards/throw`, {secret: this.secret, card_id: card.id}).then((response) => {
        this.$emit('card-threw')
      })
    },
    retrieveCard(card) {
      this.$axios.post(`boards/${this.board.id}/get`, {secret: this.secret, card_id: card.id}).then((response) => {
        this.$emit('card-retrieved')
      })
    }
  },
  computed: {
  }
}
</script>

<style>
.board-player {
    height: 15vh;
    margin: 1vh;
}
</style>