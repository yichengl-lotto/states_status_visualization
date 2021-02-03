import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import State from '../views/State.vue'
import Schools from '../views/Schools.vue'
// import Profile from '../views/Profile.vue'
import Expense from '../views/Expense.vue'
import Income from '../views/Income.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue'),
  },
  {
    path: '/state',
    name: 'States',
    component: State
  },
  {
    path: '/industry',
    name: 'Industry',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Industry.vue'),

  },
  {
    path: '/school',
    name: 'Schools',
    component: Schools
  },
  {
    path: '/expense',
    name: 'Expense',
    component: Expense
  },
  {
    path: '/income',
    name: 'Income',
    component: Income
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
