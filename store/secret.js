export const state = () => ({
  token: undefined
})

export const mutations = {
  set (state, token) {
    state.token = token
  }
}
