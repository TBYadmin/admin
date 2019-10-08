<template>
    <a-modal v-model="dealActivityShow" title="活动审核" @cancel="cancel" class="add-modal"  :footer="null" :width="modalWidth">
        <div class="wrap">
            <a-form :form="dealActivity.form"  >
                <a-form-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 8}" >
                    <a-input placeholder="输入活动名称" v-decorator="dealActivity.name"/>
                </a-form-item>
                <a-form-item label="活动描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}" >
                    <a-textarea placeholder="输入活动描述" col="5" row="15" v-decorator="dealActivity.description"  />
                </a-form-item>
                <a-form-item label="活动时间" :label-col="{ span: 4 }"   >
                    <a-range-picker :format="dateFormat" v-decorator="dealActivity.ActiveDate" :disabledDate="disabledDate"/>
                </a-form-item>

                <a-form-item label="报名时间" :label-col="{ span:4}"   >
                    <a-range-picker :format="dateFormat" v-decorator="dealActivity.enrollDate" :disabledDate="disabledDate"/>
                </a-form-item>

                <a-form-item label="活动标签" :label-col="{ span: 4 } "   :wrapper-col="{ span:8 }" >
                    <a-input placeholder="请输入活动标签" v-decorator="dealActivity.label"></a-input>
                </a-form-item>
                <a-form-item label="活动规则" :label-col="{ span: 4 } "   :wrapper-col="{ span:8 }" >
                    <a-input placeholder="请输入活动规则" v-decorator="dealActivity.rule"></a-input>
                </a-form-item>

                <a-form-item :label="'活动图片'" >
                    <a-upload   v-decorator="dealActivity.imgsList"
                                :action='action'
                                listType="picture-card"
                                @preview="handlePreview"
                                :fileList="fileList"
                                @change="handleChangePic"

                                multiple
                    >
                        <div v-if="uploadShow">
                            <a-icon type="plus"/>
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage">
                    </a-modal>
                </a-form-item>
                <!--<a-form-item label="活动链接" :label-col="{ span: 4 }" :wrapper-col="{ span:12}" v-decorator="dealActivity.link">-->
                <!--<a-input placeholder="输入活动链接"/>-->
                <!--</a-form-item>-->

                <a-form-item>
                    <a-button type="primary"  @click="pass">通过</a-button>
                    <a-button type="primary"  class="backGorundYellow"  @click="rejected">驳回</a-button>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script>
    import Config from '@/config/api'
    import fetch from '@/common/fetch'
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    moment.locale('zh-cn');
    import { message } from 'ant-design-vue'
    export default {
        name: "dealActivity",
        data(){
            return{
                modalWidth:'6rem',
                dateFormat:'YYYY-MM-DD',
                dealActivity:{
                    form: this.$form.createForm(this),
                    name: [`name`],
                    ActiveDate: [`ActiveDate`],
                    enrollDate:[`enrollDate`],
                    rule:[`rule`,],
                    label:[`label`],
                    imgsList: [`imgsList`],
                    description: [`description`],
                    // link : [
                    //     `link`,
                    //     {
                    //         rules: [{
                    //             required: true,
                    //             message: '请输入活动链接',
                    //         }],
                    //     }
                    // ],

                },
                previewVisible:false,
                previewImage:'',
                fileList:[],
                action: '/maintenance/qiniu',
                dealActivityShow:false,
                activityId:'',
                uploadShow:false,
                processId:'',

            }
        },
        mounted(){

        },
        methods:{
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

            cancel(){
                this.dealActivityShow=false
            },
            setdealActivityShow(val){
                this.dealActivityShow=val
            },
            setactivityId(val){
                this.activityId=val
            },
            disabledDate(current) {
                return current && current < moment().endOf('day');
            },
            setprocessId(val){
                this.processId=val
            },
            //根据传入的流程ID获取流程详情
            getDetail(key){
                let qiuNiu=this.$store.state.qiNiuLink
                fetch.get('/flowable/variable?id=' +key).then(res => {
                    console.log(res);
                    let Json=res.obj;
                    this.dealActivity.form.setFieldsValue({
                        ['name']: Json.name,
                        ['description']: Json.description,
                        ['rule']: Json.description,
                        ['ActiveDate']: [moment( parseInt(Json.beginDate)), moment(parseInt(Json.endDate))],
                        ['enrollDate']: [moment(parseInt(Json.enrollBegin)), moment(parseInt(Json.enrollEnd))],
                        ['label']: Json.label,
                    })
                    let imgArray = [];
                    let JsonImageArray = Json.banner.split(',');
                    console.log(JsonImageArray.length);
                    for (var i = 1; i <= JsonImageArray.length; i++) {
                        let imgJson = {};
                        imgJson['status'] = "done";
                        imgJson['name'] = JsonImageArray[i - 1];
                        imgJson['uid'] = (-i).toString();
                        imgJson['url'] = qiuNiu + '/' + JsonImageArray[i - 1];
                        imgJson['thumbUrl'] = qiuNiu + '/' + JsonImageArray[i - 1];
                        imgArray.push(imgJson)
                    }
                    console.log(imgArray);
                    this.fileList = imgArray;

                });
            },
           hideModel(){
                this.dealActivityShow=false;
                this.$emit('fetchAgan')
           },
            /**
             * 审核通过
             */
            pass(){
                fetch.put('/flowable/'+this.processId,{result: '同意'}).then((res)=>{
                    console.log(res);
                    message.info(res.msg);
                    this.hideModel()
                })
            },
            rejected(){
                fetch.put('/flowable/'+this.processId, {result: '驳回'}).then((res)=>{
                    console.log(res);
                    message.info(res.msg);
                    this.hideModel()
                })
            },
        }
    }
</script>

<style scoped>
    .wrap{
        width: 100%;
        height: 100%;
    }
    input::-webkit-input-placeholder ,textarea::-webkit-input-placeholder{ /* WebKit, Blink, Edge */
        color: #A6A6A6;
        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-moz-placeholder,textarea::-webkit-input-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input::-moz-placeholder,textarea::-webkit-input-placeholder { /* Mozilla Firefox 19+ */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-ms-input-placeholder,textarea::-webkit-input-placeholder { /* Internet Explorer 10-11 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }
</style>