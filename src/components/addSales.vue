<template>
    <a-modal v-model="addSalesVisible" title="新增促销" @cancel="cancel" :footer="null" class="add-modal" :width="modalWidth">
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
                        <a-select style="width: 120px" v-model="discountType" @change="selectChange">
                            <a-select-option value="0">打折</a-select-option>
                            <a-select-option value="1">满减</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'折扣比例'" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }"
                                 v-if="discountType==='0'">
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
                        <span class="add-full-reduction-rule icon iconfont icon-xinzeng" style="" @click="addFullReduction"></span>

                    </a-form-item>
                    <a-form-item label="促销时间" :label-col="{ span: 4 }">
                        <!--:disabledDate="disabledDate"-->
                        <a-range-picker @change="onChange" v-decorator="salesForm.rangeDate" />
                    </a-form-item>
                    <a-form-item :label="'上传促销图片'" :label-col="{ span: 4 }">
                        <a-upload v-decorator="salesForm.imgsList"
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
            <a-pagination @change="pageonChange" :current="goodcurrent" :total="total" v-if="pagenationShow"  />
            <div class="btn-group">
                <a-button type="primary" @click="addSalesSubmint">提交</a-button>
                <a-button type="primary" class="backGorundYellow"  @click="closeModel">取消</a-button>
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
        name: "addSales",
        data() {
            return {
                modalWidth:'12rem',
                fullReduction: false,
                discount: false,
                salesForm: {
                    form: this.$form.createForm(this),
                    name: [
                        `name`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入促销名称',
                            }],

                        }
                    ],
                    description: [
                        `description`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入促销描述',
                            }],

                        }
                    ],
                    rangeDate: [
                        `rangeDate`,
                        {
                            rules: [{
                                required: true,
                                message: '请输入促销时间',
                            }],

                        }
                    ],
                    imgsList: [
                        `imgsList`,
                        {
                            rules: [{
                                required: true,
                                message: '请上传商品图片',
                            }],
                            // initialValue: aptitudeDefault
                        }
                    ]
                },
                action: '/maintenance/qiniu',
                fileList: [],
                previewVisible: false,
                previewImage: '',
                discountType: '0',
                addSalesVisible: false,
                MerchantGoods: [],
                goodcurrent: 1,
                qiniu: this.$store.state.qiNiuLink,
                goodChooseArray: [],
                dateFormat: 'YYYY-MM-DD',
                timeRange: [],
                pagenationShow: false,
                total: 0,
                fullReductionNumber:1

        }
        },
        mounted() {


        },
        methods: {
            // disabledDate(current) {
            //     return current && current < moment().endOf('day');
            // },
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
            addFullReduction(){
              this.fullReductionNumber++
            },
            pageonChange(current) {
                this.goodcurrent = current;
                this.getGoods();
            },
            addSalesSubmint() {
                this.salesForm.form.validateFields((error, values) => {
                    if (!error) {
                        console.log(values);
                        let parmas = values;
                        parmas['productIdList'] = this.goodChooseArray;
                        parmas['type'] = this.discountType;
                        switch (this.discountType) {
                            case '0':
                                let discountItem={};
                                discountItem['type'] = this.discountType;
                                discountItem['discount'] = parmas.discount;
                                parmas['ruleJson'] = discountItem;
                                break;
                            default:
                                let ruleJson=[];
                               for(var i=0;i<this.fullReductionNumber;i++){
                                   let fullReductionItem={};
                                   fullReductionItem['full']=parmas['full'+i];
                                   fullReductionItem['type']=this.discountType;
                                   fullReductionItem['reduction']=parmas['minus'+i];
                                   ruleJson.push(fullReductionItem);
                               }
                                parmas['ruleJson'] = ruleJson;
                        }

                        let timeRange = parmas.rangeDate;
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
                        parmas['beginDate'] = moment(timeRange[0]).format('YYYY-MM-DD')
                        parmas['endDate'] = moment(timeRange[1]).format('YYYY-MM-DD')
                        console.log(parmas);
                        fetch.post('/shop/sales/saveWithProducts', values).then(res => {
                            console.log(res);
                            message.info('促销新增成功');
                            this.addSalesVisible = false;
                            this.salesForm.form.resetFields();
                            this.fileList=[];
                            this.goodChooseArray=[];
                            this.$emit('fetchAgan');

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
                    let historygoodChooseArray=this.goodChooseArray;
                    // this.goodChooseArray.remove(itGoodId);
                    historygoodChooseArray.forEach(function(item, index, arr) {
                        if(item ==itGoodId) {
                            historygoodChooseArray.splice(index, 1);
                        }
                    });
                    this.goodChooseArray= historygoodChooseArray;
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
                    let chooseArray=this.goodChooseArray;
                    getMerchantGoods.forEach((item) => {
                        if(  chooseArray.includes(item.id)){
                            item['check'] = true;
                        }else{
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
                this.addSalesVisible = false;
                this.$emit('fetchAgan');
                this.salesForm.form.resetFields()
            },
            cancel() {
                this.addSalesVisible = false
                this.$emit('fetchAgan');
            },
            setaddSalesVisible(val) {
                this.addSalesVisible = val;
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
    .add-full-reduction-rule.icon.iconfont.icon-xinzeng{
        color: #409EFF;
        font-size: 0.25rem;
        margin-left: 0.3rem;
    }
    .full-reduction-wrap{
        width: 6rem;
        background: royalblue;
        display: inline-block;
    }
    .ant-form-item-control .full-reduction-wrap:last-child{
        display: inline-block;
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