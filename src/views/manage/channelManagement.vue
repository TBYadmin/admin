<template>
    <div class="wrap">
        <a-layout>
            <a-layout-content>
                <div class="channel-wrap">
                    <div class="channel-top">
                        <div class="channel-wrap-top">
                            <div class="row">
                                <div class="cell"></div>
                                <div class="cell">名称</div>
                                <div class="cell">类型</div>
                                <div class="cell">操作</div>
                            </div>
                        </div>

                        <div class="channerl-item" v-for="(item,index) in channelList">

                            <div class="row">
                                <div class="cell">
                                    <!--&lt;!&ndash;<a-radio :checked="item.check" @change="radioItemChange(index)"></a-radio>&ndash;&gt;-->
                                    <!--<span class="circle" :class="item.check? 'active':''"-->
                                          <!--@click="radioItemChange(item,index)"> <i class="iconfont icon-dui1-->
<!--"></i></span>-->
                                </div>
                                <div class="cell"><span>{{item.payChannel| judgeType}}</span></div>
                                <div class="cell">
                                    <div class="img-wrap">
                                        <img :src="item.img" alt="">
                                    </div>
                                </div>
                                <div class="cell option-cell">
                                <span class="option-wrap edit-option-wrap" @click="() => edit(item,index)"><i
                                        class="edit-i"></i>配置参数</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="channel-bottom" ref="channelBottom">
                        <p class="title">支付参数配置</p>
                        <a-form :form="channelSet.form" class="channelSet-form">
                            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="商家Id">
                                <a-input v-decorator="channelSet.mchId"
                                         placeholder="请输入商家Id"></a-input>
                            </a-form-item>

                            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                                         label="appId">
                                <a-input v-decorator="channelSet.appId"
                                         placeholder="请输入appId"></a-input>
                            </a-form-item>
                            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                                         label="appkey">
                                <a-textarea v-decorator="channelSet.appKey"
                                            placeholder="请从密钥-key.pem文件中粘贴"></a-textarea>
                            </a-form-item>
                            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                                         label="文件上传">
                                <a-upload name="file" class="upload-file" :multiple="true" :action="action"
                                          @change="flieChange" v-decorator=" [
                        `flie`,
                        {
                            rules: [{
                                required: flieRequre,
                                message: '请上传证书文件',
                            }],
                        }
                    ]" :fileList="fileList">
                                    <a-button>
                                        <a-icon type="upload"/>
                                        Click to Upload
                                    </a-button>
                                    <span class="flie-icon"></span>
                                </a-upload>

                            </a-form-item>
                            <a-form-item class="btn-form-item">
                                <a-button type="primary" class="backGorundYellow" @click="reset">清空重填</a-button>
                                <a-button type="primary" @click="submit">提交</a-button>
                            </a-form-item>
                        </a-form>
                        <!--验证mask-->
                        <!--<div class="verify-mask" >-->
                        <!---->
                        <!--</div>-->
                        <a-modal class="verify-mask"
                                 title="用户身份二次验证"
                                 :visible="verifyMask"
                                 @cancel="handleCancel"
                                 :getContainer="getContainer"
                                :footer="null"
                                 :width="width"
                        >
                           <div class="verify-content">
                               <a-form :form="verify.form" class="channelSet-form">
                                   <a-form-item :label-col="formItemLayout.qudaoCol"
                                                :wrapper-col="formItemLayout.qudaowrapperCol" label="管理员密码">
                                       <a-input v-decorator="channelSet.mchId"
                                                placeholder="请输入管理员密码"></a-input>
                                   </a-form-item>
                                   <a-form-item >
                                       <span class="surePassWords" @click="surePassWords">确定</span>
                                   </a-form-item>
                               </a-form>
                           </div>
                        </a-modal>
                    </div>
                </div>

            </a-layout-content>
        </a-layout>

    </div>
</template>

