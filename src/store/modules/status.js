import api from '../../api'

const state = {
  pendingStatusResponse: false,
  status: []
}

const mutations = {
  setStatus (state, payload) {
    state.status = payload
  },
  setStatusResponseStatus (state, payload) {
    state.pendingStatusResponse = payload
  }
}

const actions = {
  requestStatus ({ commit, state }) {
    commit('setStatusResponseStatus', true)
    api.getStatus()
    .then(response => {
      commit('setStatus', response.data)
      commit('setStatusResponseStatus', false)
    })
    .catch(error => {
      console.error(error)
      commit('setStatusResponseStatus', false)
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
