<template>
    <a-form :form="dealQualificationProcess.form">
        <a-form-item :label="'资质名称'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="dealQualificationProcess.name" placeholder="关键字" :disabled="true"/>
        </a-form-item>
        <a-form-item :label="'资质描述'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
            <a-textarea v-decorator="dealQualificationProcess.description" placeholder="请输入资质描述" col="5" row="15"
                        :disabled="true"/>

        </a-form-item>
        <a-form-item :label="'基础设施'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
            <a-input v-decorator="dealQualificationProcess.facilities" placeholder="请输入资质配备设施" :disabled="true"/>
        </a-form-item>
        <a-form-item :label="'酒店等级'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-select v-decorator="dealQualificationProcess.star" :disabled="true">
                <a-select-option value="1">1星级</a-select-option>
                <a-select-option value="2">2星级</a-select-option>
                <a-select-option value="3">3星级</a-select-option>
                <a-select-option value="4">4星级</a-select-option>
                <a-select-option value="5">5星级</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item :label="'联系电话'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="dealQualificationProcess.phone" placeholder="联系电话" :disabled="true"/>
        </a-form-item>
        <a-form-item :label="'注册地址'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator=dealQualificationProcess.address placeholder="请输入地址" :disabled="true"/>
        </a-form-item>

        <a-form-item :label="'资质图片'" style="width: 45%;display: inline-block;">
            <a-upload v-decorator="dealQualificationProcess.qualificationimgsList"
                      :action='action'
                      listType="picture-card"
                      @preview="qualificationhandlePreview"
                      :fileList="qualificationfileList"
                      multiple
            >
                <div v-if="addPictureShow">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>
            <a-modal :visible="qualificationpreviewVisible" :footer="null" @cancel="qualificationhandleCancel">
                <img alt="example" style="width: 100%" :src="qualificationpreviewImage">
            </a-modal>
        </a-form-item>
        <a-form-item :label="'星级图片'" style="width: 45%;display: inline-block;">
            <a-upload v-decorator="dealQualificationProcess.starimgsList"
                      :action='action'
                      listType="picture-card"
                      @preview="handlePreview"
                      :fileList="starfileList"
                      multiple
            >
                <div v-if="addPictureShow">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>
            <a-modal :visible="starpreviewVisible" :footer="null" @cancel="starhandleCancel">
                <img alt="example" style="width: 100%" :src="starpreviewImage">
            </a-modal>
        </a-form-item>
        <a-form-item :label="'封面图片'">
            <a-upload v-decorator="dealQualificationProcess.imgsList"
                      :action='action'
                      listType="picture-card"
                      @preview="handlePreview"
                      :fileList="fileList"
                      multiple
            >
                <div v-if="addPictureShow">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage">
            </a-modal>
        </a-form-item>


        <a-form-item>
            <a-button type="primary" @click="pass">通过</a-button>
            <a-button type="primary" class="backGorundYellow" @click="rejected">驳回</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import fetch from "../common/fetch";
    import {message} from 'ant-design-vue'

    export default {
        name: "dealQualification_hotel",
        data() {
            return {
                dealQualificationProcess: {
                    form: this.$form.createForm(this),
                    name: [`name`,],
                    description: [`description`],
                    star: [`star`],
                    facilities: [`facilities`],
                    phone: [`phone`],
                    address: [`address`],
                    imgsList: [`imgsList`],
                    qualificationimgsList: [`qualificationimgsList`],
                    starimgsList: [`starimgsList`],
                },
                action: '/maintenance/qiniu',
                previewVisible: false,
                qualificationpreviewVisible: false,
                starpreviewVisible: false,
                previewImage: '',
                starpreviewImage: '',
                qualificationpreviewImage: '',
                qualificationfileList: [],
                starfileList: [],
                fileList: [],
                addPictureShow: false,
                processId: ''

            }
        },
        methods: {
            handleCancel() {
                this.previewVisible = false
            },
            qualificationhandleCancel() {
                this.qualificationpreviewVisible = false
            },
            starhandleCancel() {
                this.starpreviewVisible = false
            },
            handlePreview(file) {
                console.log(file)
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            qualificationhandlePreview(file) {
                console.log(file)
                this.qualificationpreviewImage = file.url || file.thumbUrl
                this.qualificationpreviewVisible = true
            },
            starhandlePreview(file) {
                console.log(file)
                this.starpreviewImage = file.url || file.thumbUrl
                this.starpreviewVisible = true
            },
            pass() {
                fetch.put('/flowable/' + this.processId, {result: '同意'}).then((res) => {
                    console.log(res);
                    message.info(res.msg);
                    this.$emit('hideModel');
                })
            },
            rejected() {
                fetch.put('/flowable/' + this.processId, {result: '驳回'}).then((res) => {
                    console.log(res);
                    message.info(res.msg);
                    this.$emit('hideModel');

                })
            },
            setprocessId(val) {
                this.processId = val
            },
            //根据传参获取资质详情
            getDetail(id) {
                fetch.get('/flowable/variable?id=' + id).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    let qiuNiu = this.$store.state.qiNiuLink;
                    this.dealQualificationProcess.form.setFieldsValue(
                                    {

                                        ['name']: Json.name,
                                        ['address']: Json.address,
                                        ['description']: Json.description,
                                        ['phone']: Json.phone,
                                        ['facilities']: Json.facilities,
                                        ['star']: Json.star + ''
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
                                let imgArrayStar_view = [
                                    {
                                        status: "done",
                                        name: Json.starFile,
                                        uid: '-1',
                                        url: qiuNiu + '/' + Json.starFile,
                                        thumbUrl: qiuNiu + '/' + Json.starFile,
                                    },
                                ];
                                this.starfileList = imgArrayStar_view;
                                let imgArrayPro_view = [
                                    {
                                        status: "done",
                                        name: Json.proveFile,
                                        uid: '-1',
                                        url: qiuNiu + '/' + Json.proveFile,
                                        thumbUrl: qiuNiu + '/' + Json.proveFile,
                                    },
                                ];
                                this.qualificationfileList = imgArrayPro_view;
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