<template>
    <div class="wrap">
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap sale-search-form-wrap">
                    <a-form layout="inline">
                         <a-form-item label="结算日期:">
                            <a-range-picker v-model="searchForm.timeRange"/>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fliterQuery">查询</a-button>
                            <a-button type="primary" @click="handleReset">重置</a-button>
                            <span class="exportExcel" @click="export2Excel"> <i class="iconfont icon-xiazai"></i>导出</span>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-layout-header>
            <a-layout-content   style="padding:  0 0.25rem ;">
                <template>
                    <a-table
                            :columns="columns"
                            :dataSource="data"
                            bordered
                            size="small"
                            :scroll="{ x: '210%' }"
                            :pagination="pagination"

                    />
                </template>
            </a-layout-content>
        </a-layout>


    </div>
</template>
<script>
    import moment from "moment";
    import 'moment/locale/zh-cn';
    moment.locale('zh-cn');
    const columns = [
        {
            title: '财务结算汇总表',
            children: [
                {
                    title: '营业点',
                    dataIndex: 'operatingPoint',
                    key: 'operatingPoint',
                    width: 150,
                    filters: [
                        {
                            text: '门票小计',
                            value: '门票小计',
                        }, {
                            text: '商业小计',
                            value: '商业小计',
                        }],
                    onFilter: (value, record) => record.operatingPoint.indexOf(value) === 0,
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        if (index === 5) {
                            obj.attrs.rowSpan = 5;
                        }
                        return obj;
                    },
                },
                {
                    title: '收入总额',
                    dataIndex: 'totalRevenue',
                    key: 'totalRevenue',
                    width: 100,
                },
                {
                    title: '应付合作方',
                    children: [
                        {
                            title: '合作方1',
                            dataIndex: 'partner1',
                            key: 'partner1',
                            width: 100,
                        },
                        {
                            title: '合作方2',
                            dataIndex: 'partner2',
                            key: 'partner2',
                            width: 100,
                        },
                        {
                            title: '合作方3',
                            dataIndex: 'partner3',
                            key: 'partner3',
                            width: 100,
                        },
                    ],
                },
                {
                    title: '开票金额',
                    dataIndex: 'invoiceAmount',
                    key: 'invoiceAmount',
                    width: 130,
                },
                {
                    title: '未票金额',
                    dataIndex: 'unpaidAmount',
                    key: 'unpaidAmount',
                    width: 130,
                },
                {
                    title: '收款方式',
                    children: [
                        {
                            title: '现金',
                            dataIndex: 'cash',
                            key: 'cash',
                            width: 100,
                        },
                        {
                            title: '微信',
                            dataIndex: 'weChat',
                            key: 'weChat',
                            width: 100,
                        },
                        {
                            title: '刷卡',
                            dataIndex: 'creditCard',
                            key: 'creditCard',
                            width: 100,
                        },
                        {
                            title: '支付宝',
                            dataIndex: 'aliPay',
                            key: 'aliPay',
                            width: 100,
                        },
                        {
                            title: '转账',
                            dataIndex: 'transfer',
                            key: ' transfer',
                            width: 100,
                        },
                        {
                            title: '其他',
                            dataIndex: 'otherPayment',
                            key: 'otherPayment',
                            width: 100,
                        },
                        {
                            title: '合计',
                            dataIndex: 'paymentCombined',
                            key: 'paymentCombined',
                            width: 100,
                        },
                    ],
                },
                {
                    title: '到账情况',
                    children: [
                        {
                            title: '银行1',
                            dataIndex: 'bank1',
                            key: 'banck1',
                            width: 100,
                        },
                        {
                            title: '银行2',
                            dataIndex: 'bank2',
                            key: 'bank2',
                            width: 100,
                            customRender: (value, row, index) => {
                                const obj = {
                                    children: value,
                                    attrs: {},
                                };
                                if (index === 5) {
                                    obj.attrs.rowSpan = 5;
                                }
                                return obj;
                            },
                        },
                        {
                            title: '微信手续费',
                            dataIndex: 'weChatServiceCharge',
                            key: 'weChatServiceCharge',
                            width: 160,
                        },
                        {
                            title: '支付宝手续费',
                            dataIndex: 'aliServiceCharge',
                            key: 'aliServiceCharge',
                            width: 160,
                        },
                        {
                            title: '手续费3',
                            dataIndex: 'ServiceChargeThird',
                            key: 'ServiceChargeThird',
                            width: 160,
                        }
                    ],
                },
                {
                    title: '未到账金额',
                    dataIndex: 'outstandingAmount',
                    key: 'outstandingAmount',
                    width: 120,
                },
                {
                    title: '其他',
                    dataIndex: 'others',
                    key: 'others',
                    width: 100,

                }
            ]
        },


    ];

    const data = [

        {
            key: 1,
            operatingPoint: '营业点门票',
            totalRevenue: 1,
            partner1: '美团',
            partner2: '饿了吗',
            partner3: '网易',
            invoiceAmount: 12330,
            unpaidAmount: 500,
            cash: 2,
            weChat: 567,
            creditCard: 877,
            aliPay: 1405,
            transfer: 4557,
            otherPayment: 54,
            paymentCombined: 566625,
            bank1: 34,
            bank2: 34,
            weChatServiceCharge: 24,
            aliServiceCharge: 34,
            ServiceChargeThird: 3,
            outstandingAmount: 1575,
            others: '无',

            children: [
                {
                    key: 2,
                    operatingPoint: '线下门票',
                    totalRevenue: 2,
                    partner1: '美团',
                    partner2: '饿了吗',
                    partner3: '网易',
                    invoiceAmount: 12330,
                    unpaidAmount: 500,
                    cash: 2,
                    weChat: 567,
                    creditCard: 877,
                    aliPay: 1405,
                    transfer: 4557,
                    otherPayment: 54,
                    paymentCombined: 566625,
                    bank1: 34,
                    bank2: 34,
                    weChatServiceCharge: 24,
                    aliServiceCharge: 34,
                    ServiceChargeThird: 3,
                    outstandingAmount: 1575,
                    others: '无',
                },
                {
                    key: 3,
                    operatingPoint: '线上门票',
                    totalRevenue:3,
                    partner1: '美团',
                    partner2: '饿了吗',
                    partner3: '网易',
                    invoiceAmount: 12330,
                    unpaidAmount: 500,
                    cash: 2,
                    weChat: 567,
                    creditCard: 877,
                    aliPay: 1405,
                    transfer: 4557,
                    otherPayment: 54,
                    paymentCombined: 566625,
                    bank1: 34,
                    bank2: 34,
                    weChatServiceCharge: 24,
                    aliServiceCharge: 34,
                    ServiceChargeThird: 3,
                    outstandingAmount: 1575,
                    others: '无',
                }
            ],
        },
        {
            key: 4,
            operatingPoint: '门票小计',
            totalRevenue: 4,
            partner1: '美团',
            partner2: '饿了吗',
            partner3: '网易',
            invoiceAmount: 1,
            unpaidAmount: 500,
            cash: 2,
            weChat: 567,
            creditCard: 877,
            aliPay: 1405,
            transfer: 4557,
            otherPayment: 54,
            paymentCombined: 566625,
        },
        {
            key: 5,
            operatingPoint: '商业小计',
            totalRevenue: 5,
            partner1: '美团',
            partner2: '饿了吗',
            partner3: '网易',
            invoiceAmount: 1,
            unpaidAmount: 500,
            cash: 2,
            weChat: 567,
            creditCard: 877,
            aliPay: 1405,
            transfer: 4557,
            otherPayment: 54,
            paymentCombined: 566625,
            children: [
                {
                    key: 6,
                    operatingPoint: '商业1',
                    totalRevenue: 6,
                    partner1: '美团',
                    partner2: '饿了吗',
                    partner3: '网易',
                    invoiceAmount: 12330,
                    unpaidAmount: 500,
                    cash: 2,
                    weChat: 567,
                    creditCard: 877,
                    aliPay: 1405,
                    transfer: 4557,
                    otherPayment: 54,
                    paymentCombined: 566625,
                    bank1: 34,
                    bank2: 34,
                    weChatServiceCharge: 24,
                    aliServiceCharge: 34,
                    ServiceChargeThird: 3,
                    outstandingAmount: 1575,
                    others: '无',
                },
                {
                    key: 7,
                    operatingPoint: '商业2',
                    totalRevenue: 7,
                    partner1: '美团',
                    partner2: '饿了吗',
                    partner3: '网易',
                    invoiceAmount: 12330,
                    unpaidAmount: 500,
                    cash: 2,
                    weChat: 567,
                    creditCard: 877,
                    aliPay: 1405,
                    transfer: 4557,
                    otherPayment: 54,
                    paymentCombined: 566625,
                    bank1: 34,
                    bank2: 34,
                    weChatServiceCharge: 24,
                    aliServiceCharge: 34,
                    ServiceChargeThird: 3,
                    outstandingAmount: 1575,
                    others: '无',
                }
            ],
        },
        {
            key:8,
            operatingPoint: '商业小计',
            totalRevenue: 8,
            partner1: '美团',
            partner2: '饿了吗',
            partner3: '网易',
            invoiceAmount: 1,
            unpaidAmount: 500,
            cash: 2,
            weChat: 567,
            creditCard: 877,
            aliPay: 1405,
            transfer: 4557,
            otherPayment: 54,
            paymentCombined: 566625,
        },

        {
            key: 9,
            partner3:  '核对人:',
            bank2: '制单人:',
            aliServiceCharge: '结算区间',
            ServiceChargeThird: '2019-10-09 --2019-10-08',
        }


    ]


    export default {
        data() {
            return {
                data,
                columns,
                searchForm: {
                    name: '',
                    timeRange: [],
                },
                pagination: {
                    pageSize: 15, // 默认每页显示数量
                    defaultPageSize: 15,

                },
            }
        },
        methods:{
            fliterQuery(){

            },
            handleReset(){

            },
            fresh(){

            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            export2Excel() {
                let that = this;
                require.ensure([], () => {
                    //这里的require的路径要写对，不然运行会有错误
                    const {export_json_to_excel} = require('@/vendor/Export2ExcelEX');
                    let tHeader = [];
                    let filterVal = [];
                    that.columns[0].children.forEach((item, index) => {
                        if (item.children === undefined) {
                            tHeader.push(item.title);
                            filterVal.push(item.dataIndex)
                        } else {
                            item.children.forEach((item, index) => {
                                tHeader.push(item.title);
                                filterVal.push(item.dataIndex)
                            })
                        }

                    })
                    const list = []
                    that.data.forEach((item,index) => {
                        if (item.children === undefined) {
                            list.push(item)
                        } else {
                            list.push(item)
                            item.children.forEach((item, index) => {
                                list.push(item)
                            })
                        }
                    })
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '对账单');
                })
            }
        }
    }
</script>

<style scoped>
    .a-layout-content {
        width: 100%;
        overflow-x: auto;
    }
    .table-layout.ant-layout-content{
        padding:  0 0.25rem ;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .ant-table-thead > tr{
        background: rgba(220, 220, 220, 1);
        color: #616467;
        font-size: 0.16rem;
    }
   .ant-table-tbody > tr{
        background: #ffff;
    }
    .exportExcel{
        width: 0.9rem;
        height: 0.4rem;
        background: #409EFF;
        color: #fff;
        font-size: 0.18rem;
        display: inline-block;
        width: 0.9rem;
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        cursor: pointer;
        border-left: 1px solid #ddd;
    }
</style>