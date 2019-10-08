<template>
    <div class="wrap">
        <!-- 资质管理 -->
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap">
                    <a-form :form="filterForm.form" layout="inline">
                        <a-form-item :label="'查询日期'">
                            <a-date-picker @change="onChange" v-model="filterForm.date" :format="dateFormat"/>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fliterQuery">查询</a-button>
                            <a-button type="primary" @click="handleReset">重置</a-button>
                        </a-form-item>


                    </a-form>
                </div>

            </a-layout-header>
            <a-layout-content class="table-layout">
                <!--筛选列-->
                <div class="fliter-column-wrap">
                    <a-dropdown>
                        <span class="ant-dropdown-link">
                          <i class="iconfont icon-shitu icon"></i>  视图
                        </span>
                        <a-menu slot="overlay" class="view-menu">
                            <a-menu-item v-for="(item,index) in columnsData">
                                <div class="choose-item">
                                    <a-checkbox :checked="item.selected" @click="chooseItem(item,index)">
                                        {{item.columnsDiscribe.title}}
                                    </a-checkbox>
                                </div>
                            </a-menu-item>

                        </a-menu>
                    </a-dropdown>
                    <span class="exportExcel" @click="export2Excel"> <i class="iconfont icon-xiazai"></i>导出</span>
                </div>
                <a-table :columns="columns" :dataSource="data"
                         :pagination="pagination">
                </a-table>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
    import moment from "moment";
    import 'moment/locale/zh-cn';
    moment.locale('zh-cn');
    export default {
        name: "reconciliation",
        data() {
            return {
                loading: false,
                dateFormat: 'YYYY/MM/DD',
                filterForm: {
                    form: this.$form.createForm(this),
                    date: moment(new Date()),
                    size: 9,
                    current: 0
                },
                data: [],
                columns: [],
                pagination: false,
                columnsData: [
                    {
                        selected: true,
                        columnsDiscribe: {
                            title: '商户订单号',
                            dataIndex: 'key',
                            scopedSlots: {customRender: 'key'}
                        }
                    },
                    {
                        selected: true,
                        columnsDiscribe: {
                            title: '商户号',
                            dataIndex: 'mchId',
                            scopedSlots: {customRender: 'mchId'}
                        }
                    },

                    {
                        selected: true,
                        columnsDiscribe: {
                            title: '付款银行',
                            dataIndex: 'bank',
                            scopedSlots: {customRender: 'bank'}
                        }
                    },
                    {
                        selected: true,
                        columnsDiscribe: {
                            title: '手续费',
                            dataIndex: 'commission',
                            scopedSlots: {customRender: 'commission'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '设备号',
                            dataIndex: 'deviceId',
                            scopedSlots: {customRender: 'deviceId'}
                        }
                    },
                    {
                        selected: true,
                        columnsDiscribe: {
                            title: '币种类型',
                            dataIndex: 'feeType',
                            scopedSlots: {customRender: 'feeType'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '应结订单金额',
                            dataIndex: 'finalPrice',
                            scopedSlots: {customRender: 'finalPrice'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '申请退款金额',
                            dataIndex: 'orderRefundPrice',
                            scopedSlots: {customRender: 'orderRefundPrice'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '费率备注',
                            dataIndex: 'other',
                            scopedSlots: {customRender: 'other'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '交易状态',
                            dataIndex: 'payResult',
                            scopedSlots: {customRender: 'payResult'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '交易时间',
                            dataIndex: 'payTime',
                            scopedSlots: {customRender: 'payTime'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '交易类型',
                            dataIndex: 'payType',
                            scopedSlots: {customRender: 'payType'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '订单金额',
                            dataIndex: 'price',
                            scopedSlots: {customRender: 'price'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '商户数据包',
                            dataIndex: 'productInfo',
                            scopedSlots: {customRender: 'productInfo'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '商品名称',
                            dataIndex: 'productName',
                            scopedSlots: {customRender: 'productName'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '公众账号ID',
                            dataIndex: 'publicId',
                            scopedSlots: {customRender: 'publicId'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '费率',
                            dataIndex: 'rate',
                            scopedSlots: {customRender: 'rate'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '商户退款单号',
                            dataIndex: 'refundId',
                            scopedSlots: {customRender: 'refundId'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '退款金额',
                            dataIndex: 'refundPrice',
                            scopedSlots: {customRender: 'refundPrice'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '退款类型',
                            dataIndex: 'refundType',
                            scopedSlots: {customRender: 'refundType'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '特约商户号',
                            dataIndex: 'spMchId',
                            scopedSlots: {customRender: 'spMchId'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '用户标识',
                            dataIndex: 'userTag',
                            scopedSlots: {customRender: 'userTag'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '代金券金额',
                            dataIndex: 'voucher',
                            scopedSlots: {customRender: 'voucher'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '充值券退款金额',
                            dataIndex: 'voucherRefundPrice',
                            scopedSlots: {customRender: 'voucherRefundPrice'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '微信订单号',
                            dataIndex: 'wxOrderId',
                            scopedSlots: {customRender: 'wxOrderId'}
                        }
                    },
                    {
                        selected: false,
                        columnsDiscribe: {
                            title: '微信退款单号',
                            dataIndex: 'wxRefundId',
                            scopedSlots: {customRender: 'wxRefundId'}
                        }
                    },


                ]
            }
        },
        mounted() {
            this.creatColumn()
        },
        methods: {
            onChange() {

            },
            fliterQuery() {

            },
            handleReset() {

            },
            chooseItem(it, ind) {
                it.selected = !it.selected;
                this.creatColumn();
            },
            /**
             * 创建列
             */
            creatColumn() {
                // debugger
                let creatColumnArray = [];
                this.columnsData.forEach((item, index) => {
                    if (item.selected) {
                        creatColumnArray.push(item.columnsDiscribe)
                    }
                });
                let dataArray = [
                    {
                        key: '1',
                        mchId: '商家id',
                        bank: '付款银行',
                        commission: "手续费",
                        deviceId: "设备号",
                        feeType: "货币种类",
                        finalPrice: "应结订单金额",
                        mchId: "商户号",
                        orderId: "商户订单号",
                        orderRefundPrice: "申请退款金额",
                        other: "费率备注",
                        payResult: "交易状态",
                        payTime: "﻿交易时间",
                        payType: "交易类型",
                        price: "订单金额",
                        productInfo: "商户数据包",
                        productName: "商品名称",
                        publicId: "公众账号ID",
                        rate: "费率",
                        refundId: "商户退款单号",
                        refundPrice: "退款金额",
                        refundType: "退款类型",
                        spMchId: "特约商户号",
                        userTag: "用户标识",
                        voucher: "代金券金额",
                        voucherRefundPrice: "充值券退款金额",
                        wxOrderId: "微信订单号",
                        wxRefundId: "微信退款单号"
                    },
                    {
                        key: '2',
                        mchId: '商家id',
                        bank: '付款银行',
                        commission: "手续费",
                        deviceId: "设备号",
                        feeType: "货币种类",
                        finalPrice: "应结订单金额",
                        mchId: "商户号",
                        orderId: "商户订单号",
                        orderRefundPrice: "申请退款金额",
                        other: "费率备注",
                        payResult: "交易状态",
                        payTime: "﻿交易时间",
                        payType: "交易类型",
                        price: "订单金额",
                        productInfo: "商户数据包",
                        productName: "商品名称",
                        publicId: "公众账号ID",
                        rate: "费率",
                        refundId: "商户退款单号",
                        refundPrice: "退款金额",
                        refundType: "退款类型",
                        spMchId: "特约商户号",
                        userTag: "用户标识",
                        voucher: "代金券金额",
                        voucherRefundPrice: "充值券退款金额",
                        wxOrderId: "微信订单号",
                        wxRefundId: "微信退款单号"
                    },
                    {
                        key: '3',
                        mchId: '商家id',
                        bank: '付款银行',
                        commission: "手续费",
                        deviceId: "设备号",
                        feeType: "货币种类",
                        finalPrice: "应结订单金额",
                        mchId: "商户号",
                        orderId: "商户订单号",
                        orderRefundPrice: "申请退款金额",
                        other: "费率备注",
                        payResult: "交易状态",
                        payTime: "﻿交易时间",
                        payType: "交易类型",
                        price: "订单金额",
                        productInfo: "商户数据包",
                        productName: "商品名称",
                        publicId: "公众账号ID",
                        rate: "费率",
                        refundId: "商户退款单号",
                        refundPrice: "退款金额",
                        refundType: "退款类型",
                        spMchId: "特约商户号",
                        userTag: "用户标识",
                        voucher: "代金券金额",
                        voucherRefundPrice: "充值券退款金额",
                        wxOrderId: "微信订单号",
                        wxRefundId: "微信退款单号"
                    },
                    {
                        key: '4',
                        mchId: '商家id',
                        bank: '付款银行',
                        commission: "手续费",
                        deviceId: "设备号",
                        feeType: "货币种类",
                        finalPrice: "应结订单金额",
                        mchId: "商户号",
                        orderId: "商户订单号",
                        orderRefundPrice: "申请退款金额",
                        other: "费率备注",
                        payResult: "交易状态",
                        payTime: "﻿交易时间",
                        payType: "交易类型",
                        price: "订单金额",
                        productInfo: "商户数据包",
                        productName: "商品名称",
                        publicId: "公众账号ID",
                        rate: "费率",
                        refundId: "商户退款单号",
                        refundPrice: "退款金额",
                        refundType: "退款类型",
                        spMchId: "特约商户号",
                        userTag: "用户标识",
                        voucher: "代金券金额",
                        voucherRefundPrice: "充值券退款金额",
                        wxOrderId: "微信订单号",
                        wxRefundId: "微信退款单号"
                    }, {
                        key: '5',
                        mchId: '商家id',
                        bank: '付款银行',
                        commission: "手续费",
                        deviceId: "设备号",
                        feeType: "货币种类",
                        finalPrice: "应结订单金额",
                        mchId: "商户号",
                        orderId: "商户订单号",
                        orderRefundPrice: "申请退款金额",
                        other: "费率备注",
                        payResult: "交易状态",
                        payTime: "﻿交易时间",
                        payType: "交易类型",
                        price: "订单金额",
                        productInfo: "商户数据包",
                        productName: "商品名称",
                        publicId: "公众账号ID",
                        rate: "费率",
                        refundId: "商户退款单号",
                        refundPrice: "退款金额",
                        refundType: "退款类型",
                        spMchId: "特约商户号",
                        userTag: "用户标识",
                        voucher: "代金券金额",
                        voucherRefundPrice: "充值券退款金额",
                        wxOrderId: "微信订单号",
                        wxRefundId: "微信退款单号"
                    },

                ];
                this.columns = creatColumnArray
                this.data = dataArray
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            export2Excel() {
                let that = this;
                require.ensure([], () => {
                    //这里的require的路径要写对，不然运行会有错误
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    let tHeader = [];
                    let filterVal = [];
                    that.columns.forEach((item, index) => {
                        tHeader.push(item.title);
                        filterVal.push(item.dataIndex)
                    })
                    const list = that.data;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '对账单');
                })
            }
        }
    }
</script>

<style scoped>
    .fliter-column-wrap {
        width: 100%;
        height: 0.4rem;
        padding-left: 50px;
        border: 1px solid transparent;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
    }

    .fliter-column-wrap .ant-dropdown-link {
        background: #409EFF;
        color: #fff;
        font-size: 0.18rem;
        display: inline-block;
        width: 0.9rem;
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        cursor: pointer;
        float: left;
    }

    .fliter-column-wrap  .iconfont {
        font-size: 0.15rem;
        margin-right: 0.05rem;
    }

    .exportExcel {
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
.view-menu{
    height: 6rem;
    overflow: auto;
}

</style>