<template>
    <div class="wrap">
        <!-- 商品管理 -->
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap">
                <a-form layout="inline">
                    <a-form-item :label="'商品类型'">
                        <a-select v-model="searchForm.mold" :defaultValue="searchForm.mold">
                            <a-select-option value="1">直售商品</a-select-option>
                            <a-select-option value="2">组合商品</a-select-option>
                            <a-select-option value="3">全部商品</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'商品名称'">
                        <a-input v-model="searchForm.name" placeholder="关键字"/>
                    </a-form-item>

                    <a-form-item :label="'上架状态'">
                        <a-select v-model="searchForm.state" :defaultValue="searchForm.state">
                            <a-select-option value="3">所有商品</a-select-option>
                            <a-select-option value="0">上架中</a-select-option>
                            <a-select-option value="1">已下架</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                    <a-button type="primary" html-type="submit" @click="handleSearch">查询</a-button>
                    <a-button type="primary" @click="resetSearchForm">重置</a-button>
                    </a-form-item>
                </a-form>
                </div>
                <div class="add-group-wrap">
                    <span @click="refesh" class="add-btn" style="margin-right: 0.5rem">刷新</span>
                    <span  @click="add" class="add-btn" > <i class=" icon iconfont icon-jia"></i>新增商品</span>
                </div>
            </a-layout-header>
            <a-layout-content  class="table-layout">

                <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination">
                       <span slot="process" slot-scope="process,record">
                  <a-tag color="blue" v-if="process !==''"
                         @click="() => checkProcess(record.processId)">{{process}}</a-tag>
    </span>
                    <template
                            slot-scope="text, record, index"
                            v-for="col in ['name', 'key', 'type','date','qualification']"
                            :slot="col"
                    >
                        <div :key="col">
                            <a-input
                                    v-if="record.editable"
                                    style="margin: -5px 0"
                                    :value="text"
                                    @change="e => handleChange(e.target.value, record.key, col)"
                            />
                            <template v-else>{{text}}</template>
                        </div>
                    </template>
                    <template slot="operation" slot-scope="text, record, index">
                        <div class="editable-row-operations">
                    <span>
                        <span class="option-wrap edit-option-wrap"  @click="() => edit(record)"> <i class="edit-i" ></i>属性</span>
                         <span class="option-wrap edit-option-wrap"  @click="() => editDetail(record)"> <i class="edit-i" ></i>详情</span>
                        <span class="option-wrap delete-option-wrap" @click="() => deleteItem(record.key)"> <i class="edit-i delete-i" ></i>删除</span>

                    </span>
                        </div>
                    </template>
                </a-table>
                <a-pagination @change="pageChange" :current="searchForm.current" :total="total"
                              :pageSize="searchForm.size"/>
            </a-layout-content>
        </a-layout>
        <!--模态框-->
        <add-good ref="addGood" v-on:fetchAgan="fetchAgan"></add-good>
        <!--修改商品详情-->
        <gooddetail-edit  ref="gooddetailEdit" v-on:fetchAgan="fetchAgan"></gooddetail-edit>
    </div>
</template>

