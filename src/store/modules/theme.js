const state = {
  dark: !!JSON.parse(localStorage.getItem('dark'))
}

const mutations = {
  toggleDark (state, payload) {
    state.dark = payload
  }
}

const actions = {
  setDark ({commit}, payload) {
    localStorage.setItem('dark', payload)
    commit('toggleDark', payload)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
