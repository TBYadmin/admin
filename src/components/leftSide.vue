<template>
    <div class="left">
        <div class="admin-center" :class="collapsed? 'small':''">
            <span @click="toggleCollapsed" class="toggleMenu-trigger" :class="collapsed? 'small':''">
                <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
            </span>
            <div class="logo-wrap">
                <span class="logo"></span>
            </div>
            <p class="systyem-name" v-if="!collapsed">MP商家管理平台</p>
        </div>


                <div class="menu-wrap" >
                    <happy-scroll color="rgba(0,0,0,0.5)" size="5">
                <a-menu
                        :defaultSelectedKeys="['qualificationList']"
                        :defaultOpenKeys="openKeys"
                        mode="inline"
                        :inlineCollapsed="collapsed"

                >
                    <a-sub-menu :key="item.key" v-for="(item,index) in userMenuList[0].children">
                    <span slot="title"><i class="menu-title-icon" :class="item.iconfont"></i><span
                            style="color:rgba(36,48,84,1)"
                            v-if="!collapsed">{{item.name}} </span></span>
                        <a-menu-item :key="subItem.key" @click="openPane" v-for="(subItem,index) in item.children">
                            {{subItem.name}}
                        </a-menu-item>
                        <!--<a-menu-item key="orderList" @click="openPane">订单列表</a-menu-item>-->
                        <a-menu-item key="financialSummary" @click="openPane">财务汇总</a-menu-item>
                        <a-menu-item key="siteRevenueNumber" @click="openPane">营业点财务汇总</a-menu-item>
                        <a-menu-item key="commoditySales" @click="openPane">商品销售</a-menu-item>

                        <!--<a-menu-item key="channelManagement" @click="openPane">支付渠道管理</a-menu-item>-->
                    </a-sub-menu>
                    <!--<a-sub-menu key="sub2">-->
                    <!--<span slot="title"><i class="menu-title-icon set"></i><span style="color:rgba(36,48,84,1)"-->
                    <!--v-if="!collapsed">管理</span></span>-->
                    <!--<a-menu-item key="qualificationList" @click="openPane">资质管理</a-menu-item>-->
                    <!--<a-menu-item key="goodList" @click="openPane">商品管理</a-menu-item>-->
                    <!--<a-menu-item key="imgManage" @click="openPane">图片管理</a-menu-item>-->
                    <!--<a-menu-item key="sales" @click="openPane">促销管理</a-menu-item>-->
                    <!--<a-menu-item key="activity" @click="openPane">活动管理</a-menu-item>-->

                    <!--<a-menu-item key="enrollment" @click="openPane">活动报名</a-menu-item>-->
                    <!--<a-menu-item key="processList" @click="openPane">流程管理</a-menu-item>-->
                    <!--<a-menu-item key="valenceManagement" @click="openPane">价态管理</a-menu-item>-->
                    <!--<a-menu-item key="controller" @click="openPane">运维管理</a-menu-item>-->

                    <!--</a-sub-menu>-->
                </a-menu>
                    </happy-scroll>
                </div>


    </div>
</template>
<script>
    import fetch from '@/common/fetch'
    import axios from 'axios'

    export default {
        name: "leftSide",
        data() {
            return {
                collapsed: false,
                openKeys: ['统计', '资质与商品'],
                corresponding: {
                    userAnalysis: '用户分析',
                    orderAnalysis: '订单分析',
                    qualificationList: '资质管理',
                    addQualifications: '新增资质',
                    goodList: '商品管理',
                    addGood: '新增商品',
                    imgManage: '图片管理',
                    sales: '促销管理',
                    activity: '活动管理',
                    processList: '流程管理',
                    valenceManagement: '价态管理',
                    controller: '运维管理',
                    enrollment: '活动报名',
                    reconciliation:'对账',
                    channelManagement: '支付渠道管理',
                    orderList:"订单管理",
                    financialSummary:'财务汇总',
                    siteRevenueNumber:'营业点财务汇总',
                    commoditySales:'商品销售汇总',
                    shouldCollect:'应收账款明细'
                },
                userMenuList: []
            }
        },
        created() {
            this.getMenu()
        },
        mounted() {

        },
        methods: {
            getMenu() {
                let _vm = this;
                // axios.get("platform/security/menu?code=ROOT_FUNCTION").then(function (res) {
                fetch.get('platform/security/menu?code=ROOT_FUNCTION').then(res => {
                    console.log(res.data);
                    let mennuArray = res.data;
                    let fistMenus = mennuArray.filter(menu => menu.pid === "10001");
                    this.getMenuItem(fistMenus, mennuArray);
                    this.userMenuList = fistMenus;
                    console.log(fistMenus)
                    // this.list=fistMenus
                    let openArray = []
                    fistMenus[0].children.forEach((item) => {
                        openArray.push(item.key)
                    })
                    // this.openKeys=openArray
                    console.log(_vm.openKeys);

                })
            },
            getMenuItem(fistMenus, mennuArray) {
                fistMenus.forEach(val => {
                    val.key = val.code;
                    val.title = val.name;
                    if (val.name == '统计') {
                        val['iconfont'] = 'home'
                    } else if (val.name == '资质与商品') {
                        val['iconfont'] = 'good'
                    }else if(val.name == '活动与促销'){
                        val['iconfont'] = 'act'
                    }else if(val.name == '融合支付管理'){
                        val['iconfont'] = 'pay'
                    }else if(val.name == '运维管理'){
                        val['iconfont'] = 'set'
                    }else if(val.name == '会员管理'){
                        val['iconfont'] = 'members'
                    }
                    let childrens = mennuArray.filter(menu => menu.pid === val.id);
                    if (childrens.length > 0) {
                        val.children = childrens;

                    }
                    this.getMenuItem(childrens, mennuArray);
                });
            },
            handleClick() {
                console.log('标题点击')
            },
            titleClick() {
                console.log('子标题点击')
            },
            openPane(e) {
                let value = {title: this.corresponding[e.key], content: e.key, key: e.key};
                this.$store.dispatch('menuClick', value);
                this.$store.commit('setactiveKey', e.key)
            },
            toggleCollapsed() {
                this.collapsed = !this.collapsed;
                this.$emit('setcollapsed', this.collapsed);
            },
        }
    }
