import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import Config from '@/config/api'
import Data from '@/data/data'

const state = {
  navList: [],
  currentMenuId: ''
}

const getters = {
  getNavList: state => state.navList,
  getCurrentMenuId: state => state.currentMenuId
}
const actions = {
  getAuthMenu: ({ commit }) => new Promise((resolve, reject) => {
    const menuUrl = Utils.stringUtils.concat(Config.getBaseUrl(), Config.api.authMenu)
    fetch.get(menuUrl)
      .then(res => {
        if (res.status === Config.status.SUCCESS) {
          commit('setNavList', res.data)
        }
        resolve(res)
      }).catch(err => reject(err))
  })
}
const mutations = {
  setNavList (state, data) {
    if (!Array.isArray(data)) {
      return (state.navList = [])
    }
    // todo fixed
    let navList = []
    let _navMap = new Map()
    data.forEach(e => _navMap.set(e.code, e))
    Data.navList.forEach(e => {
      if (_navMap.has(e.code)) {
        let _clone = JSON.parse(JSON.stringify(e))
        let _tag = _navMap.get(e.code)
        _clone.name = _tag.name
        _clone.id = _tag.id
        // _clone.context = _tag.url
        if (e.childList && e.childList.length > 0) {
          let list = []
          e.childList.forEach(ele => {
            if (_navMap.has(ele.code)) {
              let _clone = JSON.parse(JSON.stringify(ele))
              let _tagChild = _navMap.get(ele.code)
              // e.context = _tagChild.url
              _clone.name = _tagChild.name
              _clone.id = _tagChild.id
              list.push(_clone)
            }
          })
          _clone.childList = list
        }
        navList.push(_clone)
      }
    })
    state.navList = navList
  },

  setCurrentMenuId (state, path) {
    state.navList.forEach(e => {
      if (e.context === path) {
        state.currentMenuId = e.id
      } else if (Array.isArray(e.childList)) {
        e.childList.forEach(ele => {
          if (ele.context === path) {
            state.currentMenuId = ele.id
          }
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
