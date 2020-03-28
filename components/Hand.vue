<template>
  <div v-if="$store.state.player.current">
    <swiper ref="mySwiper" :options="swiperOptions">
      <template v-for="card in $store.state.player.current.hand">
        <swiper-slide>
          <img @contextmenu.prevent="$refs.menu.open($event, { card: card })" class="game-card" :src="`/${$store.state.game.game.name}/${card.name}.jpg`"/>
        </swiper-slide>
      </template>
    </swiper>
    <vue-context ref="menu">
      <template slot-scope="child" v-if="child.data">
        <li>
          <vs-button color="primary" type="flat" icon="visibility" @click.prevent="detail(child.data.card)">Détail</vs-button>
        </li>
        <li>
          <vs-button color="primary" type="flat" icon="keyboard_arrow_right" @click.prevent="playCard(child.data.card)">Jouer {{ child.data.card.name }}</vs-button>
        </li>
        <li v-if="$store.state.game.game.can_give_cards" class="v-context__sub">
          <vs-button color="primary" type="flat" icon="send">Donner {{ child.data.card.name }} à:</vs-button>
          <ul class="v-context">
            <template v-for="player in $store.state.game.game.players">
              <li v-if="player.id != $store.state.player.current.id">
                <vs-button class="full-width-button" color="primary" type="flat" @click.prevent="GiveCard(child.data.card, player)">{{ player.name }}</vs-button>
              </li>
            </template>
          </ul>
        </li>
        <li>
          <vs-button color="danger" type="flat" icon="delete" @click.prevent="throwCard(child.data.card)">Defausser {{ child.data.card.name }}</vs-button>
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
        this.$emit('update-board')
      })
    },
    throwCard(card) {
      this.$axios.patch(`players/${this.$store.state.player.current.id}/cards/${card.id}`, {belongs_to_player: false}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('update-board')
      })
    },
    GiveCard(card, player) {
      this.$axios.patch(`players/${this.$store.state.player.current.id}/cards/${card.id}`, {player_id: player.id}, {headers: {'X-Secret-Token': this.$store.state.secret.token}}).then((response) => {
        this.$emit('update-board')
      })
    },
    detail(card) {
      this.$buefy.modal.open(
        `<p class="image">
          <img src="/${this.$store.state.game.game.name}/${card.name}.jpg">
        </p>`
      )
    }
  },
}
</script>

<style>

</style>