</script>

<style scoped>
    .admin-center {
        width: 3rem;
        height: 1.86rem;
        background: linear-gradient(0deg, rgba(64, 158, 255, 1) 0%, rgba(164, 215, 249, 1) 100%);
        position: relative;
        overflow: hidden;
    }

    .admin-center.small {
        width: 1rem;
    }

    .toggleMenu-trigger {
        display: inline-block;
        position: absolute;
        right: 0.25rem;
        top: 0.25rem;
    }

    .toggleMenu-trigger.small {
        right: 0.35rem;
        top: 1.3rem;
    }

    .toggleMenu-trigger .anticon {
        font-size: 0.3rem;
        color: #fff;
    }

    .logo-wrap {
        width: 0.9rem;
        height: 0.9rem;
        background: linear-gradient(0deg, rgba(64, 158, 255, 1) 0%, rgba(164, 215, 249, 1) 100%);
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        margin: 0.25rem auto 0;
        position: relative;

    }

    .logo-wrap .logo {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        margin: 0.05rem;
        background: url("../assets/images/avtar.png") center no-repeat;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        background-size: 100% 100%;
    }

    .systyem-name {
        width: 100%;
        font-size: 0.3rem;
        font-family: SourceHanSansCN-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 0.4rem;
        text-align: center;
        margin-top: 0.1rem;
    }

    .menu-title-icon.home {
        display: inline-block;
        height: 0.25rem;
        width: 0.25rem;
        background: url("../assets/images/home.png") center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 0.05rem;
        margin-right: 0.1rem;
    }
    .menu-title-icon.good {
        display: inline-block;
        height: 0.25rem;
        width: 0.25rem;
        background: url("../assets/images/good.png") center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 0.05rem;
        margin-right: 0.1rem;
    }
    .menu-title-icon.act {
        display: inline-block;
        height: 0.25rem;
        width: 0.25rem;
        background: url("../assets/images/act.png") center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 0.05rem;
        margin-right: 0.1rem;
    }
    .menu-title-icon.pay {
        display: inline-block;
        height: 0.25rem;
        width: 0.25rem;
        background: url("../assets/images/pay.png") center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 0.05rem;
        margin-right: 0.1rem;
    }
    .menu-title-icon.members {
        display: inline-block;
        height: 0.25rem;
        width: 0.25rem;
        background: url("../assets/images/members.png") center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 0.05rem;
        margin-right: 0.1rem;
    }



    .menu-title-icon.set {
        display: inline-block;
        height: 0.28rem;
        width: 0.28rem;
        background: url("../assets/images/set.png") center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 0.08rem;
        margin-right: 0.1rem;
    }

    .menu-wrap {
        width: 100%;
        height: calc(100% - 1.86rem);
        /*overflow-y: auto;*/
        /*height: 300px;*/
    }


    .menu-wrap .ant-menu-submenu-title:hover .menu-title-icon.home {
        background: url("../assets/images/home_active.png") center no-repeat;
        background-size: 100% 100%;
    }

    .menu-wrap .ant-menu-submenu-title:hover .menu-title-icon.set {
        background: url("../assets/images/set_active.png") center no-repeat;
        background-size: 100% 100%;
    }
    .menu-wrap .ant-menu-submenu-title:hover .menu-title-icon.act {
        background: url("../assets/images/act_active.png") center no-repeat;
        background-size: 100% 100%;
    }
    .menu-wrap .ant-menu-submenu-title:hover .menu-title-icon.pay {
        background: url("../assets/images/pay-active.png") center no-repeat;
        background-size: 100% 100%;
    }
    .menu-wrap .ant-menu-submenu-title:hover .menu-title-icon.good {
        background: url("../assets/images/good_active.png") center no-repeat;
        background-size: 100% 100%;
    }
    .menu-wrap .ant-menu-submenu-title:hover .menu-title-icon.members {
        background: url("../assets/images/members_active.png") center no-repeat;
        background-size: 100% 100%;
    }
    .menu-wrap .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
        padding: 0 !important;
    }
</style>