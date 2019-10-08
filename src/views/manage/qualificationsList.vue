<template>
    <div class="wrap">
        <!-- 资质管理 -->
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap">
                <a-form :form="searchForm" layout="inline" >
                    <a-form-item :label="'资质类型'">
                        <a-select v-model="filterForm.type" :defaultValue="filterForm.type">
                            <a-select-option value="0">所有资质</a-select-option>
                            <a-select-option value="1">酒店</a-select-option>
                            <a-select-option value="2">景区</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'资质名称'">
                        <a-input v-model="filterForm.name" placeholder="关键字"/>
                    </a-form-item >
                    <a-form-item>
                        <a-button type="primary" @click="fliterQuery">查询</a-button>
                        <a-button type="primary" @click="handleReset">重置</a-button>
                    </a-form-item>


                </a-form>
                </div>
                <div class="add-group-wrap">
                    <span @click="refesh" class="add-btn" style="margin-right: 0.5rem">刷新</span>
                    <span @click="add" class="add-btn" > <i class=" icon iconfont icon-jia"></i> 新增资质</span>

                </div>
            </a-layout-header>
            <a-layout-content class="table-layout" >

                <a-table :columns="columns" :dataSource="data"
                         :loading="loading" :pagination="pagination">
                                <span slot="process" slot-scope="process,record">
                  <a-tag color="blue" v-if="process !==''"
                         @click="() => checkProcess(record.processId)">{{process}}</a-tag>
    </span>
                    <template slot="operation" slot-scope="text, record">
                        <div class="editable-row-operations">
                    <span v-if="record.editable">
                      <a @click="() => save(record.key)">Save</a>
                      <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
                        <a>Cancel</a>
                      </a-popconfirm>
                    </span>
                            <span v-else>
                               <span class="option-wrap edit-option-wrap" @click="() => edit(record.key,record.processId,record.lockFlow,record.qualificationType)" ><i class="edit-i" ></i> 编辑</span>
                                <span class="option-wrap delete-option-wrap" @click="() => deleteItem(record.key)"><i class="edit-i delete-i" ></i>删除</span>

                    </span>
                        </div>
                    </template>
                </a-table>
                <a-pagination @change="pageChange" :current="filterForm.page" :total="total"
                              :pageSize="filterForm.size"/>
            </a-layout-content>
        </a-layout>
        <!--新增资质弹窗-->
        <add-qualifications ref="addQualifications" v-on:fetchAgan="fetchAgan"></add-qualifications>
        <!--查看流程-->
        <process ref="process"></process>
    </div>
</template>

<script>
    // import Utils from '@/common/utils'
    import Config from '@/config/api'
    import fetch from '@/common/fetch'
    import axios from 'axios'
    import process from './process'
    import { message } from 'ant-design-vue'
    import addQualifications from '@/components/addQualifications'
    const columns = [
        {
            title: '编号',
            dataIndex: 'key',
            scopedSlots: {customRender: 'key'}
        },
        {
            title: '资质名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'}
        },
        {
            title: '资质类型',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'}
        }, {
            title: '流程',
            dataIndex: 'process',
            scopedSlots: {customRender: 'process'}
        },

        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }]
    const data = []
    export default {
        name: "qualificationsList",
        data() {
            return {
                searchForm: this.$form.createForm(this),
                filterForm: {
                    type: "0",
                    name: '',
                    page: 1,
                    size: 10
                },
                loading: true,
                pagination: false,
                total: 9,
                data,
                columns,
                addQualificationsModel: false
            }
        },
        components: {
            addQualifications,process
        },

        mounted() {
            this.getqualification();
        },
        methods: {
            fetchAgan() {
                this.getqualification();
            },
            fliterQuery() {
                this.getqualification();
            },
            handleReset() {
                this.filterForm = {
                    type: '0',
                    name: '',
                    page: 1,
                    size: 8
                }
            },
            pageChange(current) {
                this.filterForm.page = current;
                this.getqualification();
            },
            refesh(){
                this.getqualification();
            },
            add() {
                this.$refs.addQualifications.setAddModel(true);
                this.$refs.addQualifications.title='新增资质';
                this.$store.commit('setvalidationState',true)

            },
            edit(key, processId,lockFlow,qualificationType) {
                if (lockFlow == 0) {
                    this.$refs.addQualifications.setAddModel(true);
                    this.$refs.addQualifications.title='修改资质';
                    this.$store.commit('setvalidationState',false);
                        this.$refs.addQualifications.setType(qualificationType + "").then(res => {
                            switch (qualificationType) {
                                case 1:
                                    this.$refs.addQualifications.$refs.addQualificationsHotel.qualificationId=key;
                                    this.$refs.addQualifications.$refs.addQualificationsHotel.echoQualificationDetails();
                                    break;
                                case 2:
                                    this.$refs.addQualifications.$refs.addQualificationsView.qualificationId=key;
                                    this.$refs.addQualifications.$refs.addQualificationsView.echoQualificationDetails();
                                    break;
                            }

                            // let childFromDom;


                        }) ;

                } else {
                    message.error('本条数据已发起流程，禁止修改')
                }

            },
            /**
             * 查看流程
             * */
            checkProcess(id) {
                console.log(id)
                this.$refs.process.setVisible(true);
                this.$refs.process.setprocessimg(id);
                axios.get('/runtime/process-instances/' + id).then((response) => {
                    console.log(response.data) //请求的返回体
                    this.$refs.process.setprocessList(response.data)
                })
                    .catch((error) => {
                        console.log(error);//异常
                    });

            },

            /**
             * 单个删除
             * */
            deleteItem(key) {
                fetch.delete("/aptitude/table/" + key).then(res => {
                    console.log(res)
                    this.getqualification()
                })
            },
            /**
             * 获取资质分页
             */
            getqualification() {
                let queryObeject = this.filterForm;
                let qualificationsType;
                if (queryObeject.type == '0') {
                    qualificationsType = ''
                }else{
                    qualificationsType = queryObeject.type
                }
                fetch.get('/aptitude/table?size=' + queryObeject.size + '&current=' + queryObeject.page + '&name=' + queryObeject.name + '&type=' + qualificationsType).then(res => {
                    let recodeArray = res.obj.records;
                    this.total = parseInt(res.obj.total);
                    console.log(recodeArray)
                    let tableData = [];
                    recodeArray.forEach((item) => {
                        let dataJson = {};
                        dataJson['key'] = item.id;
                        dataJson['name'] = item.name;
                        dataJson['process'] = item.lockFlow == 0 ? '' : '查看流程';
                        dataJson['processId'] = item.processId;
                        dataJson['lockFlow'] = item.lockFlow;
                        dataJson['qualificationType'] = item.type;
                        switch (item.type) {
                            case 1:
                                dataJson['type'] = '酒店资质';
                                break;
                            default:
                                dataJson['type'] = '景区资质';
                        }
                        tableData.push(dataJson);
                    })
                    this.data = tableData
                    this.loading = false
                })
            },
        }
    }
</script>

<style scoped>
    @import "../../assets/userStyle.css";

    .wrap {
        width: 100%;
        height: 100%;
    }



    .ant-pagination {
        margin-top: 20px;
        text-align: right;
    }

    .ant-modal-body {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .ant-table-thead tr{
        background:rgba(220,220,220,1);
    }
    input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color:#A6A6A6;
        font-size: 0.18rem;
        font-family: 微软雅黑;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:red;
        font-family: 微软雅黑;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:#606266;
        font-family: 微软雅黑;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color:#606266;
        font-family: 微软雅黑;
    }


</style>