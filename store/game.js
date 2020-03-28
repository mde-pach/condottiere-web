import Vue from 'vue'

export const state = () => ({
  game: {}
})

export const mutations = {
  set (state, game) {
    Vue.set(state, 'game', game)
  }
}
