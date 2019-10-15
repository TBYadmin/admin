<template>
    <div class="wrap">
        <a-layout-header class="head">
            <div class="search-form-wrap">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item :label="'订单类型'">
                        <!--0 代办 1我发起的流程 2 历史流程-->
                        <a-select style="width: 120px" v-model="searchForm.orderType">
                            <a-select-option value="1">酒店</a-select-option>
                            <a-select-option value="2">门票</a-select-option>

                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'订单状态'">
                        <!--0 代办 1我发起的流程 2 历史流程-->
                        <a-select style="width: 120px" v-model="searchForm.orderState">
                            <a-select-option value="1">下单成功</a-select-option>
                            <a-select-option value="2">下单失败</a-select-option>
                            <a-select-option value="3">待付款</a-select-option>
                            <a-select-option value="4">付款成功</a-select-option>
                            <a-select-option value="11">退款成功</a-select-option>
                            <a-select-option value="12">正在退款</a-select-option>
                            <a-select-option value="13">退款失败</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'支付类型'">
                        <!--0 代办 1我发起的流程 2 历史流程-->
                        <a-select defaultValue="0" style="width: 120px" v-model="searchForm.payType">
                            <a-select-option value="2">微信支付</a-select-option>
                            <a-select-option value="1">支付宝支付</a-select-option>
                            <a-select-option value="3">银联支付</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="创建日期:">
                        <a-date-picker v-model="searchForm.createTime"/>
                    </a-form-item>
                    <a-form-item >
                        <a-button type="primary" @click="handleSearch">确定</a-button>
                        <a-button type="primary" @click="reset">重置</a-button>
                    </a-form-item>
                    <a-form-item >
                        <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-layout-header>
        <a-layout-content>
        <div class="table-wrap table-layout"
             style="padding: 0  0.42rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
            <a-table :columns="columns" :dataSource="data" :pagination="pagination"
                     :loading="loading">
                                <span slot="process" slot-scope="process,record">
                  <a-tag color="blue" v-if="process !==''" @click="() => checkProcess(record.key)">{{process}}</a-tag>
                             </span>
                <!--<template slot="operation" slot-scope="text, record">-->
                <!--<div class="editable-row-operations">-->
                <!--<span class="deal-option-span">-->
                <!--<a @click="() => deal(record)"> <i class="edit-i"></i>  <i>处理</i></a>-->

                <!--</span>-->
                <!--</div>-->
                <!--</template>-->
            </a-table>
            <a-pagination @change="pageChange" :current="current" :total="total"
                          :pageSize="size"/>
        </div>
        </a-layout-content>
    </div>
</template>

<script>
    import fetch from '@/common/fetch'
    import axios from 'axios';
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {message} from 'ant-design-vue'

    const columns = [
        {
            title: '订单编号',
            dataIndex: 'key',
            scopedSlots: {customRender: 'key'}
        },
        {
            title: '订单类型',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'}
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            scopedSlots: {customRender: 'createTime'}
        },
        {
            title: '联系人',
            dataIndex: 'conatct',
            scopedSlots: {customRender: 'conatct'}
        },
        {
            title: '商户编号',
            dataIndex: 'merchantNumber',
            scopedSlots: {customRender: 'merchantNumber'}
        },
        {
            title: '订单金额',
            dataIndex: 'orderAmount',
            scopedSlots: {customRender: 'orderAmount'}
        },
        {
            title: '订单状态',
            dataIndex: 'orderState',
            scopedSlots: {customRender: 'orderState'}
        },
        {
            title: '支付渠道',
            dataIndex: 'payChannel',
            scopedSlots: {customRender: 'payChannel'}
        },

        //     {
        //     title: '注册时间',
        //     dataIndex: 'date',
        //     scopedSlots: {customRender: 'date'}
        // },
        // {
        //     title: '处理',
        //     dataIndex: 'operation',
        //     scopedSlots: {customRender: 'operation'}
        // }
    ]
    export default {
        name: "processList",
        data() {
            return {
                pagination: false,
                total:0,
                current: 1,
                size: 10,
                searchForm: {
                    orderType: '',
                    orderState: '',
                    payType: '',
                    createTime: null,
                    current: 1,
                    size: 8

                },
                data: [],
                columns,
                loading: true,


            }
        },
        components: {},
        mounted() {
            this.getProcessList();


        },
        methods: {

            handleSearch() {
                this.current=1;
                this.getProcessList()
            },
            fresh() {
                this.getProcessList()
            },
            reset() {
                this.searchForm = {
                    type: '0',
                    name: '',
                }
            },


            /**
             * get processList
             */
            getProcessList() {
                console.log(this.searchForm);
                let timeStamp = 0;
                let parmas = {};
                parmas['payType'] = this.searchForm.payType;

                if (this.searchForm.createTime !== null) {
                    parmas['createTime'] = moment(this.searchForm.createTime).valueOf()
                }
                if (this.searchForm.orderState !== '') {
                    parmas['state'] = parseInt(this.searchForm.orderState)
                }
                if (this.searchForm.orderType) {
                    parmas['type'] = parseInt(this.searchForm.orderType)
                }
                debugger
                fetch.post('/order/info/page4B?current=' +this.current + '&size=' + this.size, parmas).then(res => {
                    let array = res.obj.records
                    this.total=parseInt(res.obj.total)
                    console.log(array);
                    let tableData = [];
                    this.loading = false;
                    array.forEach((item, index) => {
                        let contactJson = JSON.parse(item.contactsJson);
                        let contactArray = [];
                        contactJson.forEach(contactItem => {
                            contactArray.push(contactItem.name)
                        });
                        let dataJson = {};
                        dataJson['key'] = item.id;
                        dataJson['createTime'] = moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                        dataJson['conatct'] = contactArray.join(',');
                        dataJson['merchantNumber'] = item.shopId;
                        dataJson['orderAmount'] = item.price;
                        let channel = ''
                        switch (item.chargeType) {
                            case '1':
                                channel = '支付宝';
                                break
                            case '2':
                                channel = '微信支付';
                                break
                            default :
                                channel = '银联支付';
                        }
                        dataJson['payChannel'] = channel;
                        let state = ''
                        switch (item.state) {
                            case 1:
                                state = '下单成功';
                                break;
                            case 2:
                                state = '下单失败';
                                break;
                            case 3:
                                state = '待付款';
                                break;
                            case 4:
                                state = '付款成功';
                                break;
                            case 11:
                                state = '退款成功';
                                break;
                            case 12:
                                state = '正在退款';
                                break;
                            default :
                                state = '退款失败';
                        }
                        dataJson['orderState'] = state;
                        let orderType = '';
                        switch (item.type) {
                            case 1:
                                orderType = '酒店订单'
                                break;
                            default:
                                orderType = '景区订单'
                        }
                        dataJson['type'] = orderType

                        tableData.push(dataJson);
                    })

                    this.data = tableData
                })
            },
            fetchAgan() {
                this.getProcessList();
            },
            pageChange(value){
                this.current=value;
                this.getProcessList();
            }
        }
    }
</script>

<style scoped>
    .search-wrap {
        padding: 0 20px 10px;
    }

    .search-form-wrap {
        height: 1rem;
    }
</style>