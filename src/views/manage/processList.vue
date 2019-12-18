<template>
    <div class="wrap">
        <a-layout-header class="head">
            <div class="search-form-wrap">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item :label="'流程类型'">
                        <!--0 代办 1我发起的流程 2 历史流程-->
                        <a-select defaultValue="0" style="width: 120px" v-model="searchForm.type">
                            <a-select-option value="0">待办流程</a-select-option>
                            <a-select-option value="1">我发起的流程</a-select-option>
                            <a-select-option value="2">历史流程</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'流程名称'">
                        <a-input v-model="searchForm.name" placeholder="关键字"/>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="handleSearch">确定</a-button>
                        <a-button type="primary" @click="reset">重置</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-layout-header>
        <div class="table-wrap table-layout" style="padding: 0  0.42rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
            <a-table :columns="columns" :dataSource="data" :pagination="pagination"
                     :loading="loading">
                                <span slot="process" slot-scope="process,record">
                  <a-tag color="blue" v-if="process !==''" @click="() => checkProcess(record.key)">{{process}}</a-tag>
                             </span>
                <template slot="operation" slot-scope="text, record">
                    <div class="editable-row-operations">
                <span class="deal-option-span">
                      <a @click="() => deal(record)"> <i class="deal-icon"></i>  <i>处理</i></a>

                    </span>
                    </div>
                </template>
            </a-table>
        </div>
        <!--查看流程-->
        <process ref="process"></process>
        <!--处理资质流程-->
        <deal-qualification ref="dealQualification" v-on:fetchAgan="fetchAgan"></deal-qualification>
        <deal-good ref="dealGood" v-on:fetchAgan="fetchAgan"></deal-good>
        <!--处理删除流程-->
        <a-modal
                title="删除资质"
                :visible="deleteQualificationVisible"
                @ok="deleteQualification"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
                okText="通过"
                cancelText="取消"

        >
            <p style="width: 100%;text-align: center;font-family: 微软雅黑;color:#000;font-size: 16px;">允许删除本条资质信息</p>
        </a-modal>
        <!--处理活动-->
        <deal-activity ref="dealActivity" v-on:fetchAgan="fetchAgan"></deal-activity>
        <!--处理活动报名-->
        <good-registration-details ref="goodRegistrationDetails" v-on:fetchAgan="fetchAgan"></good-registration-details>
    </div>
</template>

