<template>
    <a-modal v-model="viewActivityShow" title="修改活动" @cancel="cancel" class="add-modal"  :footer="null" :width="modalWidth">
        <div class="wrap">
            <a-form :form="viewActivity.form"  >
                <a-form-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 8}" >
                    <a-input placeholder="输入活动名称" v-decorator="viewActivity.name"/>
                </a-form-item>
                <a-form-item label="活动描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}" >
                    <a-textarea placeholder="输入活动描述" col="5" row="30" v-decorator="viewActivity.description"  />
                </a-form-item>
                <a-form-item label="活动时间" :label-col="{ span: 4 }"   >
                    <a-range-picker :format="dateFormat" v-decorator="viewActivity.ActiveDate" :disabledDate="disabledDate"/>
                </a-form-item>

                <a-form-item label="报名时间" :label-col="{ span:4}"   >
                    <a-range-picker :format="dateFormat" v-decorator="viewActivity.enrollDate" :disabledDate="disabledDate"/>
                </a-form-item>

                <a-form-item label="活动标签" :label-col="{ span: 4 } "   :wrapper-col="{ span:8 }" >
                    <a-input placeholder="请输入活动标签" v-decorator="viewActivity.label"></a-input>
                </a-form-item>
                <a-form-item label="活动规则" :label-col="{ span: 4 } "   :wrapper-col="{ span:8 }" >
                    <a-input placeholder="请输入活动规则" v-decorator="viewActivity.rule"></a-input>
                </a-form-item>

                <a-form-item :label="'活动图片'" >
                    <a-upload   v-decorator="viewActivity.imgsList"
                                :action='action'
                                listType="picture-card"
                                @preview="handlePreview"
                                :fileList="fileList"
                                @change="handleChangePic"
                                :remove='removePic'
                                multiple
                    >
                        <div v-if="fileList.length < 6">
                            <a-icon type="plus"/>
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage">
                    </a-modal>
                </a-form-item>
                <!--<a-form-item label="活动链接" :label-col="{ span: 4 }" :wrapper-col="{ span:12}" v-decorator="viewActivity.link">-->
                <!--<a-input placeholder="输入活动链接"/>-->
                <!--</a-form-item>-->


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
        name: "viewActivity",
        data(){
            return{
                modalWidth:'6rem',
                dateFormat:'YYYY-MM-DD',
                viewActivity:{
                    form: this.$form.createForm(this),
                    name: [`name`,],
                    ActiveDate: [`ActiveDate`],
                    enrollDate:[`enrollDate`],
                    rule:[`rule`],
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
                viewActivityShow:false,
                activityId:''
            }
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

            cancel(){
                this.viewActivityShow=false
            },
            setviewActivityShow(val){
                this.viewActivityShow=val
            },
            setactivityId(val){
                this.activityId=val
            },
            disabledDate(current) {
                return current && current < moment().endOf('day');
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