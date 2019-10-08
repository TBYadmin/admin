
<template>
    <a-form :form="formreplacequalification.form">

        <a-form-item :label="'资质名称'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="formreplacequalification.name" placeholder="关键字"/>
        </a-form-item>
        <a-form-item :label="'资质描述'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
            <a-input v-decorator="formreplacequalification.description" placeholder="请输入资质描述"/>
        </a-form-item>
        <a-form-item :label="'基础设施'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
            <a-input v-decorator="formreplacequalification.facilities" placeholder="请输入资质配备设施"/>
        </a-form-item>
        <a-form-item :label="'酒店等级'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-select v-decorator="formreplacequalification.star">
                <a-select-option value="1">1星级</a-select-option>
                <a-select-option value="2">2星级</a-select-option>
                <a-select-option value="3">3星级</a-select-option>
                <a-select-option value="4">4星级</a-select-option>
                <a-select-option value="5">5星级</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item :label="'联系电话'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="formreplacequalification.phone" placeholder="联系电话"/>
        </a-form-item>
        <a-form-item :label="'资质图片'" style="width: 45%;display: inline-block;">
            <a-upload v-decorator="formreplacequalification.qualificationimgsList"
                      :action='action'
                      listType="picture-card"
                      @preview="qualificationhandlePreview"
                      :fileList="qualificationfileList"
                      @change="qualificationhandleChangePic"
                      :remove='qualificationremovePic'
                      multiple
            >
                <div v-if="qualificationfileList.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>
            <a-modal :visible="qualificationpreviewVisible" :footer="null" @cancel="qualificationhandleCancel">
                <img alt="example" style="width: 100%" :src="qualificationpreviewImage">
            </a-modal>
        </a-form-item>
        <a-form-item :label="'星级图片'" style="width: 45%;display: inline-block;">
            <a-upload v-decorator="formreplacequalification.starimgsList"
                      :action='action'
                      listType="picture-card"
                      @preview="starhandlePreview"
                      :fileList="starfileList"
                      @change="starhandleChangePic"
                      :remove='starremovePic'
                      multiple
            >
                <div v-if="starfileList.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>
            <a-modal :visible="starreviewVisible" :footer="null" @cancel="starhandleCancel">
                <img alt="example" style="width: 100%" :src="starpreviewImage">
            </a-modal>
        </a-form-item>
        <a-form-item :label="'封面图片'">
            <a-upload v-decorator="formreplacequalification.imgsList"
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
        <a-form-item :label="'注册地址'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator=formreplacequalification.address placeholder="请输入地址"/>
        </a-form-item>

        <a-form-item>
            <a-button type="primary" @click="submitQualification">提交</a-button>
            <a-button type="primary" @click="setreplaceQualificationshow(false)">取消</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import Config from '@/config/api'
    import fetch from '@/common/fetch'
    import axios from 'axios'
    import {message} from 'ant-design-vue'

    export default {
        name: "aptitude",
        data() {
            return {
                action: Config.getBaseUrl() + '/maintenance/qiniu',
                formreplacequalification: {
                    form: this.$form.createForm(this),
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
                    star: [
                        `star`,
                        {
                            rules: [{
                                required: true,
                                message: '酒店星级',
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
                                len: 11
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
                    qualificationimgsList: [`qualificationimgsList`,],
                    starimgsList: [`starimgsList`,],
                },
                selctDisabled: false,
                previewVisible: false,
                qualificationpreviewVisible: false,
                starreviewVisible: false,
                previewImage: '',
                qualificationpreviewImage: '',
                starpreviewImage: '',
                fileList: [],
                qualificationfileList: [],
                starfileList: [],
                qualificationId: '',
                replaceQualificationshow: false
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
                this.starreviewVisible = false
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
                this.starreviewVisible = true
            },
            handleChangePic({fileList, file}) {
                console.log(fileList);
                this.fileList = fileList;
            },
            qualificationhandleChangePic({fileList}) {
                console.log(fileList);
                this.qualificationfileList = fileList;
            },
            starhandleChangePic({fileList}) {
                console.log(fileList);
                this.starfileList = fileList;
            },
            removePic(file) {
                if (file.response) {
                    fetch.delete(this.action + '/' + file.response.obj[0].key)
                        .then(res => console.log(res))
                }
            },
            qualificationremovePic(file) {
                console.log(file.response)
                if (file.response) {
                    fetch.delete(this.action + '/' + file.response.obj[0].key)
                        .then(res => console.log(res))
                }
                console.log(file)
            },
            starremovePic(file) {
                if (file.response) {
                    fetch.delete(this.action + '/' + file.response.obj[0].key)
                        .then(res => console.log(res))
                }
                console.log(file)
            },
            /**
             * 修改资质
             */
            submitQualification() {
                this.formreplacequalification.form.validateFields((error, values) => {
                    if (error === null) {
                        console.log(values);
                        let parmas = values;
                        debugger;
                        console.log(this.fileList);
                        let imgArray = this.fileList;
                        let imgKeyString = '';
                        for (let i = 0; i < imgArray.length; i++) {
                            console.log(imgArray[i].response)
                            if (imgArray[i].response) {
                                imgKeyString += imgArray[i].response.obj[0].key + ','
                            } else {
                                imgKeyString += imgArray[i].name + ','
                            }
                        }
                        parmas['cover'] = imgKeyString.slice(0, imgKeyString.length - 1);
                        parmas['proveFile'] = this.qualificationfileList[0].response ? this.qualificationfileList[0].response.obj[0].key : this.qualificationfileList[0].name;
                        parmas['starFile'] = this.starfileList[0].response ? this.starfileList[0].response.obj[0].key : this.starfileList[0].name;
                        parmas['star'] = parseInt(values.star);
                        parmas['type'] = 1;
                        fetch.put(Config.getBaseUrl() + '/aptitude/hotel/' + this.qualificationId, parmas).then(res => {
                            console.log(res);
                            message.info(res.msg);
                            this.$emit('modelHide');
                        });
                    }
                })
            },
            setKey(val) {
                this.qualificationId = val
            }

        }
    }
</script>

<style scoped>

</style>