<template>
    <a-layout>
        <a-layout-header class="head">
            <div class="search-form-wrap">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="商品名称:">
                        <a-input v-decorator="['name']"/>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="fliterQuery">查询</a-button>
                        <a-button type="primary" @click="handleReset">重置</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-layout-header>
        <a-layout-content>
            <!--价态日历-->
            <div class="ValenceCalendar-wrap">
                <!--商品列表-->
                <div class="good-tree">
                    <div class="good-tree-content">
                        <span class="tree-title" @click="toggleMenu">商家商品 <i class="arrow-icon"
                                                                             :class="dropDown ? 'down':''"></i>  </span>
                        <div class="ul-wrap" v-show="dropDown">
                            <!--:class="dropDown ? 'active':'close'"-->
                            <ul class="good-tree-ul">
                                <li v-for="(item,index) in goodArray" v-bind:key="index" @click="getJiaTai(item,index)" :class="item.select? 'active':''">
                                    {{item.title}}
                                </li>
                            </ul>
                            <a-pagination @change="pageOnChange" :current="currentPage" :total="total"/>
                        </div>
                    </div>
                    <!--<a-tree-->
                    <!--@expand="onExpand"-->
                    <!--:expandedKeys="expandedKeys"-->
                    <!--:autoExpandParent="autoExpandParent"-->
                    <!--:defaultExpandAll="defaultExpandAll"-->
                    <!--@select="onSelect"-->
                    <!--:selectedKeys="selectedKeys"-->
                    <!--:treeData="treeData"-->
                    <!--/>-->

                </div>
                <!--商品列表结束-->
                <div class="ValenceCalendar-item">
                    <span class="good-name">{{goodName}}</span>
                    <a-calendar @select="dateSlect" @panelChange="startPaneChange" :fullscreen="fullscreen"
                                :disabledDate="disabledDate">
                        <ul class="events" slot="dateCellRender" slot-scope="value">
                            <li v-for="(item,index) in getListData(value)" :key="item.content">
                                <span class="solt-tile">{{item.title}}:  <mark> <i v-if="index==0"
                                                                                   style="font-style: normal;">¥</i> {{item.content}}</mark></span>
                            </li>
                        </ul>
                    </a-calendar>
                </div>
            </div>

        </a-layout-content>
        <!--修改价态modal-->
        <a-modal title="价态库存修改" v-model="valenceStateChangesvisible" :footer="null">
            <a-form :form="valenceStateForm.form">
                <a-form-item label="开始日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-date-picker :format="dateFormat" placeholder="开始日期"
                                   v-decorator="valenceStateForm.startDate"/>
                </a-form-item>
                <a-form-item label="结束日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-date-picker :format="dateFormat" placeholder="结束日期" v-decorator="valenceStateForm.endDate"/>
                </a-form-item>
                <a-form-item label="价格" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                    <a-input-number placeholder="输入价格" v-decorator="valenceStateForm.price"/>
                </a-form-item>
                <a-form-item label="库存" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                    <a-input-number placeholder="输入商品库存" v-decorator="valenceStateForm.inventory"/>
                </a-form-item>
                <a-form-item style="text-align: center;">
                    <a-button type="primary" @click="submitValence">提交</a-button>
                </a-form-item>
            </a-form>

        </a-modal>
    </a-layout>

</template>

