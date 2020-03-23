export const state = () => ({
  token: null
})

export const mutations = {
  set (state, token) {
    state.token = token
  }
}
