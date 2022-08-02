import Vue from 'vue'
import Vuex from 'vuex'
import { setToken, getToken } from '@/utils/auth'

Vue.use(Vuex)

// tokenObj.token
// null.token -->报错
// {}.token --> undefined 至少不报错
export default new Vuex.Store({
  state: {
    // JSON.parse(localStorage.getItem('HEIMA_TOUTIAO_TOKEN'))
    tokenObj: getToken() || {}
  },

  mutations: {
    SET_TOKEN(state, payload) {
      // 1.将token存入vuex
      state.tokenObj = payload
      // 2.token存入本地存储中
      // -本地存储 操作是JSON格式字符串
      // localStorage.setItem('HEIMA_TOUTIAO_TOKEN', JSON.stringify(payload))
      setToken(payload)
    }
  }
})
