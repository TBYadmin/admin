<template>
    <a-modal v-model="signVisible" title="新增促销" @cancel="cancel" :footer="null" class="add-modal" :width="modalWidth">
        <div class="wrap">
            <!-- 促销编辑 -->
            <div>
                <a-form :form="signForm.form">
                    <a-form-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 8}">
                        <a-input placeholder="输入活动名称" v-decorator="signForm.name"/>
                    </a-form-item>
                    <a-form-item label="活动描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
                        <a-textarea placeholder="输入活动描述" col="5" row="30" v-decorator="signForm.description"/>
                    </a-form-item>
                    <a-form-item label="活动时间" :label-col="{ span: 4 }">
                        <a-range-picker :format="dateFormat" v-decorator="signForm.ActiveDate"/>
                    </a-form-item>

                    <a-form-item label="报名时间" :label-col="{ span:4}">
                        <a-range-picker :format="dateFormat" v-decorator="signForm.enrollDate"/>
                    </a-form-item>

                    <a-form-item label="活动标签" :label-col="{ span: 4 } " :wrapper-col="{ span:8 }">
                        <a-input placeholder="请输入活动标签" v-decorator="signForm.label"></a-input>
                    </a-form-item>
                </a-form>
            </div>
            <!--<div>-->
            <!--&lt;!&ndash;<a-button type="primary">刷新商品</a-button>&ndash;&gt;-->
            <!--<br>-->
            <!--</div>-->
            <div class="goodList addgoodList">
                <span class="add-sale-title">选择促销商品</span>
                <div class="card-wrap" v-if="pagenationShow" style="text-align: center;">
                    <a-card hoverable style="width: 3.3rem;height:1.5rem;display:inline-block;" class="select"
                            v-for="(item,index) in MerchantGoods">
                        <div class="img-wrap"><img :src="qiniu+ '/' +item.cover.split(',')[0]" alt=""></div>
                        <div class="figure-discribetion">
                            <p>{{item.name}}</p>
                            <!--<div class="dis">商品名</div>-->
                        </div>
                        <!--checkbox-->
                        <div class="select-wrap">
                            <a-checkbox :checked="item.check" @click="checkboxClick(item)"></a-checkbox>
                        </div>
                    </a-card>
                </div>

                <div class="tips" v-if="!pagenationShow">暂无商品，请先添加商品</div>
            </div>
            <a-pagination @change="pageonChange" :current="goodcurrent" :total="total" v-if="pagenationShow"/>
            <div class="btn-group">
                <a-button type="primary" @click="signSubmint">提交</a-button>
                <a-button type="primary" class="backGorundYellow" @click="closeModel">取消</a-button>
            </div>
        </div>
    </a-modal>
</template>

<script>
    import fetch from '@/common/fetch'
    import moment from 'moment';
    import 'moment/locale/zh-cn';

    moment.locale('zh-cn');
    import {message} from 'ant-design-vue'

    export default {
        name: "signUpActivity",
        data() {
            return {
                modalWidth: '10.8rem',
                signForm: {
                    form: this.$form.createForm(this),
                    name: [`name`],
                    description: [`description`],
                    ActiveDate: [`ActiveDate`],
                    enrollDate: [`enrollDate`],
                    label: [`label`,],
                },
                MerchantGoods: [],
                goodcurrent: 1,
                goodChooseArray: [],
                dateFormat: 'YYYY-MM-DD',
                timeRange: [],
                pagenationShow: false,
                total: 0,
                avtivityId: '',
                signVisible: false,
                qiniu: this.$store.state.qiNiuLink,


            }
        },
        mounted() {


        },
        methods: {
            setAvtivityId(val) {
                this.avtivityId = val
            },
            onChange(date, dateString) {
                console.log(moment(date[0]).valueOf());
                this.timeRange = date
                console.log(date, dateString);

            },
            selectChange(value) {
                switch (value) {
                    case '0':
                        this.discount = true;
                        this.fullReduction = false;
                        break;
                    default:
                        this.fullReduction = true;
                        this.discount = false;
                }
            },
            pageonChange(current) {
                this.goodcurrent = current;
                this.getGoods();
            },
            signSubmint() {
                let parmas = {};
                parmas['activityId'] = this.avtivityId;
                parmas['productIdList'] = this.goodChooseArray;
                fetch.post('/shop/activity-product',parmas ).then(res => {
                    console.log(res);
                    message.info(res.msg);
                    this.signVisible = false;
                    this.signForm.form.resetFields();
                    this.fileList = [];
                    this.goodChooseArray = [];
                    this.$emit('fetchAgan');


                })
            },
            checkboxClick(item) {
                item.check = !item.check;
                let itGoodId = item.id;
                if (item.check) {
                    this.goodChooseArray.push(itGoodId)
                } else {
                    let historygoodChooseArray = this.goodChooseArray;
                    // this.goodChooseArray.remove(itGoodId);
                    historygoodChooseArray.forEach(function (item, index, arr) {
                        if (item == itGoodId) {
                            historygoodChooseArray.splice(index, 1);
                        }
                    });
                    this.goodChooseArray = historygoodChooseArray;
                }
                console.log(this.goodChooseArray)

            },
            /**
             * 获取商家商品
             */
            getGoods() {
                fetch.get('/product/table?size=6&current=' + this.goodcurrent).then(res => {
                    console.log(res);
                    let getMerchantGoods = res.obj.records;
                    let chooseArray = this.goodChooseArray;
                    getMerchantGoods.forEach((item) => {
                        if (chooseArray.includes(item.id)) {
                            item['check'] = true;
                        } else {
                            item['check'] = false;
                        }

                    })
                    this.MerchantGoods = res.obj.records;
                    console.log(this.MerchantGoods);
                    if (parseInt(res.obj.total) > 0) {
                        this.pagenationShow = true
                    }
                    this.total = parseInt(res.obj.total)
                })
            },

            closeModel() {
                this.signVisible = false;
                this.$emit('fetchAgan');
                this.signForm.form.resetFields()
            },
            cancel() {
                this.signVisible = false
                this.$emit('fetchAgan');
            },
            setsignVisible(val) {
                this.signVisible = val;
                this.$emit('fetchAgan');
            }
        }


    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }

    .add-full-reduction-rule.icon.iconfont.icon-xinzeng {
        color: #409EFF;
        font-size: 0.25rem;
        margin-left: 0.3rem;
    }

    .full-reduction-wrap {
        width: 6rem;
        background: royalblue;
        display: inline-block;
    }

    .ant-form-item-control .full-reduction-wrap:last-child {
        display: inline-block;
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