<script>
    import fetch from '@/common/fetch'
    import axios from 'axios'
    import process from './process'
    import dealQualification from "@/components/dealQualificationProcess"
    import dealGood from "@/components/dealGoodProcess"
    import dealActivity from '@/components/dealActivity'
    import goodRegistrationDetails from '@/components/goodRegistrationDetails'
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {message} from 'ant-design-vue'

    const columns = [
        {
            title: '流程编号',
            dataIndex: 'key',
            scopedSlots: {customRender: 'key'}
        },
        {
            title: '流程名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'}
        },
        {
            title: '流程发起人',
            dataIndex: 'owner',
            scopedSlots: {customRender: 'owner'}
        },
        {
            title: '流程发起时间',
            dataIndex: 'time',
            scopedSlots: {customRender: 'time'}
        },
        {
            title: '当前处理人',
            dataIndex: 'node',
            scopedSlots: {customRender: 'node'}
        }, {
            title: '流程',
            dataIndex: 'process',
            scopedSlots: {customRender: 'process'}
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
                searchForm: {
                    type: '0',
                    name: '',
                    current: 1,
                    size: 8

                },
                data: [],
                columns,
                loading: true,

                matchQualificationArray: [],
                size: '5',
                confirmLoading: false,
                deleteQualificationVisible: false,
                processId: ''
            }
        },
        components: {
            process, dealQualification, dealGood, dealActivity, goodRegistrationDetails
        },
        mounted() {
            this.getProcessList();


        },
        methods: {

            handleSearch() {
                this.getProcessList()
            },
            fresh(){
                this.getProcessList()
            },
            reset() {
                this.searchForm = {
                    type: '0',
                    name: '',
                    current: 1,
                    size: 8
                }
            },
            checkProcess(key) {
                console.log(key);
                this.$refs.process.setVisible(true);
                this.$refs.process.setprocessimg(key);
                axios.get('/runtime/process-instances/' + key).then((response) => {
                    console.log(response.data) //请求的返回体
                    this.$refs.process.setprocessList(response.data)
                }).catch((error) => {
                    console.log(error);//异常
                });
            },
            //退出删除资质流程
            handleCancel() {
                this.deleteQualificationVisible = false;
            },
            //处理删除资质的流程
            deleteQualification() {
                this.confirmLoading = true;
                fetch.put('/flowable/' + this.processId, {result: '同意'}).then((res) => {
                    console.log(res);
                    message.info(res.msg);
                    this.confirmLoading = false;
                    this.deleteQualificationVisible = false;
                    this.getProcessList()
                })
            },
            deal(recode) {
                console.log(recode);
                let key = recode.dealId;
                let type = recode.name;
                switch (type) {
                    case "商品审核":
                        /**
                         * 先获取流程详情 判断是否为删除流程
                         */
                        fetch.get('/flowable/variable?id=' + key).then(res => {
                            console.log(res.obj);
                            let recodes = res.obj
                            if (recodes.name) {
                                this.$refs.dealGood.setdealGoodProcessVisible(true);
                                //取出资质列表匹配 商品类型
                                fetch.get('/aptitude/table?size=100&current=0').then(res => {
                                    let aptitudeRecodes = res.obj.records;
                                    let optionArray = [];
                                    aptitudeRecodes.forEach((item) => {
                                        let optionJson = {};
                                        optionJson['value'] = item.id;
                                        optionJson['label'] = item.name;
                                        optionJson['key'] = item.type;
                                        optionArray.push(optionJson)
                                    });
                                    console.log(optionArray);

                                    this.matchQualificationArray = optionArray;


                                    fetch.get('/flowable/variable?id=' + key).then(responce => {
                                        let Json = responce.obj;
                                        console.log(Json);
                                        //通过资质数组，匹配资质类型 匹配商品类型
                                        let matchQualificationArray = this.matchQualificationArray;
                                        let matchItem = matchQualificationArray.filter(function (item) {
                                            return item.value === Json.aptitudeId;
                                        });
                                        console.log((matchItem[0].key + ''));
                                        this.$refs.dealGood.setType((matchItem[0].key + '')).then(val => {
                                            debugger
                                            if (matchItem[0].key === 1) {
                                                this.$refs.dealGood.$refs.dealRoom.setprocessId(key);
                                                this.$refs.dealGood.$refs.dealRoom.getDetail(key)
                                            } else if (matchItem[0].key === 2) {
                                                this.$refs.dealGood.$refs.dealTicket.setprocessId(key);
                                                this.$refs.dealGood.$refs.dealTicket.getDetail(key)
                                            }
                                        })
                                    })

                                })
                            } else {
                                //    为删除流程
                                this.processId = key;
                                this.deleteQualificationVisible = true;
                            }

                        })
                        break;
                    case"资质审核":
                        fetch.get('/flowable/variable?id=' + key).then(res => {
                            console.log(res.obj);
                            let recodes = res.obj
                            if (recodes.name) {
                                this.$refs.dealQualification.setdealQualificationProcessShow(true);

                                console.log(res);
                                let Json = res.obj;
                                this.$refs.dealQualification.setType(Json.type + '').then(res => {
                                    switch (Json.type) {
                                        case 1:
                                            this.$refs.dealQualification.$refs.dealHotel.setprocessId(key);
                                            this.$refs.dealQualification.$refs.dealHotel.getDetail(key);
                                            break;
                                        case 2:
                                            this.$refs.dealQualification.$refs.dealView.setprocessId(key);
                                            this.$refs.dealQualification.$refs.dealView.getDetail(key);
                                            break
                                    }
                                })
                            } else {
                                //    为删除流程
                                this.processId = key;
                                this.deleteQualificationVisible = true;
                            }
                        })
                        break;
                    case  '活动审核':

                        fetch.get('/flowable/variable?id=' + key).then(res => {
                            let record = res.obj;
                            if (record.productIdList !== '' && record.productIdList.length > 0) {
                                this.$refs.goodRegistrationDetails.setGoodArray(record.productIdList)
                                this.$refs.goodRegistrationDetails.setGoodRegistrationDetailsShow(true);
                                this.$refs.goodRegistrationDetails.getDetail(record.activityId);
                                this.$refs.goodRegistrationDetails.setprocessId(key)
                            } else {
                                this.$refs.dealActivity.setprocessId(key);
                                this.$refs.dealActivity.setdealActivityShow(true);
                                this.$refs.dealActivity.getDetail(key);
                            }

                        });
                        break;
                }


            },
            /**
             * get processList
             */
            getProcessList() {
                let processType = this.searchForm.type;
                let requestUrl;
                switch (processType) {
                    case '1':
                        requestUrl = '/flowable/owner';
                        break;
                    case '2':
                        break;
                    default:
                        requestUrl = '/flowable/';

                }
                ;
                fetch.get(requestUrl).then(res => {
                    console.log(res);
                    let array = res.obj;
                    let tableData = [];
                    this.loading = false
                    array.forEach((item) => {
                        let dataJson = {};
                        dataJson['key'] = item.instanceId;
                        dataJson['name'] = item.name;
                        dataJson['node'] = item.assignee
                        dataJson['process'] = '查看流程';
                        dataJson['owner'] = item.owner;
                        dataJson['dealId'] = item.id;
                        dataJson['time'] = item.createTime

                        tableData.push(dataJson);

                    })
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
</style>