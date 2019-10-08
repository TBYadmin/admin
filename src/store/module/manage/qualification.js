import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import Config from '@/config/api'
import {message} from 'ant-design-vue'

const state = {
    qiNiuLink:'http://poycg8mgv.bkt.clouddn.com',

};

const getters = {
    getqiNiuLink: state => state.qiNiuLink,
};
const actions = {

};
const mutations = {
    setqiNiuLink(state, name) {
    state.qiNiuLink =  name
}

};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
