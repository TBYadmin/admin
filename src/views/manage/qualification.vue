<template>
    <a-layout>
        <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit">
            <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
                <template v-if="pane.key == 1">
                    <!-- 资质管理 -->
                    <a-layout>
                        <a-layout-header class="head">
                            <a-form :form="searchForm"  layout="inline">
                                <a-form-item :label="'资质类型'">
                                    <a-select v-model="filterForm.type" :defaultValue="filterForm.type">
                                        <a-select-option value="0">所有资质</a-select-option>
                                        <a-select-option value="1">景区</a-select-option>
                                        <a-select-option value="2">酒店</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item :label="'资质名称'">
                                    <a-input v-model="filterForm.name" placeholder="关键字"/>
                                </a-form-item>
                                <a-button type="primary" @click="fliterQuery">查询</a-button>
                                <a-button type="primary" @click="handleReset">重置</a-button>
                            </a-form>
                        </a-layout-header>
                        <a-layout-content>
                            <div>
                                <a-button type="primary" @click="add">新增资质</a-button>
                            </div>
                            <a-table :columns="columns" :dataSource="data"
                                     :loading="loading" :pagination="pagination">
                                <span slot="process" slot-scope="process,record"  >
                  <a-tag  color="blue"      v-if="process !==''"  @click="() => checkProcess(record)">{{process}}</a-tag>
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
                      <a @click="() => edit(record.key)">修改</a>
                      <br>
                      <a @click="() => deleteItem(record.key)">删除</a>
                    </span>
                                    </div>
                                </template>
                            </a-table>
                            <a-pagination @change="pageChange" :current="filterForm.page" :total="total"
                                          :pageSize="filterForm.size"/>
                        </a-layout-content>
                    </a-layout>
                </template>
                <template  v-else >
                    <!-- 新增资质 -->
                    <a-form :form="formaddqualification.form">
                        <a-form-item :label="'资质类型'">
                            <a-select v-decorator="formaddqualification.type" :disabled="selctDisabled">
                                <a-select-option value="1">酒店</a-select-option>
                                <a-select-option value="2">景区</a-select-option>
                                <!--<a-select-option value="2">餐饮</a-select-option>-->
                            </a-select>
                        </a-form-item>
                        <a-form-item :label="'资质名称'">
                            <a-input v-decorator="formaddqualification.name" placeholder="关键字"/>
                        </a-form-item>
                        <a-form-item :label="'资质描述'">
                            <a-input v-decorator="formaddqualification.description" placeholder="请输入资质描述"/>
                        </a-form-item>
                        <a-form-item :label="'基础设施'">
                            <a-input v-decorator="formaddqualification.facilities" placeholder="请输入资质配备设施"/>
                        </a-form-item>
                        <a-form-item :label="'联系电话'">
                            <a-input v-decorator="formaddqualification.phone" placeholder="联系电话"/>
                        </a-form-item>
                        <a-form-item :label="'上传资质文件'" >
                            <a-upload   v-decorator="formaddqualification.imgsList"
                                    :action='action'
                                    listType="picture-card"
                                    @preview="handlePreview"
                                        :fileList="fileList"
                                    @change="handleChangePic"
                                    :remove='removePic'
                                    multiple
                            >
                                <div v-if="fileList.length < 3">
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">Upload</div>
                                </div>
                            </a-upload>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage">
                            </a-modal>
                        </a-form-item>
                        <a-form-item :label="'注册地址'">
                            <a-input v-decorator=formaddqualification.address placeholder="请输入地址"/>
                        </a-form-item>

                        <a-form-item>
                            <a-button type="primary" @click="submitQualification">提交</a-button>
                            <a-button type="primary" @click="remove(pane.key)">取消</a-button>
                        </a-form-item>
                    </a-form>
                </template>
                <process v-else-if="pane.key ==2" ></process>
                <!--model-->
                <a-modal title="查看流程" v-model="processVisible" @cancel="handleCancel" cancelText="取消" okText="确认" @ok="handleOk">
                   <div class="process-wrap">
                       <div class="process-img-wrap">
                           <img src="" alt="">
                       </div>
                       <div  class="">

                       </div>
                   </div>
                </a-modal>
                <!--model结束-->
            </a-tab-pane>
        </a-tabs>
    </a-layout>
