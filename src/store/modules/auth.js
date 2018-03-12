import api from '../../api'
import axios from 'axios'

const state = {
  pendingResponse: false,
  user: JSON.parse(localStorage.getItem('user')) || {
    username: '',
    fullname: '',
    token: ''
  }
}

const getters = {
  isAuthenticated: state => !!state.user.token
}

const mutations = {
  setUser (state, { username, fullname, token }) {
    state.user = { username, fullname, token }
  },
  resetUser (state) {
    state.user = { username: '', fullname: '', token: '' }
  },
  setResponseStatus (state, payload) {
    state.pendingResponse = payload
  }
}

const actions = {
  authRequest ({ commit, dispatch }, user) {
    return new Promise((resolve, reject) => {
      commit('setResponseStatus', true)
      api.authenticate(user)
      .then(response => {
        const user = response.data
        localStorage.setItem('user', JSON.stringify(user))
        axios.defaults.headers.common['Authorization'] = user.token
        axios.defaults.params = { user: user.username }
        commit('setUser', user)
        dispatch('popup/triggerPopup', { error: false, message: `Welcome, ${user.fullname}!` }, { root: true })
        commit('setResponseStatus', false)
        resolve()
      })
      .catch(error => {
        dispatch('authLogout')
        console.error(error)
        commit('setResponseStatus', false)
        reject(error)
      })
    })
  },
  authLogout ({ commit, dispatch }) {
    commit('resetUser')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    if (axios.defaults.params) delete axios.defaults.params['user']
  },
  initAuth ({ commit }) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      axios.defaults.headers.common['Authorization'] = user.token
      axios.defaults.params = { user: user.username }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
