import axios from 'axios'
import Router from '../../router'

const actions = {
  initInterceptor ({ commit, dispatch }) {
    axios.interceptors.request.use(undefined, error => {
      dispatch('popup/triggerPopup', { error: true, message: error.message || 'Oops! Something went wrong...' }, { root: true })
      return Promise.reject(error)
    })
    axios.interceptors.response.use(undefined, error => {
      if (error.response.status === 401) {
        dispatch('auth/authLogout', null, { root: true })
        Router.push('/login')
        dispatch('popup/triggerPopup', { error: true, message: 'Authentication failed!' }, { root: true })
      } else {
        dispatch('popup/triggerPopup', { error: true, message: error.message || 'Oops! Something went wrong...' }, { root: true })
      }
      return Promise.reject(error)
    })
  }
}

export default {
  namespaced: true,
  actions
}