<script>
    import ATextarea from "ant-design-vue/es/input/TextArea";
    import fetch from "../../common/fetch";
    import {message} from 'ant-design-vue';
    // const  getContainer=document.getElementById('#channelBottom')
    const formItemLayout = {
        labelCol: {span: 2},
        wrapperCol: {span: 5},
        passCol: {span: 4},
        passLabelCol: {span: 3},
        qudaoCol: {span: 9},
        qudaowrapperCol: {span: 14},
    };
    const labelCol = {
        labelCol: {span: 4},
        wrapperCol: {span: 8},
    };
    export default {
        name: "channelManagement",
        components: {ATextarea},
        data() {
            return {
                verifyMask: true,
                getContainer:()=> this.$refs.channelBottom,
                qiNiu: this.$store.state.qiNiuLink,
                action: '/maintenance/qiniu',
                flieRequre: true,
                width:'5rem',
                formItemLayout,
                labelCol,
                fileList: [],
                channelSet: {
                    form: this.$form.createForm(this),
                    mchId: [
                        `mchId`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入支付渠道名称',
                            }],
                        }
                    ],

                    appKey: [
                        `appKey`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入appkey',
                            }],
                        }
                    ],
                    appId: [
                        `appId`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入appId',
                            }],
                        }
                    ],

                },
                verify:{
                    form: this.$form.createForm(this),
                    passwords: [
                        `passwords`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入管理员密码',
                            }],
                        }
                    ],
                },
                channelList: [
                    // {check:true,text:'支付宝',img:require ('../../assets/images/ali.png')},
                    // {check:false,text:'微信',img:require ('../../assets/images/wechat.png')}
                ]
            }
        },
        filters: {
            judgeType(value) {
                var typeText;
                switch (value) {
                    case '1':
                        typeText = '支付宝';
                        break
                    case  '2':
                        typeText = '微信';
                        break;
                    default:
                        typeText = '银联';
                }
                return typeText
            }
        },
        mounted() {
            this.getChannelList();
        },
        methods: {
            radioItemChange(it, ind) {
                it.check = !it.check;
                if (it.check) {
                    this.channelList.forEach((item, index) => {
                        if (ind == !index) {
                            item.check = false
                        }
                        // } else {
                        //     item.check = false
                        // }
                    })
                }
                // debugger
                // if(it.check=true){
                //     it.check=false
                // }else{

                // }
            },
            flieChange(info) {
                this.fileList = info.fileList
                // debugger
                // if (info.file.status !== 'uploading') {
                //     console.log(info.file, info.fileList);
                // }
                // if (info.file.status === 'done') {
                //     console.log(info.file, info.fileList);
                //
                // } else if (info.file.status === 'error') {
                //     this.$message.error(`${info.file.name} file upload failed.`);
                // }
            },
            edit(item, index) {
                if (!item.check) {
                    this.radioItemChange(item, index)
                }
                this.channelId = item.id;
                this.flieRequre = false;
                if(this.channelId){
                    fetch.get('shop/pay-param/' + item.id).then(res => {
                        console.log(res);
                        let Json = res.obj;
                        let qiniu = this.$store.state.qiNiuLink
                        this.channelSet.form.setFieldsValue({
                            ['mchId']: Json.mchId,
                            ['appId']: Json.appId,
                            ['appKey']: Json.appKey,
                            ['payChannel']: Json.payChannel,
                            ['file']: qiniu + '/' + Json.certPath
                        })
                        this.fileList = [{
                            uid: '1',
                            name: Json.certPath,
                            url: qiniu + '/' + Json.certPath,
                        }]

                    })
                }else{
                    this.reset()
                }


            },
            /**
             * 蒙版
             * */
            handleCancel() {
                // this.verifyMask = false
            },
            /**
             * *确定密码
             * */
             surePassWords(){
                this.verify.form.validateFields((error, values) => {
                    if (!error) {
                    this.verifyMask=false
                    }
                })
            },
            /**
             * 获取支付类型类表
             */
            getChannelList() {

                fetch.get('/shop/pay-param/list', '').then(res => {
                    console.log(res);
                    let chnannelRecods = res.obj;
                    let creatChannerl = [
                        {check: false, payChannel: '1', img: require('../../assets/images/ali.png')},
                        {check: false, payChannel: '2', img: require('../../assets/images/wechat.png')},
                        {check: false, payChannel: '3', img: require('../../assets/images/yinlian.png')}
                    ];
                    creatChannerl.forEach((item, index) => {
                        chnannelRecods.forEach((chnannelRecodsItem) => {
                            if (item.payChannel == chnannelRecodsItem.payChannel) {
                                item['appId'] = chnannelRecodsItem.appId;
                                item['appKey'] = chnannelRecodsItem.appKey;
                                item['mchId'] = chnannelRecodsItem.mchId;
                                item['certPath'] = chnannelRecodsItem.certPath;
                                item['id'] = chnannelRecodsItem.id;
                            }
                        })
                    });
                    console.log(creatChannerl)
                    this.channelList = creatChannerl

                    // console.log(this.channelList.length)
                })
            },
            /**
             * 提交
             */
            submit() {
                let currentChnannelList = this.channelList;
                let checkItem = currentChnannelList.filter(function (item) {
                    return item.check = true
                });
                let channel=checkItem[0].payChannel
                this.channelSet.form.validateFields((error, values) => {

                    if (!error) {
                        console.log(values);
                        let parmas = values;
                        parmas['payChannel']=channel;
                        let certPathArray = this.fileList;
                        if (certPathArray[0].response) {
                            debugger
                            parmas['certPath'] = this.fileList[0].response.obj[0].key;
                        } else {
                            parmas['certPath'] = this.fileList[0].name;

                        }

                        debugger
                        if ( this.channelId !== undefined) {
                            fetch.put('/shop/pay-param/' + this.channelId, parmas).then(res => {
                                console.log(res);
                                message.info('操作成功');
                                this.reset();
                                this.fileList = []
                                this.getChannelList();
                                this.flieRequre = true
                            })

                        } else {
                            fetch.post('/shop/pay-param', parmas).then(res => {
                                console.log(res);
                                message.info('操作成功')
                                this.reset();
                                this.fileList = []
                                this.getChannelList();
                                this.flieRequre = true
                            })

                        }


                    }
                })
            },
            reset() {
                this.channelSet.form.resetFields()
            }
        },


    }
