import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import Config from '@/config/api'
import axios from 'axios'

const state = {
  username: '',
  authCode: ''
}

const getters = {
  getToken: state => state.token,
  getUsername: state => state.username,
  getAuthCode: state => state.authCode
}
const actions = {
  login: ({ commit }, params) => new Promise((resolve, reject) => {
    fetch.post(Utils.stringUtils.concat(Config.getBaseUrl(), Config.api.login), params)
      .then(res => {
        if (res.status === Config.status.SUCCESS) {
          commit('setToken', res.data)
        }
        resolve(res)
      }).catch(err => reject(err))
  }),
  getUser: ({ commit }) => new Promise((resolve, reject) => {
    fetch.get(Utils.stringUtils.concat(Config.getBaseUrl(), Config.api.userInfo))
      .then(res => {
        res.status === Config.status.SUCCESS && (commit('setUsername', res.data.username))
        resolve(res)
      }).catch(err => reject(err))
  }),
  // eslint-disable-next-line
    logout: ({ commit }) => new Promise((resolve, reject) => {
    fetch.post(Utils.stringUtils.concat(Config.getBaseUrl(), Config.api.logout))
      .then(res => resolve(res))
      .catch(err => reject(err))
  }),
  getAuthCode: ({ commit }, uid) => new Promise((resolve) => {
    axios.post(Utils.urlUtils.concat(Utils.stringUtils.concat(Config.getBaseUrl(), Config.api.authCode), uid), JSON.stringify({ filename: 'qrCode.jpg' }), {
      responseType: 'arraybuffer'
    }).then((res) => {
      var src = 'data:image/jpg;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      commit('setAuthCode', src)
      resolve()
    })
  })
}
const mutations = {
  setToken (state, data) {
    state.token = data
  },
  setUsername (state, data) {
    state.username = data
  },
  setAuthCode (state, data) {
    state.authCode = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
