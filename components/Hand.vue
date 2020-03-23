<template>
  <div v-if="$store.state.player.current">
    <swiper ref="mySwiper" :options="swiperOptions">
      <template v-for="card in $store.state.player.current.hand">
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
  methods: {
    playCard(card) {
      this.$axios.patch(`players/${this.$store.state.player.current.id}/cards/${card.id}`, {board: true}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('card-played')
      })
    },
    throwCard(card) {
      this.$axios.patch(`players/${this.$store.state.player.current.id}/cards/${card.id}`, {belongs_to_player: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('card-threw')
      })
    }
  },
}
</script>

<style>
</style>