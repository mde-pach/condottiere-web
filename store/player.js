export const state = () => ({
  list: [],
  current: {}
})

export const mutations = {
  setList (state, playerList) {
    state.list = playerList
  },
  setCurrent (state, currentPlayer) {
    state.current = currentPlayer
  }
}
