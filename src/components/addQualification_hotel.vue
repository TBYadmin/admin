<template>
    <div class="wrap">
        <a-form :form="formaddqualification.form">
            <a-form-item :label="'资质名称'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                <a-input v-decorator="formaddqualification.name" placeholder="关键字"/>
            </a-form-item>
            <a-form-item :label="'资质描述'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
                <a-textarea v-decorator="formaddqualification.description" placeholder="请输入资质描述" col="5" row="15"/>

            </a-form-item>
            <a-form-item :label="'基础设施'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
                <a-input v-decorator="formaddqualification.facilities" placeholder="请输入资质配备设施"/>
            </a-form-item>
            <a-form-item :label="'酒店等级'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                <a-select v-decorator="formaddqualification.star">
                    <a-select-option value="1">1星级</a-select-option>
                    <a-select-option value="2">2星级</a-select-option>
                    <a-select-option value="3">3星级</a-select-option>
                    <a-select-option value="4">4星级</a-select-option>
                    <a-select-option value="5">5星级</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'注册地址'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                <a-input v-decorator=formaddqualification.address placeholder="请输入地址" style="display: inline-block;"
                         @change="getAddress"/>
                <span class="icon iconfont icon-dingwei5-copy" title="点击获取定位" @click="getPosition"></span>
            </a-form-item>
            <a-form-item :label="'联系电话'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                <a-input v-decorator="formaddqualification.phone" placeholder="联系电话"/>
            </a-form-item>
            <a-form-item :label="'上传资质图片'" style="width: 45%;display: inline-block;">
                <a-upload v-decorator="[
                        `qualificationimgsList`,
                        {
                            rules: [{
                                required: validation,
                                message: '请上传资质文件',
                            }],
                        }
                    ]"
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
            <a-form-item :label="'上传星级图片'" style="width: 45%;display: inline-block;">
                <a-upload v-decorator="[
                        `starimgsList`,
                        {
                            rules: [{
                                required: this.validation,
                                message: '请上传封面图片',
                            }],
                        }
                    ]"
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
            <a-form-item :label="'上传封面图片'">
                <a-upload v-decorator=" [
                   'imgsList',
                        {
                            rules: [{
                                required: this.validation,
                                message: '请上传星级',
                            }],
                        }

                    ]"
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
            <a-form-item>
                <a-button type="primary" @click="submitQualification">提交</a-button>
                <a-button type="primary" @click="remove" class="backGorundYellow">取消</a-button>
            </a-form-item>
        </a-form>
        <a-modal :visible="mapVisible" :mask="maskShow" @cancel="exitGetLoaction" :footer="null">
            <a-map @getLocation="getLocation"></a-map>
        </a-modal>
    </div>
