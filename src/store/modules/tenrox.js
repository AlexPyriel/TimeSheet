import api from '../../api'

const state = {
  pendingTenroxResponse: false,
  tenrox: []
}

const mutations = {
  setTenroxReport (state, payload) {
    state.tenrox = payload
  },
  addTenroxReport (state, payload) {
    payload.forEach(tenroxItem => {
      state.tenrox.push(tenroxItem)
    })
  },
  setTenroxResponseStatus (state, payload) {
    state.pendingTenroxResponse = payload
  }
}

const actions = {
  requestTenrox ({ commit, state }) {
    commit('setTenroxResponseStatus', true)
    api.getTenrox()
    .then(response => {
      commit('setTenroxReport', response.data)
      commit('setTenroxResponseStatus', false)
    })
    .catch(error => {
      console.error(error)
      commit('setTenroxResponseStatus', false)
    })
  },
  uploadTennrox ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      commit('setTenroxResponseStatus', true)
      api.sendTenrox(data)
      .then(response => {
        commit('addTenroxReport', response.data)
        dispatch('popup/triggerPopup', { error: false, message: `Tenrox report updated!` }, { root: true })
        commit('setTenroxResponseStatus', false)
        resolve()
      })
      .catch(error => {
        console.error(error)
        commit('setTenroxResponseStatus', false)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
