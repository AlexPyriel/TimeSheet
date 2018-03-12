const state = {
  popup: {
    message: '',
    show: false,
    error: false
  }
}

const mutations = {
  showPopup (state, { error, message }) {
    Object.assign(state.popup, { error, message, show: true })
  },
  hidePopup (state) {
    state.popup.show = false
  }
}

const actions = {
  triggerPopup ({ commit }, payload) {
    commit('showPopup', payload)
    setTimeout(() => { commit('hidePopup') }, 3000)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
