export const state = () => ({
  list: []
})

export const mutations = {
  set (state, cardList) {
    state.list = cardList
  }
}