</script>

<style scoped>
    .channel-wrap {
        padding: 0.39rem 0.42rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .channel-wrap-top {
        width: 100%;
        height: 0.6rem;
        background: rgba(220, 220, 220, 1);
        border-top-left-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
        display: table;
    }

    .channerl-item {
        width: 100%;
        height: 0.78rem;
        line-height: 0.78rem;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        display: table;
        margin-bottom: 1px;
    }

    .row {
        width: 100%;
        height: 100%;
        display: table-row;
        overflow: hidden;
        border: 1px solid transparent;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .cell {
        display: table-cell;
        position: relative;
    }

    .channerl-item .cell {
        height: 0.78rem;
        line-height: 0.78rem;
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        color: rgba(97, 100, 103, 1);
        position: relative;
        overflow: hidden;
        padding: 0;

    }

    .channerl-item .cell .img-wrap {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        margin: 0.15rem 0;
    }

    .channel-wrap-top .cell {
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.18rem;
        font-family: 微软雅黑;
        font-weight: 400;
        color: rgba(97, 100, 103, 1);
    }

    .channerl-item .cell:nth-child(1), .channel-wrap-top .cell:nth-child(1) {
        width: 2.5rem;
        text-align: center;
        position: relative;
    }

    .channerl-item .cell:nth-child(2), .channel-wrap-top .cell:nth-child(2) {
        width: 2rem;
        text-align: left;
    }

    .channerl-item .cell:nth-child(3), .channel-wrap-top .cell:nth-child(3) {
        width: 8.5rem;
        text-align: left;
        height: 100%;
    }

    .channerl-item .cell:nth-child(4), .channel-wrap-top .cell:nth-child(4) {
        width: 3rem;
        text-align: center;

    }

    .edit-i {
        position: relative;
        top: 0.01rem;
    }

    .channel-top {
        margin-bottom: 0.2rem;
    }

    .channel-bottom {
        height: 6.23rem;
        background: rgba(255, 255, 255, 1);
        width: 100%;
        border-bottom-left-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
        padding: 0.37rem 0;
        border: 1px solid transparent;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .title {
        font-size: 0.21rem;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(36, 48, 84, 1);
        line-height: 30px;
        text-indent: 0.5rem;
    }

    .channelSet-form .ant-form-item-label label {
        font-size: 0.19rem !important;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: #2B2B2B !important;
        line-height: 30px;
    }

    .apicert {
        text-indent: 0.5rem;
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        color: rgba(43, 43, 43, 1);
        font-weight: 400;

    }

    .apicert span {
        font-weight: bold;
    }

    .sure-passWord {
        position: absolute;
        right: -1.5rem;
        top: -0.05rem;
        display: inline-block;
        width: 1.25rem;
        height: 0.4rem;
        background: rgba(64, 158, 255, 1);
        border-radius: 0.05rem;
        text-align: center;
        color: #fff;
        line-height: 0.4rem;
        cursor: pointer;
    }

    .ant-form-item-control textarea {
        width: 5.02rem;
        height: 1rem !important;
        border: 1px solid rgba(220, 220, 220, 1);
        border-radius: 0.06rem;
        resize: none;
    }

    .ant-form-item-control textarea {

    }

    .channelSet-form .ant-input:hover {
        border-color: #409EFF;
    }

    .upload-file .ant-btn.ant-btn-default {
        height: 0.4rem;
    }

    .flie-icon {
        display: inline-block;
        width: 0.41rem;
        height: 0.33rem;
        background: url("../../assets/images/flie.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -0.6rem;
        top: -0.05rem;
    }

    .img-wrap img {
        width: 100% !important;
        height: 100%;
        position: relative;
        top: -0.08rem;

    }

    .anticon.anticon-upload {
        color: rgba(166, 166, 166, 1);
    }

    .ant-btn.ant-btn-default {
        color: rgba(166, 166, 166, 1);
    }

    .btn-form-item {
        padding-left: 1rem;
        border: 1px solid transparent;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .cell .circle {
        display: inline-block;
        width: 0.32rem;
        height: 0.32rem !important;
        border: 0.02rem solid rgba(66, 159, 255, 1);
        border-radius: 50%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        line-height: 0.28rem;
        text-align: center;

    }

    .circle .iconfont {
        color: #fff;
        font-size: 0.28rem;
    }

    .circle.active {
        background: rgba(66, 159, 255, 1);
    }

    .cell span {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 0.3rem;
        line-height: 0.3rem;
        /*width: 1rem;*/
    }

    .option-cell span {
        width: 1rem;
    }


    .ant-modal-mask{
        position: absolute;
    }
    .surePassWords{
        display: inline-block;
        width:0.78rem;
        height:0.36rem;
        background:rgba(64,158,255,1);
        box-shadow:0px 2px 6px 0px rgba(64,158,255,0.6);
        border-radius:4px;
        color:#fff;
        text-align: center;
        font-size: 0.14rem;
        line-height: 0.36rem;
        float: right;
        cursor: pointer;
    }
</style>