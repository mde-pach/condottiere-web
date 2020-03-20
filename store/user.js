export const state = () => ({
  name: undefined,
  id: undefined
})

export const mutations = {
  setName (state, name) {
    state.name = name
  },
  setId (state, id) {
    state.id = id
  }
}
