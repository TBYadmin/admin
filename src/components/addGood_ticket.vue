<template>
    <a-form :form="addGoodform.form">
        <a-form-item :label="'销售模式'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-select v-decorator="addGoodform.mold">
                <a-select-option value="1">直售商品</a-select-option>
                <a-select-option value="2">组合商品</a-select-option>
                <a-select-option value="3">全部商品</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item :label="'资质依据'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-select v-decorator="addGoodform.aptitudeId" :options="accordingOption">
            </a-select>
        </a-form-item>
        <a-form-item :label="'商品名称'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="addGoodform.name" placeholder="商品名称"/>
        </a-form-item>
        <a-form-item :label="'门票类型'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-select v-decorator="addGoodform.type" placeholder="门票类型">
                <a-select-option value="1">成人票</a-select-option>
                <a-select-option value="2">儿童票</a-select-option>
                <a-select-option value="3">学生票</a-select-option>
                <a-select-option value="4">家庭套票</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item :label="'最大适用人数'" has-feedback validate-status="success" :label-col="{ span: 5}"
                     :wrapper-col="{ span: 12 }">
            <a-input-number v-decorator="addGoodform.personNumber" placeholder=""/>
        </a-form-item>
        <a-form-item :label="'商品图片'">
            <a-upload v-decorator="[
                        `imgsList`,
                        {
                            rules: [{
                                required: this.validation,
                                message: '请上传商品图片',
                            }],
                            // initialValue: aptitudeDefault
                        }
                    ]"
                      :action='action'
                      listType="picture-card"
                      :fileList="fileList"
                      @preview="handlePreview"
                      @change="handleChangePic"
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
        <a-form-item :label="'门票介绍'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
            <a-input v-decorator="addGoodform.introduction" placeholder=""/>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
            <a-button type="primary" class="backGorundYellow" @click="setaddgoodModelShow(false)">取消</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import fetch from '@/common/fetch'
    import {message} from 'ant-design-vue'
    import {mapState, mapGetters} from 'vuex'
    export default {
        name: "addGood_ticket",
        data() {
            return {
                addGoodform: {
                    form: this.$form.createForm(this),
                    mold: [
                        `mold`,
                        {
                            rules: [{
                                required: true,
                                message: '请选择商品模式',
                            }],
                            initialValue: '1'
                        }
                    ],
                    aptitudeId: [
                        `aptitudeId`,
                        {
                            rules: [{
                                required: true,
                                message: '请选择资质依据',
                            }],
                            // initialValue: aptitudeDefault
                        }
                    ],
                    name: [
                        `name`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入商品名称',
                            }],

                        }
                    ],
                    type: [
                        `type`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入客房类型',
                            }],

                        }
                    ],
                    personNumber: [
                        `personNumber`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入最大适用人数',
                            }],

                        }
                    ],
                    introduction: [
                        `introduction`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入客房描述',
                            }],

                        }
                    ],
                },
                accordingOption: [
                    {value: '资质依据1', label: '资质依据1'},
                    {value: '资质依据2', label: '资质依据2'},
                    {value: '资质依据3', label: '资质依据3'},
                    {value: '资质依据4', label: '资质依据4'},
                ],
                contrast: [],
                action: '/maintenance/qiniu',
                fileList: [],
                previewImage: '',
                previewVisible: false,
                addgoodModelShow: false,
                postType: '',
                goodId:''

            }
        },
        computed: mapState({
            validation: state => state.validationState,
        }),
        mounted() {
            fetch.get('/aptitude/table?size=100&current=0').then(res => {
                let recodes = res.obj.records;
                this.contrast = res.obj.records;
                let optionArray = [];
                recodes.forEach((item) => {
                    let optionJson = {};
                    optionJson['value'] = item.id;
                    optionJson['label'] = item.name;
                    optionJson['key'] = item.type;
                    optionArray.push(optionJson)
                })
                this.accordingOption = optionArray

            })


        },
        methods: {
            setGoodId(value){
                this.goodId=value
            },
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
            handleChangePic({fileList, file}) {
                console.log(fileList);
                this.fileList = fileList;
            },
            removePic(file) {
                console.log(file.response.obj[0].key)
                if (file.name !== undefined) {
                    fetch.delete(this.action + '/' + file.name, '')
                        .then(res => console.log(res))
                } else {
                    fetch.delete(this.action + '/' + file.response.obj[0].key)
                        .then(res => console.log(res))
                }

                console.log(file)
            },
            /**
             * 修改商品回显
             * **/
            echoGood(){
                fetch.get('/product/table/' + this.goodId).then(res => {
                    let qiuNiu = this.$store.state.qiNiuLink;
                    let Json = res.obj;
                    console.log(Json);
                    this.addGoodform.form.setFieldsValue(
                        {
                            ['mold']: Json.mold.toString(),
                            ['name']: Json.name,
                            ['aptitudeId']: Json.aptitudeId,
                            ['introduction']: Json.introduction,
                            ['personNumber']: 2,
                            ['type']: Json.type.toString()
                        }
                    )
                    let imgArray = [];
                    let JsonImageArray = Json.cover.split(',');
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
                    console.log(imgArray)
                    this.fileList = imgArray;
                })
            },
            /**
             * 提交商品
             * **/
            handleSubmit() {
                this.addGoodform.form.validateFields((error, values) => {
                    if (error === null) {
                        console.log(values)
                        let parmas = values;
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
                        parmas['type'] = parseInt(values.type);
                        parmas['aptitudeId'] =values.aptitudeId
                        // parmas['aptitudeId'] =parseInt(values.aptitudeId)
                        if(this.goodId !==''){
                            fetch.put( '/product/ticket/' + this.goodId, parmas).then(res => {
                                console.log(res)
                                message.info(res.msg);
                                this.$emit('hideModel')
                                this.setEmptyForm();
                            })
                        }else{
                            fetch.post('/product/ticket',parmas).then(res => {
                                console.log(res)
                                message.info(res.msg);
                                this.$emit('hideModel')
                                this.setEmptyForm();
                            })

                        }
                    }

                })

            },
        /**置空表单 **/
        setEmptyForm(){
                this.addGoodform.form.resetFields();
                this.fileList = [];
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