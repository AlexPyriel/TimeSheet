import axios from 'axios'

import MockAdapter from 'axios-mock-adapter'
import { tasks, status, tenrox } from './mock-data'

export default {
  authenticate: user => axios.post('/api/users', user),
  getTasks: ({ from, to }) => axios.get('/api/users/tasks', { params: { from, to } }),
  updateTask: task => axios.put('/api/users/tasks', task),
  createTask: task => axios.post('/api/users/tasks', task),
  getStatus: () => axios.get('api/users/status'),
  getTenrox: () => axios.get('api/users/tenrox'),
  sendTenrox: data => axios.post('api/users/tenrox', data)
}

const mock = new MockAdapter(axios, { delayResponse: 1000 })
let uid = 8
function getRandomDay (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

mock.onGet('/api/users/tasks').reply(200, tasks)
mock.onGet('/api/users/status').reply(200, status)
mock.onGet('/api/users/tenrox').reply(200, tenrox)

mock.onPut('/api/users/tasks').reply(config => {
  let update = JSON.parse(config.data)
  let index = tasks.map(task => task.name).indexOf(update.name)
  tasks[index] = { ...update }
  return [200, update]
})

mock.onPost('api/users/tenrox').reply(config => {
  let reportItems = []
  for (let i = 0; i < config.data.getAll('file').length; i++) {
    let day = getRandomDay(10, 22)
    reportItems.push({
      contractor: 'TimeSheet User',
      from: `2018-03-${day}`,
      to: `2018-03-${day + 7}`,
      tenrox: 40,
      timesheet: 40
    })
  }
  return [200, reportItems]
})
mock.onPost('/api/users').reply(config => {
  const userData = JSON.parse(config.data)
  const user = { username: userData.username, fullname: 'TimeSheet User', token: 'AUTHTOKEN' }
  return [200, user]
})
mock.onPost('/api/users/tasks').reply(config => {
  let update = JSON.parse(config.data)
  let index = tasks.map(task => task.name).indexOf(update.name)
  if (index >= 0) {
    let task = Object.assign({}, tasks[index], { hidden: false })
    return [200, task]
  } else {
    uid += 1
    const task = {
      name: update.name,
      description: update.description,
      taskId: uid,
      hidden: false,
      commits: []
    }
    tasks.push(task)
    return [200, task]
  }
})
