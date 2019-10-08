<template>
    <div class="wrap">
        <a-layout-header class="head">
            <div class="search-form-wrap">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item :label="'订单类型'">
                        <!--0 代办 1我发起的流程 2 历史流程-->
                        <a-select defaultValue="0" style="width: 120px" v-model="searchForm.orderType">
                            <a-select-option value="0">酒店</a-select-option>
                            <a-select-option value="1">门票</a-select-option>

                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'订单状态'">
                        <!--0 代办 1我发起的流程 2 历史流程-->
                        <a-select defaultValue="0" style="width: 120px" v-model="searchForm.orderState">
                            <a-select-option value="0">已支付</a-select-option>
                            <a-select-option value="1">未支付</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'商户ID'">
                        <a-input v-model="searchForm.merchantId" placeholder="商户ID"/>
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
                    <a-form-item style="margin-top: 0.15rem;">
                        <a-button type="primary" @click="handleSearch">确定</a-button>
                        <a-button type="primary" @click="reset">重置</a-button>
                    </a-form-item>
                    <a-form-item style="margin-top: 0.15rem;">
                        <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-layout-header>
        <div class="table-wrap table-layout"
             style="padding: 0  0.42rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
            <a-table :columns="columns" :dataSource="data" :pagination="pagination"
                     :loading="loading">
                                <span slot="process" slot-scope="process,record">
                  <a-tag color="blue" v-if="process !==''" @click="() => checkProcess(record.key)">{{process}}</a-tag>
                             </span>
                <template slot="operation" slot-scope="text, record">
                    <div class="editable-row-operations">
                <span class="deal-option-span">
                      <a @click="() => deal(record)"> <i class="edit-i"></i>  <i>处理</i></a>

                    </span>
                    </div>
                </template>
            </a-table>
        </div>

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
            title: '商户名称',
            dataIndex: 'merchantName',
            scopedSlots: {customRender: 'merchantName'}
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

        //     {
        //     title: '注册时间',
        //     dataIndex: 'date',
        //     scopedSlots: {customRender: 'date'}
        // },
        {
            title: '处理',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }]
    export default {
        name: "processList",
        data() {
            return {
                pagination: {
                    pageSize: 9, // 默认每页显示数量
                    defaultPageSize: 9,

                },
                current: 1,
                size: 10,
                searchForm: {
                    orderType: '',
                    orderState: '',
                    merchantId: '',
                    payType: 2,
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
                // +'&chargeType='+this.searchForm.payType+'&state='+this.searchForm.orderState+'&type='+this.searchForm.orderType
                let requestUrl = '';
                if (this.searchForm.createTime !== null) {
                    requestUrl = '/order/info/page4B?current=' + this.current + '&size=10' + '&chargeType=' + this.searchForm.payType + '&createTime=' + this.searchForm.createTime + '&state=' + this.searchForm.orderState + '&type=' + this.searchForm.orderType
                } else {
                    requestUrl = '/order/info/page4B?current=' + this.current + '&size=' +this.size
                }
                fetch.post(requestUrl, {}).then(res => {
                    console.log(res);
                    let array = res.obj;
                    let tableData = [];
                    this.loading = false;
                    for (var i = 0; i < 10; i++) {
                        let dataJson = {};
                        dataJson['key'] = i;
                        dataJson['createTime'] = '2019-09-18' + i;
                        dataJson['conatct'] = '联系人' + i;
                        dataJson['merchantName'] = '商户名' + i;
                        dataJson['orderAmount'] = 259 + i;
                        dataJson['orderState'] = '已支付'
                        tableData.push(dataJson);
                    }
                    this.data = tableData
                })
            },
            fetchAgan() {
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