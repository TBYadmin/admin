<template>
    <div class="wrap">
        <div class="left" :class="collapsed? 'small':''">
            <leftSide v-on:setcollapsed="setcollapsed"/>
        </div>
        <div class="right" :class="collapsed? 'big':''">
            <a-layout-content class="content menu-tabs-contanier" style="width: 100%;position: relative;">
                <div class="system-info-wrap">
                    <div class="system-info-content">
                        <div class="search--input-wrap">
                            <div class="search--input-content">
                                <span class="search-input-icon"> <i class="icon iconfont icon-fangdajing"></i></span>
                                <a-input placeholder="输入您要找的内容"/>
                            </div>
                            <span class="search-go">搜索</span>
                        </div>
                        <!--用户信息-->
                        <div class="system-user-info-wrap">
                            <span class="user-avatar"><img src="" alt=""></span>
                            <span class="user-name">{{userInfo.username}}</span>
                            <span class="user-option" @click="toggleMenu"> <i class="icon iconfont "
                                                                              :class="menuShow?'icon-xiangshangjiantou':'icon-xiajiantou'"></i>
  <transition name='fade'>
                                <ul class="user-menu" v-show="menuShow">
                                    <li @click="loginOut">退出系统</li>
                                </ul>
  </transition>
                            </span>
                        </div>
                    </div>


                </div>
                <a-tabs hideAdd v-model="activeKey" type="editable-card" @edit="onEdit">
                    <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
                        <div :is="pane.content"></div>
                    </a-tab-pane>
                </a-tabs>
            </a-layout-content>
        </div>


    </div>
</template>

<script>
    /**
     * 组件
     */
    import leftSide from '@/components/leftSide.vue'
    import fetch from '@/common/fetch'
    import {getStore,setStore} from '@/utils/storage'
    /**
     *方法
     */
    export default {
        name: "manageCenter",
        data() {
            return {
                activeKey: this.$store.state.activeKey,
                panes: this.$store.state.paneArray,
                closable: true,
                collapsed: false,
                menuShow: false,
                userInfo:{}
            }
        },
        computed: {
            getActivekey() {
                return this.$store.state.activeKey;
            }
        },
        watch: {
            getActivekey(val) {
                this.activeKey = val;
            }
        },
        mounted(){
           var userInfo= getStore('userInfo' );
            this.userInfo=JSON.parse(userInfo)
        },


        components: {
            leftSide
        },
        methods: {
            loginOut() {
                fetch.post('/platform/security/logout').then((res) => {
                    console.log(res);
                    this.$router.replace({name:'login'})
                })
            },
            callback(key) {
                console.log(key)
            },
            onEdit(targetKey, action) {
                this[action](targetKey)
            },
            remove(targetKey) {
                let activeKey = this.activeKey
                let lastIndex
                this.panes.forEach((pane, i) => {
                    if (pane.key === targetKey) {
                        lastIndex = i - 1
                    }
                })
                const panes = this.panes.filter(pane => pane.key !== targetKey)
                if (lastIndex >= 0 && activeKey === targetKey) {
                    activeKey = panes[lastIndex].key
                }
                this.panes = panes
                this.activeKey = activeKey;
                this.$store.commit('setactiveKey', activeKey);
                this.$store.commit('setPansArray', panes);

            },
            setcollapsed(value) {
                this.collapsed = value;
            },
            toggleMenu() {
                this.menuShow = !this.menuShow;
            }
        },
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }

    .ant-pagination {
        margin-top: 20px;
        text-align: right;
    }

    .ant-layout-header {
        color: #fff;
    }

    .ant-layout.ant-layout-has-sider {
        height: calc(100% - 64px);

    }

    .ant-layout {
        width: 100%;
        height: 100%;
    }

    .ant-layout-sider {
        /*background: #ffff;*/
    }

    .left {
        width: 3rem;
        height: 100%;
        float: left;
    }

    .left.small {
        width: 1rem;
    }

    .right {
        width: calc(100% - 3rem);
        float: right;
        height: 100%;
    }

    .right.big {
        width: calc(100% - 1rem);
    }

    .system-info-wrap {
        width: 6.05rem;
        height: 0.67rem;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 888;
    }

    .system-info-content {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .search--input-wrap {
        width: 3.5rem;
        height: 0.4rem;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: 0;
    }

    .search--input-content {
        width: 3rem;
        height: 0.4rem;
        border: 1px solid rgba(228, 225, 232, 1);
        border-radius: 0.06rem;
        display: inline-block;
    }

    .search--input-wrap .search-input-icon {
        height: 0.4rem;
        line-height: 0.4rem;
        display: inline-block;
        padding: 0 0.05rem;
        color: #fff;
    }

    .search--input-wrap input {
        width: calc(100% - 0.4rem);
        display: inline-block;
        height: 0.38rem;
        line-height: 0.38rem;
        float: right;
    }

    .search--input-wrap .ant-input {
        border: none;
        background: transparent;
    }

    .search--input-wrap .ant-input:focus {
        border: none;
        box-shadow: none;
    }

    .search--input-wrap .ant-input:hover {
        border: none;
        box-shadow: none;
    }

    input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #A6A6A6;
        font-family: 微软雅黑;
        font-size: 0.17rem;
        letter-spacing: 1px;
    }

    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #A6A6A6;
        font-family: 微软雅黑;
        font-size: 0.17rem;
        letter-spacing: 1px;
    }

    input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #A6A6A6;
        font-family: 微软雅黑;
        font-size: 0.17rem;
        letter-spacing: 1px;
    }

    input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #A6A6A6;
        font-family: 微软雅黑;
        font-size: 0.17rem;
        letter-spacing: 1px;
    }

    .search-go {
        display: inline-block;
        height: 0.4rem;
        line-height: 0.4rem;
        color: #999999;
        float: right;
        font-size: 0.18rem;
    }

    .system-user-info-wrap {
        width: 2rem;
        height: 0.5rem;
        line-height: 0.5rem;
        margin: 0.09rem 0;
        float: right;
    }

    .system-user-info-wrap .user-avatar {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        background: linear-gradient(0deg, rgba(64, 158, 255, 1) 0%, rgba(165, 215, 249, 1) 100%);
        border-radius: 50%;
        float: left;
        margin-right: 0.1rem;
    }

    .system-user-info-wrap .user-avatar img {
        width: 100%;
        height: 100%;
    }

    .system-user-info-wrap .user-name {
        font-size: 0.18rem;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);

    }

    .system-user-info-wrap .user-option {
        display: inline-block;
        position: relative;
        margin-left: 0.5rem;
        color: #fff;
        font-size: 0.16rem;
    }

    .system-user-info-wrap .user-option .icon {
        font-size: 0.16rem;
    }

    .system-user-info-wrap .user-option .user-menu {
        position: absolute;
        width: 1rem;
        height: auto;
        top: 0.4rem;
        left: -0.8rem;
        webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .15);
        box-shadow: 0 0 2px rgba(0, 0, 0, .15);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background: #fff;
        -webkit-border-radius: 0.04rem;
        -moz-border-radius: 0.04rem;
        border-radius: 0.04rem;
    }

    .system-user-info-wrap .user-option .user-menu li {
        height: 0.35rem;
        line-height: 0.35rem;
        text-align: center;
        list-style: none;
        color: #999;
        cursor: pointer;
    }
    .content.menu-tabs-contanier.ant-layout-content{
        height: 100%;
    }
    .ant-tabs{
        height: 100%;
    }

</style>