</template>
<script>
    // import Utils from '@/common/utils'
    import Config from '@/config/api'
    import fetch from '@/common/fetch'
    import {message} from 'ant-design-vue'
    import aMap from './mapDrag'
    import BaiduMap from '../utils/map.js'
    import {mapState, mapGetters} from 'vuex'

    export default {
        name: "addQualification_hotel",
        data() {
            return {
                action: Config.getBaseUrl() + '/maintenance/qiniu',
                checkStar: true,
                checkQualificationimg: true,
                checkCove: true,
                formaddqualification: {
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
                    star: [
                        `star`,
                        {
                            rules: [{
                                required: true,
                                message: '请选择酒店星级',

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
                addqualificationsqhow: false,
                location: [],
                mapVisible: false,
                maskShow: false,
                localSearch: {},
                qualificationId: '',
                address: '',
                baiduCoordinates: []
            }
        },


        components: {
            aMap
        },

        computed: mapState({
            validation: state => state.validationState,
        }),

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
                // debugger
                if (file.response) {
                    fetch.delete(this.action + '/' + file.response.obj[0].key)
                        .then(res => console.log(res))
                }
            },
            qualificationremovePic(file) {
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
            setKey(val) {
                this.qualificationId = val
            },
            /**
             * 输入框输入搜索定位
             * **/
            getAddress(value) {
                this.setMapVisible(true)
            },
            /**
             * 打开定位
             **/
            getPosition() {
                this.setMapVisible(true)
            },
            //    设置模态框
            setMapVisible(val) {
                this.mapVisible = val
            },
            /**
             * 关闭获取定位
             * */
            exitGetLoaction() {
                this.setMapVisible(false);
            },
            /**
             * 返回定位
             * */
            getLocation(val) {
                console.log(val);
                this.setMapVisible(false);
                this.baiduCoordinates = val[0];
                this.formaddqualification.form.setFieldsValue({
                    ['address']: val[1],
                })
            },
            /**
             * 修改资质回显
             * **/
            echoQualificationDetails() {
                // /获取资质详情
                fetch.get('/aptitude/table/' + this.qualificationId).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    let qiuNiu = this.$store.state.qiNiuLink;
                    this.formaddqualification.form.setFieldsValue(
                        {
                            ['name']: Json.name,
                            ['address']: Json.address,
                            ['description']: Json.description,
                            ['phone']: Json.phone,
                            ['facilities']: Json.facilities,
                            ['star']: Json.star + '',
                        }
                    );
                    this.baiduCoordinates = [Json.baiduY, Json.baiduX];
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
                    console.log(imgArray);
                    this.fileList = imgArray;
                    let imgArrayStar = [
                        {
                            status: "done",
                            name: Json.starFile,
                            uid: '-1',
                            url: qiuNiu + '/' + Json.starFile,
                            thumbUrl: qiuNiu + '/' + Json.starFile,
                        },
                    ];
                    this.starfileList = imgArrayStar;
                    let imgArrayPro = [
                        {
                            status: "done",
                            name: Json.proveFile,
                            uid: '-1',
                            url: qiuNiu + '/' + Json.proveFile,
                            thumbUrl: qiuNiu + '/' + Json.proveFile,
                        },
                    ];
                    this.qualificationfileList = imgArrayPro;
                })
            },
            /**
             * 资质上传
             */
            submitQualification() {
                this.formaddqualification.form.validateFields((error, values) => {
                    if (error === null) {
                        let parmas = values;
                        let Location = this.baiduCoordinates;
                        parmas['baiduX'] = Location[1];
                        parmas['baiduY'] = Location[0];
                        let GaodeLocation = this.bd_decrypt(Location[0], Location[1]);
                        parmas['amapY'] = GaodeLocation.lng;
                        parmas['amapX'] = GaodeLocation.lat;
                        debugger
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
                        parmas['star'] = parseInt(values.star);
                        parmas['type'] = 1;
                        parmas['qualificationimgsList'] = [];
                        parmas['imgsList'] = [];
                        parmas['starimgsList'] = [];
                        if (this.qualificationId !== '') {
                            //    false新增， true使用修改接口
                            fetch.put('/aptitude/hotel/' + this.qualificationId, parmas).then(res => {
                                console.log(res);
                                message.info(res.msg);
                                this.$emit('modelHide');
                                this.setEmptyForm();
                            });
                        } else {
                            fetch.post('/aptitude/hotel', parmas).then(res => {
                                message.info(res.msg);
                                this.$emit('modelHide');
                                this.setEmptyForm();
                            });
                        }

                    }
                })
            },

            /**
             * 坐标系转换
             */
//百度坐标转高德（传入经度、纬度）
            bd_decrypt(bd_lng, bd_lat) {
                var X_PI = Math.PI * 3000.0 / 180.0;
                var x = bd_lng - 0.0065;
                var y = bd_lat - 0.006;
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
                var gg_lng = z * Math.cos(theta);
                var gg_lat = z * Math.sin(theta);
                return {lng: gg_lng, lat: gg_lat}
            },

            //        提交完设置表单为空
            setEmptyForm() {
                this.formaddqualification.form.resetFields;
                this.fileList = [];
                this.qualificationfileList = [];
                this.starfileList = [];
            },
            remove() {
                alert('取消')
            }

        }
    }
</script>

<style scoped>
    .iconfont.icon-dingwei5-copy {
        position: absolute;
        margin: auto 0;
        top: -0.1rem;
        bottom: 0;
        right: -0.5rem;
        cursor: pointer;
        color: #409EFF;
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

    .ant-input {
        font-size: 0.17rem !important;
        color: rgba(0, 0, 0, 0.65) !important;
        font-family: 微软雅黑;
    }

</style>