<script>
    import addGood from '@/components/addGood'
    import  gooddetailEdit from '@/components/goodDetailEdit'
    import fetch from '@/common/fetch'
    import {message} from 'ant-design-vue'

    const columns =
        [
            {
                title: '商品类型',
                dataIndex: 'type',
                scopedSlots: {customRender: 'type'}
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                scopedSlots: {customRender: 'name'}
            }, {
            title: '关联资质',
            dataIndex: 'qualification',
            scopedSlots: {customRender: 'qualification'}
        },
            {
                title: '适用人数',
                dataIndex: 'personNumber',
                scopedSlots: {customRender: 'personNumber'}
            },
            {
                title: '流程',
                dataIndex: 'process',
                scopedSlots: {customRender: 'process'}
            },

            {
                title: '操作',
                dataIndex: 'operation',
                scopedSlots: {customRender: 'operation'}
            }]
    export default {
        name: "goodList",
        data() {
            return {
                searchForm: {
                    mold: '3',
                    name: '',
                    state: '0',
                    current: 1,
                    size: 10
                },
                pagination: false,
                columns,
                data: [],
                loading: true,
                total: 21,
                matchQualificationArray: []

            }
        },
        components: {
            addGood,gooddetailEdit
        },
        mounted() {
            this.getGoodRecode();

        },
        methods: {
            handleSearch(e) {
                this.getGoodRecode();

            },
            resetSearchForm() {
                this.searchForm = {
                    mold: '3',
                    name: '',
                    state: '0',
                    current: 1,
                    size: 8
                }

            },
            add() {
                this.$refs.addGood.setaddgoodModelShow(true);
                this.$store.commit('setvalidationState', true);
                this.$refs.addGood.title = '新增';
                this.$refs.addGood.settypeDisabled(false);
            },
            pageChange(current) {
                this.searchForm.current = current;
                this.getGoodRecode()
            },
            refesh(){
                this.getGoodRecode()
            },
            edit(record) {
                this.$store.commit('setvalidationState', false);
                //设置子组件商品Id
                // console.log(key);
                fetch.get('/aptitude/table?size=10&current=0').then(res => {
                    let recodes = res.obj.records;
                    // this.$refs.replaceGood.setcontrast(res.obj.records);
                    let optionArray = [];
                    recodes.forEach((item) => {
                        let optionJson = {};
                        optionJson['value'] = item.id;
                        optionJson['label'] = item.name;
                        optionJson['key'] = item.type;
                        optionArray.push(optionJson)
                    });
                    console.log(optionArray);
                    this.matchQualificationArray = optionArray
                    this.$refs.addGood.setaddgoodModelShow(true);
                    this.$refs.addGood.title = '修改商品';
                    this.$refs.addGood.settypeDisabled(true);
                })
                fetch.get('/product/table/' + record.key).then(res => {
                    let qiuNiu = this.$store.state.qiNiuLink;
                    let Json = res.obj;
                    console.log(Json);
                    //通过资质数组，匹配资质类型 匹配商品类型
                    let matchItem = this.matchQualificationArray.filter(function (item) {
                        return item.value == Json.aptitudeId;
                    });
                    // console.log(matchItem)

                    let goodType = matchItem[0].key + '';
                    // console.log(goodType)
                    //设置商品类型 匹配展示商品信息组件
                    this.$refs.addGood.type = goodType;
                    console.log(goodType);
                    let that=this;
                    setTimeout(function(){

                        // debugger
                        switch (goodType) {
                            case '1':
                                that.$refs.addGood.$refs.addGoodHotel.setGoodId(record.key);
                                that.$refs.addGood.$refs.addGoodHotel.echoGood();
                                break;
                            case '2':
                                that.$refs.addGood.$refs.addGoodTicket.setGoodId(record.key);
                                that.$refs.addGood.$refs.addGoodTicket.echoGood();
                                break;

                        }
                    },500)

                })

            },
            editDetail(record){
                this.$refs.gooddetailEdit.seteditgoodDetail(true)
            },
            deleteItem(key) {
                fetch.delete('/product/table/' + key,{}).then((res) => {
                    message.info('删除记录成功')
                })

            },
            fetchAgan() {
                this.getGoodRecode();
            },
            checkProcess(processID) {
                console.log(processID)
            },
            /**
             * 获取分页数据
             */
            getGoodRecode() {
                let queryObeject = this.searchForm;
                //商品类型
                let mold;
                if (queryObeject.mold == '3') {
                    mold = ''
                } else {
                    mold = queryObeject.mold
                }
                let state;
                if (queryObeject.state == '3') {
                    state = ''
                } else {
                    state = queryObeject.state
                }
                let requestUrl;
                if(state==''){
                    requestUrl='/product/table?size=' + queryObeject.size + '&current=' + queryObeject.current + '&name=' + queryObeject.name + '&mold=' + mold
                }else{
                    requestUrl= '/product/table?size=' + queryObeject.size + '&current=' + queryObeject.current + '&name=' + queryObeject.name + '&state=' + parseInt(state)+ '&mold=' + mold
                }
                fetch.get(requestUrl).then(res => {
                    let recodeArray = res.obj.records;
                    this.total = parseInt(res.obj.total);
                    console.log(recodeArray)
                    let tableData = [];
                    recodeArray.forEach((item) => {
                        let dataJson = {};
                        dataJson['key'] = item.id;
                        dataJson['name'] = item.name;
                        dataJson['type'] = item.mold == 1 ? '直售商品' : item.mold == 2 ? "组合商品" : '全部商品';
                        dataJson['process'] = item.lockFlow == 0 ? '' : '查看流程';
                        dataJson['processId'] = item.processId;
                        dataJson['qualification'] = item.aptitudeId;
                        dataJson['personNumber'] = item.personNumber;
                        tableData.push(dataJson);
                    })
                    this.data = tableData;
                    this.loading = false

                })

            }
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }




    th, td {
        text-align: center;
    }

    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        text-align: center;
    }

    .ant-table-body {
        min-height: 400px;
    }

</style>