<script>
    // 默认语言为 en-US，所以如果需要使用其他语言，推荐在入口文件全局设置 locale
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import fetch from "../../common/fetch";

    moment.locale('zh-cn');
    export default {
        name: "valenceManagement",
        data() {
            return {
                fullscreen: true,
                searchForm: this.$form.createForm(this),
                expandedKeys: ['商家商品'],
                defaultExpandAll: true,
                autoExpandParent: true,
                treeData: [],
                selectedKeys: [],
                ValenceArray: [],
                startDate: '',
                endDate: '',
                GoodId: '',
                valenceStateChangesvisible: false,
                valenceStateForm: {
                    form: this.$form.createForm(this),
                    startDate: [
                        `startDate`,
                        {
                            rules: [{
                                required: true,
                                message: '请选择开始时间',
                            }],
                        }
                    ],
                    endDate: [
                        `endDate`,
                        {
                            rules: [{
                                required: true,
                                message: '请选择结束时间',
                            }],
                        }
                    ],
                    price: [
                        `price`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入价格',
                            }],
                        }
                    ],
                    inventory: [
                        `inventory`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入库存',
                            }],
                        }
                    ],
                },
                dateFormat: 'YYYY-MM-DD',
                ValenceStateArray: [],
                dropDown: true,
                goodArray: [],
                currentPage: 1,
                total: 0,
                goodName:''
            }
        },
        created() {
            // 获取商家名下所有商品
            this.getMerchantsGoods();
        },
        mounted() {

        },
        methods: {
            disabledDate(current) {
                return current && current < moment().endOf('day');
            },
            fliterQuery() {
                this.getMerchantsGoods()

            },
            handleReset() {
                this.searchForm.resetFields();
            },
            onExpand(expandedKeys) {
                console.log('onExpand', expandedKeys)
                // if not set autoExpandParent to false, if children expanded, parent can not collapse.
                // or, you can remove all expanded children keys.
                this.expandedKeys = expandedKeys
                this.autoExpandParent = false
            },
            onSelect(selectedKeys, info) {
                console.log(selectedKeys);
                this.selectedKeys = [selectedKeys];
                this.GoodId = selectedKeys[0];
                if (selectedKeys.length > 0) {
                    let today = new Date();
                    var currentTime = this.gettimeStamp(today);
                    console.log(this.GoodId);
                    this.getValenceState(currentTime);

                }
            },
            getJiaTai(item,index) {
                this.GoodId = item.key;
                this.goodName=item.title;
                let today = new Date();
                this.goodArray.forEach((it,ind)=>{
                    if(ind==index){
                        it.select=true
                    }else{
                        it.select=false
                    }
                })
                var currentTime = this.gettimeStamp(today);
                console.log(this.GoodId);
                this.getValenceState(currentTime);


            },
            startPaneChange(date) {
                let time = this.gettimeStamp(date._d);

                this.getValenceState(time);

            },
            getListData(value) {
                // this.ValenceStateArray;
                let valenceArray = this.ValenceStateArray;
                let listData;
                valenceArray.forEach((item) => {
                    let date = new Date(parseInt(item.dailyDate));
                    if (date.getFullYear() === value._d.getFullYear() &&
                        date.getMonth() === value._d.getMonth() &&
                        date.getDate() === value._d.getDate()) {
                        listData = [
                            {title: '价格', content: item.price},
                            {title: '库存', content: item.inventory},
                        ];
                    }
                })
                return listData || [];
            },
            dateSlect(data, dataString) {
                this.valenceStateChangesvisible = true;
                console.log(data);
                let Date = moment(data).valueOf();
                console.log(Date);
                let _vm = this;
                setTimeout(function () {
                    console.log(_vm.valenceStateForm.form);
                    _vm.valenceStateForm.form.setFieldsValue(
                        {
                            ['startDate']: data,
                            ['endDate']: data,
                        })
                }, 100);
                fetch.get('/product/daily/' + this.GoodId + '?startTime=' + Date + '&endTime=' + Date).then((res) => {
                    console.log(res);
                    let Json = res.obj[0];
                    if (res.obj.length > 0) {
                        _vm.valenceStateForm.form.setFieldsValue(
                            {
                                ['inventory']: Json.inventory,
                                ['price']: Json.price
                            })
                    }

                })


            },
            /**
             * 获取当前月份第一天
             */
            // 获取时间戳 (本月第一天00.00.00  本月最后一天23.59.59)
            gettimeStamp(time) {
                var data = new Date(time); //本月
                data.setDate(1);
                data.setHours(0);
                data.setSeconds(0);
                data.setMinutes(0);
                var data1 = new Date(time); // 下月
                if (data.getMonth() == 12) {
                    data1.setMonth(1)
                } else {
                    data1.setMonth(data.getMonth() + 1)
                }
                data1.setDate(1);
                data1.setHours(0);
                data1.setSeconds(0);
                data1.setMinutes(0);
                console.log('本月第一天0点' + data.getTime())
                console.log('本月最后一天23点' + data1.getTime())
                var timeStart = parseInt(data.getTime());
                var timeEnd = parseInt(data1.getTime() - 1000);//(计算下月1号时间戳-1即可)
                var timeRange;
                return timeRange = {
                    'timeStart': timeStart,
                    'timeEnd': timeEnd
                }
            },
            //        setGoodId
            setGoodId(val) {
                this.GoodId = val
            },
            /**
             * 分页器改变
             * */
            pageOnChange(current) {
                this.currentPage = current;
                this.getMerchantsGoods();
            },
            /**
             * 获取商家名下所有商品
             */
            getMerchantsGoods() {
                let formData = this.searchForm.getFieldsValue();
                let name = formData.name;
                let queryName = '';
                if (name !== undefined) {
                    queryName = name
                }
                fetch.get('/product/table?size=8&current=' + this.currentPage + '&name=' + queryName).then(res => {
                    console.log(res);
                    let getMerchantGoods = res.obj.records;
                    let GoodData = [
                        {
                            title: '商家商品',
                            key: '商家商品',
                        }];
                    let childrens = [];
                    getMerchantGoods.forEach((item,index) => {
                        let goodItem = {};
                        goodItem['title'] = item.name;
                        goodItem['key'] = item.id;
                        if(index==0){
                            goodItem['select']=true;
                        }else{
                            goodItem['select']=false;
                        }
                        childrens.push(goodItem);
                    })
                    GoodData[0]['children'] = childrens;
                    this.goodArray = childrens;
                    this.treeData = GoodData;
                    console.log(this.treeData);
                    // this.selectedKeys = [GoodData[0].children[0].key];
                    this.expandedKeys = ['商家商品'];
                    this.GoodId = GoodData[0].children[0].key;
                    this.goodName=GoodData[0].children[0].title
                    this.total=parseInt(  res.obj.total)
                    this.getValenceState(this.gettimeStamp(new Date()));
                })
            },
            /**
             * 获取价态  params goodId:'string',timeObjet:obj
             */
            getValenceState(timeObjet) {
                this.ValenceStateArray = [];
                fetch.get('/product/daily/' + this.GoodId + '?startTime=' + timeObjet.timeStart + '&endTime=' + timeObjet.timeEnd).then((res) => {
                    this.ValenceStateArray = res.obj;
                })

            },
            /**
             * 提交库存价态
             * */
            submitValence() {
                this.valenceStateForm.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(values);
                        let parmas = {};
                        let startStamp = moment(values.startDate).valueOf();
                        let endStamp = moment(values.endDate).valueOf();
                        parmas['inventory'] = values.inventory;
                        parmas['price'] = values.price;
                        fetch.post('/product/daily/' + this.GoodId + '/' + startStamp + '/ ' + endStamp, parmas).then((res) => {
                            console.log(res);
                            this.getValenceState(this.gettimeStamp(startStamp));
                            this.valenceStateChangesvisible = false;
                            this.valenceStateForm.form.resetFields();
                        })

                    }
                });

            },
            toggleMenu() {
                this.dropDown = !this.dropDown
            }


        }

    }
</script>

<style scoped>

    .events {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .events .ant-badge-status {
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        font-size: 12px;
    }

    .notes-month {
        text-align: center;
        font-size: 28px;
    }

    .notes-month section {
        font-size: 28px;
    }

    .ant-input-number {
        width: 170px;
    }

    .good-tree {
        height: 8rem;
    }

    .ul-wrap {
        height: 7.3rem;
        overflow: auto;
        background: #fff;
    }

    .ValenceCalendar-item {
        position: relative;
    }

    .ValenceCalendar-item span.good-name {
        display: inline-block;
        position: absolute;
        height: 0.67rem;
        line-height: 0.67rem;
        left: 0;
        top: 0;
        color: #fff;
        padding-left: 0.3rem;
        font-size: 0.18rem;
    }
.good-tree-ul li.active{
    background:rgba(164,215,249,0.4);

}
    .ant-layout-content{
        padding: 0 0.42rem !important;
    }
</style>