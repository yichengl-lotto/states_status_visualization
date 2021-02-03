import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapData: null,
    industryData: null,
    industryIncome: null,
    colorIndustry: null,
    us: null,
    idToState: null,
    lifeExpense: null,
    eduCost: null
  },
  mutations: {
    setMapData (state, data) {
      state.mapData = data
    },
    setIndustryData (state, data) {
      state.industryData = data
    },
    setIndustryIncome (state, data) {
      state.industryIncome = data
    },
    setIndustryColor (state, data) {
      state.colorIndustry = data
    },
    setUS (state, data) {
      state.us = data
    },
    setIdToState (state, data) {
      state.idToState = data
    },
    setLifeExpense (state, data) {
      state.lifeExpense = data
    },
    setEducationCost (state, data) {
      state.eduCost = data
    }
  },
  actions: {
  },
  modules: {
  }
})
