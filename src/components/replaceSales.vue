<template>
    <a-modal v-model="replaceSalesVisible" title="促销详情" @cancel="cancel" :footer="null" class="add-modal" :width="modalWidth">
        <div class="wrap">
            <!-- 促销编辑 -->
            <div>
                <a-form :form="salesForm.form">
                    <a-form-item :label="'促销名称'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                        <a-input v-decorator="salesForm.name" placeholder="请输入促销名称"/>
                    </a-form-item>
                    <a-form-item :label="'促销说明'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input v-decorator="salesForm.description" placeholder="请输入促销说明"/>
                    </a-form-item>
                    <a-form-item :label="'促销规则'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                        <a-select style="width: 120px" v-model="discountType" @change="selectChange" :disabled="disabled">
                            <a-select-option value="0">打折</a-select-option>
                            <a-select-option value="1">满减</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'折扣比例'" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }"
                                 v-if="discountType=='0'">
                        <a-input placeholder="请输入折扣比例"
                                 v-decorator="[`discount`,{rules: [{ required:discount, message: '请输入折扣比例' }]}]"></a-input>
                    </a-form-item>
                    <a-form-item :label="'满减'" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" v-else>

                        <div class="full-reduction-wrap" v-for="(item,index) in fullReductionNumber" v-bind:key="index">
                            满:
                            <a-input-number v-decorator=" [ `full`+index,{rules: [{required:fullReduction,}],} ]"/>
                            -- 减:
                            <a-input-number v-decorator="[
                            `minus`+index,
                            {
                            rules: [{
                            required:fullReduction,
                            }],

                            }
                            ]"/>

                        </div>
                    </a-form-item>

                        <a-form-item label="开始时间" :label-col="{ span: 7 }"  style="display: inline-block;width: 49%;">
                            <a-date-picker :format="dateFormat" v-decorator="salesForm.beginDate" />
                        </a-form-item>
                        <a-form-item label="结束时间" :label-col="{ span: 7 }"  v-decorator="salesForm.endDate" style="display: inline-block;width: 49%;">
                            <a-date-picker :format="dateFormat" v-decorator="salesForm.endDate" />
                        </a-form-item>


                </a-form>
            </div>
            <div>
                <!--<a-button type="primary">刷新商品</a-button>-->
                <br>
            </div>
            <div class="goodList addgoodList" style="height:4rem;">
                <div class="card-wrap">
                    <a-card hoverable style="width: 250px;height:110px;display:inline-block;" class="select"
                            v-for="(item,index) in MerchantGoods.slice((goodcurrent-1)*4,goodcurrent*4)">
                        <div class="img-wrap"><img :src="qiniu+ '/' +item.cover.split(',')[0]" alt=""></div>
                        <div class="figure-discribetion">
                            <p>{{item.name}}</p>
                            <div class="dis">{{item.introduction}}</div>
                        </div>
                        <!--checkbox-->
                        <div class="select-wrap">
                            <a-checkbox :checked="item.check" @click="checkboxClick(item)"></a-checkbox>
                        </div>
                    </a-card>
                </div>
            </div>
            <a-pagination @change="pageonChange" :current="goodcurrent" :total="MerchantGoods.length" :page-size="4"/>
        </div>
    </a-modal>
</template>

<script>
    import fetch from '@/common/fetch'
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    moment.locale('zh-cn');
    export default {
        name: "repalceSales",
        data() {
            return {
                modalWidth:'6rem',
                fullReduction: false,
                discount: false,
                salesForm: {
                    form: this.$form.createForm(this),
                    name: [
                        `name`,
                        {
                            rules: [{
                                required: false,
                                message: '请输入促销名称',
                            }],

                        }
                    ],
                    description: [
                        `description`,
                        {
                            rules: [{
                                required: false,
                                message: '请输入促销描述',
                            }],

                        }
                    ],
                    beginDate:[
                        `beginDate`,
                        {
                            rules: [{
                                required: false,
                                message: '请输入促销开始时间',
                            }],

                        }
                    ],
                    endDate:[
                        `endDate`,
                        {
                            rules: [{
                                required: false,
                                message: '请输入促销结束时间',
                            }],

                        }
                    ],
                },
                discountType: '0',
                replaceSalesVisible: false,
                MerchantGoods: [],
                goodcurrent: 1,
                qiniu: this.$store.state.qiNiuLink,
                goodChooseArray: [],
                dateFormat:'YYYY-MM-DD',
                timeRange:[],
                disabled:true,
                fullReductionNumber:1

            }
        },
        mounted() {


        },
        methods: {

            onChange(date, dateString) {
                console.log(moment(date[0]).valueOf());
                this.timeRange=date
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
            setfullReductionNumber(val){
                this.fullReductionNumber=val;
                return new Promise( function(resolve, reject) {
                    resolve();
                } );
            },
            pageonChange(current) {
                this.goodcurrent = current;
            },
            addSalesSubmint() {
                this.salesForm.form.validateFields((error, values) => {
                    if (!error) {
                        console.log(values);
                        let parmas = values;
                        parmas['productIdList'] = this.goodChooseArray;
                        parmas['type'] = this.discountType;
                        let ruleJson = {};
                        ruleJson['type'] = this.discountType;
                        switch (this.discountType) {
                            case '0':
                                ruleJson['discount'] = parmas.discount;
                                break;
                            default:
                                ruleJson['full'] = parmas.full;
                                ruleJson['reduction'] = parmas.minus;
                        }
                        parmas['ruleJson'] = ruleJson
                        let Times=this.timeRange
                        console.log(Times[0]);
                        parmas['beginDate']=moment(Times[0]).valueOf();
                        parmas['endDate']=moment(Times[1]).valueOf();
                        console.log(parmas);
                        fetch.post('/shop/sales/saveWithProducts', values).then(res => {
                            console.log(res)

                        })
                    }

                })
            },
            checkboxClick(item) {
                item.check = !item.check;
                let itGoodId = item.id;
                if (item.check) {
                    this.goodChooseArray.push(itGoodId)
                } else {
                    this.goodChooseArray.remove(itGoodId);
                }
                console.log(this.goodChooseArray)
            },
            closeModel() {
                this.replaceSalesVisible= false;
                this.salesForm.form.resetFields()
            },
            cancel() {
                this.replaceSalesVisible = false
            },
            setreplaceSalesVisible(val) {
                this.replaceSalesVisible = val
            },
            settype(val){
                this.discountType=val;
                return new Promise( function(resolve, reject) {
                    resolve();
                } );
            },
            setMerchantGoods(val){
                this.MerchantGoods=val;
            }

        }


    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }
    .addgoodList .figure-discribetion{
        margin-top: 0.1rem !important;
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

    input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #A6A6A6;
        font-family: 微软雅黑;
        font-size: 0.17rem;
        letter-spacing: 1px;
    }


</style>