<template>
    <a-form  :form="dealGoodform.form">
    <a-form-item :label="'修缮模式'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="dealGoodform.mold" :disabled="true">
            <a-select-option value="1">直售商品</a-select-option>
            <a-select-option value="2">组合商品</a-select-option>
            <a-select-option value="3">全部商品</a-select-option>
        </a-select>
    </a-form-item>
    <a-form-item :label="'商品名称'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="dealGoodform.name" placeholder="商品名称"/>
    </a-form-item>
    <a-form-item :label="'门票类型'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="dealGoodform.type" placeholder="门票类型" :disabled="true">
            <a-select-option value="1">成人票</a-select-option>
            <a-select-option value="2">儿童票</a-select-option>
            <a-select-option value="3">学生票</a-select-option>
            <a-select-option value="4">家庭套票</a-select-option>
        </a-select>
    </a-form-item>

    <a-form-item :label="'最大适用人数'" has-feedback validate-status="success" :label-col="{ span: 5}"
                 :wrapper-col="{ span: 12 }">
        <a-input-number v-decorator="dealGoodform.personNumber" placeholder=""/>
    </a-form-item>
    <a-form-item :label="'上传商品图片'">
        <a-upload v-decorator="dealGoodform.imgsList"
                  :action='action'
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
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
    <a-form-item :label="'门票介绍'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
        <a-input v-decorator="dealGoodform.introduction" placeholder=""/>
    </a-form-item>
        <a-form-item>
            <a-button type="primary"  @click="pass">通过</a-button>
            <a-button type="primary" class="backGorundYellow" @click="rejected">驳回</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import fetch from "../common/fetch";
    import {message} from 'ant-design-vue'
    export default {
        name: "dealGood_ticket",
        data(){
            return{
                dealGoodform: {
                    form: this.$form.createForm(this),
                    mold: [`mold`],
                    imgsList: [`imgsList`],
                    name: [`name`],
                    personNumber: [`personNumber`],
                    introduction: [`introduction`],
                    type:['type']
                },
                accordingOption: [],
                contrast: [],
                action: '/maintenance/qiniu',
                fileList: [],
                previewImage: '',
                previewVisible: false,
                postType: '',
                processId:'',
                uploadShow:false
            }
        },
        methods:{
            handleOk() {
                this.previewVisible = false
            },
            handleCancel() {
                this.previewVisible = false
            },
            handlePreview(file) {
                console.log('handle preview file')
                console.log(file)
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            setprocessId(val){
                this.processId=val
            },
            pass(){
                fetch.put('/flowable/'+this.processId,{result: '同意'}).then((res)=>{
                    console.log(res);
                    message.info(res.msg);
                    this.$emit('hideModel')
                })
            },
            rejected(){
                fetch.put('/flowable/'+this.processId, {result: '驳回'}).then((res)=>{
                    console.log(res);
                    message.info(res.msg);
                    this.$emit('hideModel')
                })
            },
            getDetail(id) {
                fetch.get('/flowable/variable?id=' + id).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    let model=Json.mold;
                    let qiuNiu = this.$store.state.qiNiuLink;
                    this.dealGoodform.form.setFieldsValue(
                        {
                            ['mold']: model+'',
                            ['name']:Json.name,
                            ['personNumber']:Json.personNumber,
                            ['introduction']:Json.introduction,
                            ['type']:Json.type+''
                        })
                    let imgArray = [];
                    let JsonImageArray = Json.cover.split(',');
                    console.log(JsonImageArray.length)
                    for (var i=1;i<= JsonImageArray.length;i++) {
                        let imgJson = {};
                        imgJson['status'] = "done";
                        imgJson['name'] = JsonImageArray[i - 1];
                        imgJson['uid'] = (-i) + '';
                        imgJson['url'] = qiuNiu + '/' + JsonImageArray[i - 1];
                        imgJson['thumbUrl'] = qiuNiu + '/' + JsonImageArray[i - 1];
                        imgArray.push(imgJson)
                    }
                    this.fileList=imgArray;
                })
            }
        }
    }
</script>

<style scoped>
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