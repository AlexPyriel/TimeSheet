import { addDays, format, startOfISOWeek, isSameISOWeek, startOfMonth, endOfMonth, isSameMonth } from 'date-fns'
import api from '../../api'

const state = {
  pendingAuthResponse: false,
  pendingTasksResponse: false,
  today: new Date(),
  selectedDate: null,
  tempDate: null,
  tasks: [],
  daySummary: {},
  weekSummary: 0,
  week: []
}

const snapshot = { ...state }

function transformTask ({name, description, taskId, hidden, commits}) {
  let task = { name, description, taskId, hidden }
  for (let commit of commits) {
    task[commit.date] = commit.hours
  }
  return task
}

const mutations = {
  setAuthResponseStatus (state, payload) {
    state.pendingAuthResponse = payload
  },
  setTasksResponseStatus (state, payload) {
    state.pendingTasksResponse = payload
  },
  resetState (state) {
    Object.assign(state, snapshot)
  },
  setDate (state, payload) {
    state.tempDate = state.selectedDate || state.today
    state.selectedDate = payload
  },
  setWeek (state) {
    const startOfWeek = startOfISOWeek(state.selectedDate || state.today)
    const week = []
    for (let i = 0; i < 7; i++) {
      let nextDay = addDays(startOfWeek, i)
      let weekday = { text: format(nextDay, 'dd, DD'), value: format(nextDay, 'YYYY-MM-DD'), sortable: true }
      if (weekday.value === format(state.today, 'YYYY-MM-DD')) weekday.today = true
      week.push(weekday)
    }
    state.week = week
  },
  setWeekSummary (state) {
    let weekSummary = 0
    state.tasks.forEach(({name, description, taskId, hidden, ...commits}) => {
      for (let commit in commits) {
        if (isSameISOWeek(commit, state.selectedDate || state.today)) weekSummary += commits[commit]
      }
    })
    state.weekSummary = parseFloat(weekSummary.toFixed(2))
  },
  setDaySummary (state) {
    let daySummary = {}
    state.tasks.forEach(({name, description, taskId, hidden, ...commits}) => {
      for (let commit in commits) {
        if (daySummary[commit]) {
          daySummary[commit] += commits[commit]
        } else {
          daySummary[commit] = commits[commit]
        }
      }
    })
    for (let key in daySummary) {
      daySummary[key] = parseFloat(daySummary[key].toFixed(2))
    }
    state.daySummary = { ...daySummary }
  },
  setTask (state, payload) {
    let index = state.tasks.map(task => task.name).indexOf(payload.name)
    state.tasks.splice(index, 1, payload)
  },
  liftTask (state, index) {
    state.tasks.unshift(state.tasks.splice(index, 1)[0])
  },
  addTask (state, payload) {
    state.tasks.unshift(payload)
  },
  initializeData (state, payload) {
    const temp = { tasks: [], daySummary: {}, weekSummary: 0 }
    payload.forEach(({name, description, taskId, hidden, commits}) => {
      let task = { name, description, taskId, hidden }
      for (let commit of commits) {
        task[commit.date] = commit.hours
        if (isSameISOWeek(commit.date, state.selectedDate || state.today)) temp.weekSummary += commit.hours
        if (temp.daySummary[commit.date]) {
          temp.daySummary[commit.date] += commit.hours
        } else {
          temp.daySummary[commit.date] = commit.hours
        }
      }
      temp.weekSummary = parseFloat(temp.weekSummary.toFixed(2))
      temp.tasks.push(task)
    })
    for (let key in temp.daySummary) {
      temp.daySummary[key] = parseFloat(temp.daySummary[key].toFixed(2))
    }
    Object.assign(state, temp)
  }
}

const actions = {
  resetState ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('resetState')
      resolve()
    })
  },
  initializeMonth ({ commit, dispatch }) {
    commit('setWeek')
    dispatch('requestTasks')
  },
  actualizeData ({ commit, dispatch, state }, payload) {
    commit('setDate', payload)
    if (!isSameMonth(state.selectedDate, state.tempDate)) {
      dispatch('initializeMonth')
    } else {
      if (!isSameISOWeek(state.selectedDate, state.tempDate)) {
        commit('setWeek')
        commit('setWeekSummary')
      }
    }
  },
  requestTasks ({ commit, state }) {
    const date = state.selectedDate || state.today
    const month = { from: format(startOfMonth(date), 'YYYY-MM-DD'), to: format(endOfMonth(date), 'YYYY-MM-DD') }
    commit('setTasksResponseStatus', true)
    api.getTasks(month)
    .then(response => {
      commit('initializeData', response.data)
      commit('setTasksResponseStatus', false)
    })
    .catch(error => {
      console.error(error)
      commit('setTasksResponseStatus', false)
    })
  },
  updateTask ({ commit, dispatch }, payload) {
    function buildTask ({taskId, name, description, hidden, ...commits}) {
      let filteredCommits = Object.keys(commits).filter(key => commits[key] !== '')
      let mappedCommits = filteredCommits.map(key => ({ date: key, hours: commits[key] }))
      return { taskId, name, description, hidden, commits: mappedCommits }
    }
    const task = buildTask(payload)
    return new Promise((resolve, reject) => {
      commit('setTasksResponseStatus', true)
      api.updateTask(task)
      .then(response => {
        commit('setTask', transformTask(response.data))
        commit('setWeekSummary')
        commit('setDaySummary')
        dispatch('popup/triggerPopup', { error: false, message: `Task ${task.name} updated!` }, { root: true })
        commit('setTasksResponseStatus', false)
        resolve()
      })
      .catch(error => {
        console.error(error)
        commit('setTasksResponseStatus', false)
      })
    })
  },
  submitTask ({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      let index = state.tasks.map(task => task.name).indexOf(payload.name)
      if (index >= 0) {
        if (state.tasks[index].hidden) {
          let task = Object.assign({}, state.tasks[index], { hidden: false })
          dispatch('updateTask', task)
          .then(() => {
            commit('liftTask', index)
            resolve()
          })
        } else {
          dispatch('popup/triggerPopup', { error: false, message: 'Requested task already listed below!' }, { root: true })
          commit('liftTask', index)
          resolve()
        }
      } else {
        dispatch('createTask', payload)
        .then(() => { resolve() })
      }
    })
  },
  createTask ({ commit, dispatch }, task) {
    return new Promise((resolve, reject) => {
      commit('setAuthResponseStatus', true)
      api.createTask(task)
      .then(response => {
        commit('addTask', transformTask(response.data))
        dispatch('popup/triggerPopup', { error: false, message: `Task ${task.name} created!` }, { root: true })
        commit('setAuthResponseStatus', false)
        resolve()
      })
      .catch(error => {
        console.error(error)
        commit('setAuthResponseStatus', false)
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
