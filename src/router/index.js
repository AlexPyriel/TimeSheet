import Vue from 'vue'
import Router from 'vue-router'
import TimeSheet from '@/components/TimeSheet'
import Settings from '@/components/Settings'
import Auth from '@/components/Auth'
import Status from '@/components/Status'
import ViewReport from '@/components/ViewReport'
import ValidateTenrox from '@/components/ValidateTenrox'

import store from '../store'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    return next()
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters['auth/isAuthenticated']) {
    return next()
  }
  next('/Login')
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TimeSheet',
      component: TimeSheet,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/Login',
      name: 'Auth',
      component: Auth,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/ViewReport',
      name: 'View Report',
      component: ViewReport,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/Status',
      name: 'Status',
      component: Status,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/ValidateTennrox',
      name: 'Validate Tennrox',
      component: ValidateTenrox,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/Settings',
      name: 'Settings',
      component: Settings,
      beforeEnter: ifAuthenticated
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
