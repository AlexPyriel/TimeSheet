import { format, startOfISOWeek, endOfISOWeek, isWithinRange, isBefore } from 'date-fns'
import api from '../../api'

const state = {
  pendingStatusResponse: false,
  tasks: [],
  today: new Date(),
  dateFrom: format(startOfISOWeek(new Date()), 'YYYY-MM-DD'),
  dateTo: format(endOfISOWeek(new Date()), 'YYYY-MM-DD'),
  byDate: [],
  byTasks: [],
  byDateTotal: 0,
  byTasksTotal: 0
}

const snapshot = { ...state }

const mutations = {
  resetState (state) {
    Object.assign(state, snapshot)
  },
  setTasks (state, payload) {
    state.tasks = payload
  },
  setReportResponseStatus (state, payload) {
    state.pendingStatusResponse = payload
  },
  setDateFrom (state, payload) {
    state.dateFrom = payload
  },
  setDateTo (state, payload) {
    state.dateTo = payload
  },
  setByDate (state, payload) {
    state.byDate = payload.byDate
    state.byDateTotal = payload.total
  },
  setByTasks (state, payload) {
    state.byTasks = payload.byTasks
    state.byTasksTotal = payload.total
  }
}

const actions = {
  resetState ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('resetState')
      resolve()
    })
  },
  setDateFrom ({ commit }, payload) {
    commit('setDateFrom', payload)
  },
  setDateTo ({ commit }, payload) {
    commit('setDateTo', payload)
  },
  requestTasks ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      if (isBefore(state.dateFrom, state.dateTo)) {
        commit('setReportResponseStatus', true)
        let range = { from: state.dateFrom, to: state.dateTo }
        api.getTasks(range)
        .then(response => {
          commit('setTasks', response.data)
          commit('setReportResponseStatus', false)
          resolve()
        })
        .catch(error => {
          console.error(error)
          commit('setReportResponseStatus', false)
        })
      } else {
        dispatch('popup/triggerPopup', { error: true, message: `The start of the range cannot be after the end of the range` }, { root: true })
      }
    })
  },
  byDate ({ commit, state }) {
    const tasks = {}
    let total = 0
    state.tasks.forEach(({name, description, taskId, hidden, commits}) => {
      for (let commit of commits) {
        if (isWithinRange(commit.date, state.dateFrom, state.dateTo)) {
          if (tasks[commit.date]) {
            tasks[commit.date] += commit.hours
          } else {
            tasks[commit.date] = commit.hours
          }
          total += commit.hours
        }
      }
    })
    const byDate = Object.keys(tasks).map(key => ({
      date: key,
      hours: tasks[key]
    }))
    commit('setByDate', { total, byDate })
  },
  byTasks ({ commit, state }) {
    const byTasks = []
    let total = 0
    state.tasks.forEach(({name, description, taskId, hidden, commits}) => {
      const task = { name, description, hours: 0 }
      for (let commit of commits) {
        if (isWithinRange(commit.date, state.dateFrom, state.dateTo)) {
          task.hours += commit.hours
          total += commit.hours
        }
      }
      byTasks.push(task)
    })
    commit('setByTasks', { total, byTasks })
  },
  initReportData ({ dispatch }) {
    dispatch('requestTasks')
    .then(() => {
      dispatch('byDate')
      dispatch('byTasks')
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
