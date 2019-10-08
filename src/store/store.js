import Vue from 'vue'
import Vuex from 'vuex'

import login from '@/store/module/login'
import auth from '@/store/module/auth'
import qualificationList from '@/views/manage/qualificationsList'
import goodList from '@/views/manage/goodList'
import imgManage from "@/views/manage/pictureList"
import sales from "@/views/manage/sales"
import activity from "@/views/manage/activity"
import processList from "@/views/manage/processList"
import valenceManagement from "@/views/manage/valenceManagement"
import  controller from '@/views/manage/controller'
import  enrollment from  '@/views/manage/enrollment'
import  reconciliation from '@/views/manage/reconciliation'
import  channelManagement from '@/views/manage/channelManagement'
import  orderList from '@/views/manage/orderList'
import  financialSummary from '@/views/financial/financialSummary'

Vue.use(Vuex)

// initial state
const state = {
    componentsArray: [
        {content: qualificationList, key: 'qualificationList'},
        {content: goodList, key: 'goodList'},
        {content: imgManage, key: 'imgManage'},
        {content: sales, key: 'sales'},
        {content: activity, key: 'activity'},
        {content: processList, key: 'processList'},
        {content: valenceManagement, key: 'valenceManagement'},
        {content: controller, key: 'controller'},
        {content: enrollment, key: 'enrollment'},
        {content: reconciliation, key: 'reconciliation'},
        {content: channelManagement, key: 'channelManagement'},
        {content:orderList, key:'orderList'},
        {content:financialSummary, key:'financialSummary'},





    ],
    paneArray: [
        {title: '资质列表', content: qualificationList, key: 'qualificationList'},
    ],
    activeKey: 'qualificationList',
    qiNiuLink:'http://image.supconit.net',
    validationState:true

}

// getters
const getters = {
    getpaneArray: state => state.paneArray,
    getactiveKey: state => state.activeKey,
    getqiNiuLink: state => state.qiNiuLink,
    getvalidationState:state => state.validationState
}

// actions
const actions = {
    menuClick(context, value) {
        let exist = false;
        context.state.paneArray.forEach((item) => {
            if (item.key === value.key) {
                exist = true
            }
        });
        if (!exist) {
            context.commit('setArray', value)
        }
        context.commit('setactiveKey', value.key);
        console.log(context.state.activeKey)
        // state.activeKey = value.key
    },
//    删除


}

// mutations
const mutations = {
    setArray(state, value) {
        state.componentsArray.forEach(val => {
            if (val.key === value.key) {
                val['title'] = value.title;
                state.paneArray.push(val)

            }
        });
    },
    setactiveKey(state, name) {
        state.activeKey = name;
    },
    setPansArray(state, name) {
        state.paneArray = name;
    },
    setqiNiuLink(state, name) {
        state.qiNiuLink =  name
    },
    setvalidationState(state, value){
        state.validationState=value
    }

}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        login,
        auth,


    },
    strict: process.env.NODE_ENV !== 'production'
    // stare cache
    // plugins: [vuexPersistedstate({ storage: window.sessionStorage })]
    // plugins: debug ? [createLogger()] : []
})
