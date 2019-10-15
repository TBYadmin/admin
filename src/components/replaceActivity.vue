<template>
    <a-modal v-model="replaceActivityShow" title="修改活动" @cancel="cancel" class="add-modal" :footer="null"
             :width="modalWidth">
        <div class="wrap">
            <a-form :form="replaceActivity.form">
                <a-form-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 8}">
                    <a-input placeholder="输入活动名称" v-decorator="replaceActivity.name"/>
                </a-form-item>
                <a-form-item label="活动描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
                    <a-textarea placeholder="输入活动描述" col="5" row="15" v-decorator="replaceActivity.description"/>
                </a-form-item>
                <a-form-item label="活动时间" :label-col="{ span: 4 }">
                    <a-range-picker :format="dateFormat" v-decorator="replaceActivity.ActiveDate"
                                    :disabledDate="disabledDate"/>
                </a-form-item>

                <a-form-item label="报名时间" :label-col="{ span:4}">
                    <a-range-picker :format="dateFormat" v-decorator="replaceActivity.enrollDate"
                                    :disabledDate="disabledDate"/>
                </a-form-item>

                <a-form-item label="活动标签" :label-col="{ span: 4 } " :wrapper-col="{ span:8 }">
                    <a-input placeholder="请输入活动标签" v-decorator="replaceActivity.label"></a-input>
                </a-form-item>
                <a-form-item label="活动规则" :label-col="{ span: 4 } " :wrapper-col="{ span:8 }">
                    <a-input placeholder="请输入活动规则" v-decorator="replaceActivity.rule"></a-input>
                </a-form-item>

                <a-form-item :label="'活动图片'">
                    <a-upload v-decorator="replaceActivity.imgsList"
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
                <!--<a-form-item label="活动链接" :label-col="{ span: 4 }" :wrapper-col="{ span:12}" v-decorator="replaceActivity.link">-->
                <!--<a-input placeholder="输入活动链接"/>-->
                <!--</a-form-item>-->

                <a-form-item>
                    <a-button type="primary" @click="submitreplaceActivity">提交</a-button>
                    <a-button type="primary" @click=" setreplaceActivityShow(false)">取消</a-button>
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
    import {message} from 'ant-design-vue'

    export default {
        name: "replaceActivity",
        data() {
            return {
                modalWidth: '6rem',
                dateFormat: 'YYYY-MM-DD',
                replaceActivity: {
                    form: this.$form.createForm(this),
                    name: [
                        `name`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入活动名称',
                            }],
                        }
                    ],
                    ActiveDate: [
                        `ActiveDate`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入活动时间',
                            }],
                        }
                    ],

                    enrollDate: [
                        `enrollDate`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入报名开始时间',
                            }],
                        }
                    ],
                    rule: [
                        `rule`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入报名开始时间',
                            }],
                        }
                    ],
                    label: [
                        `label`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入报名结束时间',
                            }],
                        }
                    ],


                    imgsList: [
                        `imgsList`,
                        {
                            rules: [{
                                required: false,
                                message: '请上传活动图片',
                            }],
                        }

                    ],
                    description: [
                        `description`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入活动描述',
                            }],
                        }
                    ],
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
                previewVisible: false,
                previewImage: '',
                fileList: [],
                action: '/maintenance/qiniu',
                replaceActivityShow: false,
                activityId: ''
            }
        },
        methods: {
            handleOk() {
                this.previewVisible = false
            },
            handleCancel() {
                this.previewVisible = false
            },
            handlePreview(file) {
                console.log('handle preview file')
                console.log(file);
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            handleChangePic({fileList, file}) {
                console.log(fileList);
                this.fileList = fileList;
            },
            removePic(file) {
                debugger
                if (file.response == undefined) {
                    let imgIndex = this.fileList.indexOf(file.name);
                    fetch.delete(this.action + '/' + file.name, '')
                        .then(res => {
                            this.fileList.splice(imgIndex, 1);
                        })
                } else {
                    let imgIndex = this.fileList.indexOf(file.response.obj[0].key);
                    fetch.delete(this.action + '/' + file.response.obj[0].key).then(res => {

                        this.fileList.splice(imgIndex, 1);
                    })
                }

                console.log(file)
            },
            submitreplaceActivity() {
                this.replaceActivity.form.validateFields((error, values) => {
                    if (!error) {
                        console.log(values);
                        let parmas = values;
                        let imgArray = this.fileList;
                        let imgKeyString = '';
                        for (let i = 0; i < imgArray.length; i++) {
                            if (imgArray[i].response !== undefined) {
                                imgKeyString += imgArray[i].response.obj[0].key + ','

                            } else {
                                imgKeyString += imgArray[i].name + ','
                            }
                        }
                        console.log(typeof(moment(values.ActiveDate[0]).valueOf()))
                        let activiRange = parmas.ActiveDate;
                        let encolRange = parmas.enrollDate;
                        let begin = moment(activiRange[0]).valueOf();
                        let end = moment(activiRange[1]).valueOf();
                        let enrollB = moment(encolRange[0]).valueOf();
                        let enrollE = moment(encolRange[1]).valueOf()
                        parmas['banner'] = imgKeyString.slice(0, imgKeyString.length - 1);
                        parmas['beginDate'] = begin;
                        parmas['endDate'] = end;
                        parmas['enrollBegin'] = enrollB;
                        parmas['enrollEnd'] = enrollE;
                        parmas['icon'] = '';
                        parmas['id'] = this.activityId;
                        console.log(parmas);
                        fetch.post('/shop/activity/updateById', parmas).then((res) => {
                            console.log(res);
                            message.info(res.msg);
                            this.$emit('fetchAgan');
                            this.setreplaceActivityShow(false)
                        })
                    }
                })


            },
            cancel() {
                this.replaceActivityShow = false
            },
            setreplaceActivityShow(val) {
                this.replaceActivityShow = val
            },
            setactivityId(val) {
                this.activityId = val
            },
            disabledDate(current) {
                return current && current < moment().endOf('day');
            },
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }

    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #A6A6A6;
        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-moz-placeholder, textarea::-webkit-input-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input::-moz-placeholder, textarea::-webkit-input-placeholder { /* Mozilla Firefox 19+ */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-ms-input-placeholder, textarea::-webkit-input-placeholder { /* Internet Explorer 10-11 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }
</style>