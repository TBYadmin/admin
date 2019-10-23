<template>
    <div class="wrap">
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap sale-search-form-wrap">
                    <a-form layout="inline">
                        <a-form-item label="营业点名:">
                            <a-input v-model="searchForm.name"/>
                        </a-form-item>

                        <a-form-item label="结算日期:">
                            <a-range-picker v-model="searchForm.timeRange"/>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fliterQuery">查询</a-button>
                            <a-button type="primary" @click="handleReset">重置</a-button>
                            <span class="exportExcel" @click="export2Excel"> <i
                                    class="iconfont icon-xiazai"></i>导出</span>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-layout-header>
            <a-layout-content class="table-layout" style="padding:  0 0.25rem ;">

                    <a-table
                            :columns="columns"
                            :dataSource="data"
                            bordered
                            size="middle"
                            :scroll="{ x: '130%', y:0 }"
                            :pagination="pagination"
                    />

            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
    const columns = [
        {
            title: '营业点收入人数统计表',
            children: [
                {
                    title: '收款方式',
                    dataIndex: 'paymentMethods',
                    key: 'paymentMethods',
                    width: 100,
                    filters: [{
                        text: '现金收入',
                        value: '现金收入',
                    }, {
                        text: '微信收入',
                        value: '微信收入',
                    }],
                    onFilter: (value, record) => record.paymentMethods.indexOf(value) === 0,
                },
                {
                    title: '站点1',
                    dataIndex: 'site1',
                    key: 'site1',
                    width: 80,
                },
                {
                    title: '站点2',
                    dataIndex: 'site2',
                    key: 'site2',
                    width: 80,
                },
                {
                    title: '站点3',
                    dataIndex: 'site3',
                    key: 'site3',
                    width: 80,
                },
                {
                    title: '站点4',
                    dataIndex: 'site4',
                    key: 'site4',
                    width: 80,
                },
                {
                    title: '自助1',
                    dataIndex: 'selfHelp1',
                    key: 'selfHelp1',
                    width: 80,
                },
                {
                    title: '自助2',
                    dataIndex: 'selfHelp2',
                    key: 'selfHelp2',
                    width: 80,
                },
                {
                    title: '累计数',
                    dataIndex: 'accumulative',
                    key: 'accumulative',
                    width: 80,
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    key: 'note',
                    width: 80,
                },
            ]

        }];

    const data = [
        {
            key:1,
            paymentMethods:'现金收入',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:10,
            paymentMethods:'微信收入',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:2,
            paymentMethods:'刷卡收入',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:3,
            paymentMethods:'支付宝收入',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:4,
            paymentMethods:'转账收入',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:5,
            paymentMethods:'签单收入（挂账）',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:6,
            paymentMethods:'收入合计',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无'
        },
        {
            key:7,
            paymentMethods:'门票种类（金额）',
            site1:147,
            site2:147,
            site3:24,
            site4:25,
            selfHelp1:231,
            selfHelp1:231,
            accumulative:6654,
            note:'无',
            children:[
                {
                    key:8,
                    paymentMethods:'成人票',
                    site1:147,
                    site2:147,
                    site3:24,
                    site4:25,
                    selfHelp1:231,
                    selfHelp1:231,
                    accumulative:6654,
                    note:'无',
                },
                {
                    key:9,
                    paymentMethods:'儿童票',
                    site1:14,
                    site2:19,
                    site3:35,
                    site4:20,
                    selfHelp1:150,
                    selfHelp1:25,
                    accumulative:356,
                    note:'无',
                },
                {
                    key:99999,
                    site2:'核对人',
                    site2:'制表人',

                }
            ]
        }
    ];


    export default {
        name: "siteRevenueNumber",
        data() {
            return {
                data,
                columns,
                pagination: {
                    pageSize:10, // 默认每页显示数量
                    defaultPageSize:10,

                },
                searchForm: {
                    name: '',
                    timeRange: [],
                },
            }
        },
        methods:{
            fliterQuery() {

            },
            handleReset() {
                this.searchForm = {
                    name: '',
                    timeRange: [],
                }
            },
            fresh() {

            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            export2Excel() {
                let that = this;
                require.ensure([], () => {
                    //这里的require的路径要写对，不然运行会有错误
                    const {export_json_to_excel_site} = require('@/vendor/Export2ExcelEX');
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
                    that.data.forEach((item, index) => {
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
                    if(that.searchForm.timeRange.length>0){
                        export_json_to_excel_site(tHeader, data,moment(that.searchForm.timeRange[0]).format('YYYY-MM-DD')+'至'+ moment(that.searchForm.timeRange[1]).format('YYYY-MM-DD')+'营业点收入人数统计表');
                    }else{
                        export_json_to_excel_site(tHeader, data, '营业点收入人数统计表');
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>