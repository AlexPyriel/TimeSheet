import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import timeSheet from './modules/timeSheet'
import theme from './modules/theme'
import popup from './modules/popup'
import status from './modules/status'
import tenrox from './modules/tenrox'
import report from './modules/report'
import interceptor from './modules/interceptor.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    timeSheet,
    theme,
    popup,
    status,
    tenrox,
    report,
    interceptor
  }
})

export default store
