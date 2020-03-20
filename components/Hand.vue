<template>
  <div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <template v-for="card in cards">
        <swiper-slide>
          <img @contextmenu.prevent="$refs.menu.open($event, { card: card })" class="game-card" :src="`/${card.name}.jpg`"/>
        </swiper-slide>
      </template>
    </swiper>
    <vue-context ref="menu">
      <template slot-scope="child" v-if="child.data">
        <li>
          <vs-button  color="primary" type="flat"icon="keyboard_arrow_right" @click.prevent="playCard(child.data.card)">Jouer {{ child.data.card.name }}</vs-button>
        </li>
        <li>
          <vs-button  color="danger" type="flat" icon="delete" @click.prevent="throwCard(child.data.card)">Defausser {{ child.data.card.name }}</vs-button>
        </li>
      </template>
    </vue-context>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { VueContext } from 'vue-context';
import 'vue-context/src/sass/vue-context.scss';

export default {
  props: {
    cards: Array,
    boardId: Number,
    playerId: Number,
    secret: String
  },
  components: {
    Swiper,
    SwiperSlide,
    VueContext
  },
  data() {
    return {
      selectedCard: null,
      swiperOptions: {
        slidesPerView: 15,
        spaceBetween: 5,
      },
    }
  },
  methods: {
    onRightClick (event, text) {
      alert(`You clicked "${text}"!`);
    },
    selectCard(card) {
      this.$buefy.dialog.confirm({
        message: `Jouer la carte ${card.name} ?`,
        onConfirm: () => {
          this.$buefy.toast.open('User confirmed')
        }
      })
    },
    playCard(card) {
      this.$axios.post(`boards/${this.boardId}/put`, {secret: this.secret, card_id: card.id}).then((response) => {
        this.$emit('card-played')
      })
    },
    throwCard(card) {
      this.$axios.post(`players/${this.playerId}/cards/throw`, {secret: this.secret, card_id: card.id}).then((response) => {
        this.$emit('card-threw')
      })
    }
  },
  computed: {
    cardList() {
      return this.cards.map((card) => {return {title: card.name, cover: ''}} )
    }
  }
}
</script>

<style>
</style>