</template>
<script>
    import {mapState, mapGetters} from 'vuex'
    // import Utils from '@/common/utils'
    import Config from '@/config/api'
    import fetch from '@/common/fetch'
    import axios from 'axios'
    import  process from './process'

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

        //     {
        //     title: '注册时间',
        //     dataIndex: 'date',
        //     scopedSlots: {customRender: 'date'}
        // },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }]
    const data = []
    export default {
        name: 'qualification',
        components:{
            process
        },
        data() {
            const panes = [
                {title: '资质管理', content: '', key: '1'}
            ]
            this.cacheData = data.map(item => ({...item}))
            return {
                filterForm: {
                    type: "0",
                    name: '',
                    page: 1,
                    size: 8
                },
                action: Config.getBaseUrl() + '/maintenance/qiniu',
                header: {},
                loading: true,
                pagination: false,
                total: 9,
                data,
                columns,
                activeKey: panes[0].key,
                panes,
                newTabIndex: 0,
                searchForm: this.$form.createForm(this),
                formaddqualification:{
                    form: this.$form.createForm(this),
                    type: [
                        `type`,
                        {
                            rules: [{
                                required: true,
                                message: '请选择资质类型',
                            }],
                        initialValue: '1'
                        }
                    ],
                   name: [
                        `name`,
                        {
                            rules: [{
                                required: true,
                                message: '资质名称',
                            }],
                        }
                    ],
                    description: [
                        `description`,
                        {
                            rules: [{
                                required: true,
                                message: '资质描述',
                            }],
                        }
                    ],
                    facilities: [
                        `facilities`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入基础设施名称',
                            }],
                        }
                    ],
                    phone: [
                        `phone`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入正确联系电话',
                                len:11
                            }],
                        }
                    ],
                    address: [
                        `address`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入联系地址',

                            }],
                        }
                    ],
                    imgsList: [
                        `imgsList`,

                    ],

                },
                selctDisabled:false,
                previewVisible: false,
                previewImage: '',
                fileList: [],
                qualificationId:'',
                processVisible:false
            }
        },
        computed: mapState({
            defaultSelectedKey: state => state.userCenterActiveKey,
            UserInfo: state => state.userInfo,
        }),
        watch: {
            filterForm: {
                handler: function (newValue, oldValue) {
                    // this.getqualification();
                },
                immediate: true,
                deep: true
            },
        },
        mounted() {
            this.getqualification();
        },
        methods: {
            fliterQuery() {
                this.getqualification()
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
            handleSearch(e) {
                e.preventDefault()
                this.searchForm.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values)
                        this.$store.dispatch('qualification/getQualificationList', values)
                    }
                })
            },
            handleChange(value, key, column) {
                const newData = [...this.data]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target[column] = value
                    this.data = newData
                }
            },
            edit(key) {
                const panes = this.panes
                const activeKey = `修改${this.newTabIndex++}`
                panes.push({title: `修改资质`, content: `Content of new Tab ${activeKey}`, key: activeKey})
                this.panes = panes;
                this.activeKey = activeKey;
                //修改资质
                this.qualificationId=key;
                fetch.get('/aptitude/table/' + key ).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    let qiuNiu = this.$store.state.qualification.qiNiuLink
                    this.formaddqualification.form.setFieldsValue(
                        {
                            ['type']: Json.type.toString(),
                            ['name']: Json.name,
                            ['address']: Json.address,
                            ['description']: Json.description,
                            ['phone']: Json.phone,
                            ['facilities']: Json.facilities,
                        }
                    )
                    let imgArray = [
                        {
                            status: "done",
                            name: Json.cover,
                            uid: '-1',
                            url: qiuNiu + '/' + Json.cover,
                            thumbUrl:  qiuNiu + '/' + Json.cover,
                        },
                    ];
                    this.fileList = imgArray;
                    this.selctDisabled=true
                })
            },

            deleteItem(key) {
                fetch.delete("/aptitude/table/" + key ).then(res => {
                    console.log(res)
                    this.getqualification()
                })
            },
            add() {
                const panes = this.panes
                const activeKey = `新增${this.newTabIndex++}`
                panes.push({
                    title: `新增资质`,
                    content: `Content of new Tab ${activeKey}`,
                    key: activeKey
                });
                panes.closable=true
                this.panes = panes
                this.activeKey = activeKey
                this.qualificationId='';
                this.fileList=[];
                this.selctDisabled=false
            },
            remove(targetKey) {
                let activeKey = this.activeKey
                let lastIndex
                this.panes.forEach((pane, i) => {
                    if (pane.key === targetKey) {
                        lastIndex = i - 1
                    }
                })
                const panes = this.panes.filter(pane => pane.key !== targetKey)
                if (lastIndex >= 0 && activeKey === targetKey) {
                    activeKey = panes[lastIndex].key
                }
                this.panes = panes
                this.activeKey = activeKey;
                this.qualificationId=''
            },
            handleOk() {
                this.previewVisible = false
            },
            handleCancel(){
                this.previewVisible = false
            },
            handlePreview(file) {
                console.log('handle preview file')
                console.log(file)
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            handleChangePic({fileList,file}) {
                console.log(fileList);
                this.fileList = fileList;
            },
            removePic (file) {
                console.log(file.response.obj[0].key)
                if(file.name !==undefined){
                    fetch.delete(this.action +'/'+ file.name, '')
                        .then(res => console.log(res))
                }else{
                    fetch.delete(this.action +'/'+file.response.obj[0].key)
                        .then(res => console.log(res))
                }

                console.log(file)
            },
            onEdit (targetKey, action) {
                this[action](targetKey)
            },
            /**
             * 获取资质分页
             */
            getqualification() {
                let queryObeject = this.filterForm;
                if (queryObeject.type == '0') {
                    queryObeject['type'] = ''
                }
                fetch.get(Config.getBaseUrl() + '/aptitude/table?size=' + queryObeject.size + '&current=' + queryObeject.page + '&name=' + queryObeject.name + '&type=' + queryObeject.type ).then(res => {
                    let recodeArray = res.obj.records;
                    this.total = parseInt(res.obj.total);
                    console.log(this.total)
                    console.log(recodeArray)
                    let tableData = [];
                    recodeArray.forEach((item) => {
                        let dataJson = {};
                        dataJson['key'] = item.id;
                        dataJson['name'] = item.name;
                        dataJson['process'] = item.lockFlow==0? '':'查看流程';
                        dataJson['processId'] = item.processId;
                        switch (item.ype) {
                            case '1':
                                dataJson['type'] = '酒店资质';
                                break;
                            default:
                                dataJson['type'] = '景区资质';

                                tableData.push(dataJson);
                        }
                    })
                    this.data = tableData
                    this.loading = false
                })
            },
            /**
             * 新增资质
             */
            submitQualification() {
                this.formaddqualification.form.validateFields((error, values) => {
                    if (error === null) {
                        console.log(values);
                        let parmas = values;
                        console.log(this.fileList);
                        let imgArray = this.fileList;
                        let imgKeyString = '';
                        for(let i=0;i<imgArray.length;i++){
                            if(imgArray[i].name !==undefined){
                                imgKeyString +=imgArray[i].name + ','
                            }else{
                                imgKeyString += imgArray[i].response.obj[0].key + ','
                            }
                        }
                        console.log(imgKeyString);
                        parmas['proveFile'] = imgKeyString.slice(0, imgKeyString.length - 1);
                        parmas['cover'] = this.fileList[0].name!==undefined ?this.fileList[0].name: this.fileList[0].response.obj[0].key;
                        alert(this.qualificationId);
                        if (this.qualificationId =='') {
                            switch (parmas.type) {
                                case '1':
                                    fetch.post(Config.getBaseUrl() + '/aptitude/hotel', parmas).then(res => {
                                        console.log(res);
                                        this.setEmptyForm();
                                    });
                                    break;
                                default:
                                    fetch.post(Config.getBaseUrl() + '/aptitude/scenic', parmas).then(res => {
                                        console.log(res);
                                        this.setEmptyForm();
                                    })
                            }
                        } else {
                            console.log(typeof (parmas.type))
                            switch (parmas.type) {
                                case '1':
                                    fetch.put(Config.getBaseUrl() + '/aptitude/hotel/'+this.qualificationId, parmas).then(res => {
                                        console.log(res);
                                        this.setEmptyForm();
                                    });
                                    break;
                                default:
                                    fetch.put(Config.getBaseUrl() + '/aptitude/scenic/'+this.qualificationId, parmas).then(res => {
                                        console.log(res);
                                        this.setEmptyForm();
                                    })
                            }
                        }
                    }
                })
            },
    //        提交完设置表单为空
            setEmptyForm(){
                this.formaddqualification.form.setFieldsValue(
                    {
                        ['type']: '0',
                        ['name']: '',
                        ['address']: '',
                        ['description']: '',
                        ['phone']: '',
                        ['facilities']: '',
                    }
                )
                this.fileList=[]
            }
    }
    }
</script>
<style scoped>

</style>
