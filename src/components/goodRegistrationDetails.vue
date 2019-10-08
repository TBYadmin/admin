<template>
    <a-modal v-model="goodRegistrationDetailsShow" title="活动报名审核" @cancel="cancel" class="add-modal" :footer="null"
             :width="modalWidth">
        <div class="wrap">
            <a-form :form="goodRegistrationDetails.form">
                <a-form-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 8}">
                    <a-input placeholder="输入活动名称" v-decorator="goodRegistrationDetails.name"/>
                </a-form-item>
                <a-form-item label="活动描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20}">
                    <a-textarea placeholder="输入活动描述" col="5" row="15"
                                v-decorator="goodRegistrationDetails.description"/>
                </a-form-item>
                <a-form-item label="活动时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 12}">
                    <!--<a-range-picker :format="dateFormat" v-decorator="goodRegistrationDetails.ActiveDate" :disabledDate="disabledDate"/>-->
                    <a-input v-decorator="goodRegistrationDetails.ActiveDate"></a-input>
                </a-form-item>
            </a-form>
            <div class="goodList addgoodList">
                <span class="add-sale-title">活动参与商品</span>
                <div class="card-wrap" style="text-align: center;">
                    <a-card hoverable style="width: 3.3rem;height:1.5rem;display:inline-block;" class="select"
                            v-for="(item,index) in bindGoods">
                        <div class="img-wrap">
                            <img :src="qiniu+ '/' +item.cover.split(',')[0]" alt="">
                        </div>
                        <div class="figure-discribetion">
                            <p>{{item.name}}</p>
                            <div class="dis">{{item.introduction}}</div>
                        </div>
                        <!--checkbox-->
                    </a-card>
                </div>
            </div>
            <a-pagination @change="pageonChange" :current="goodcurrent" :total="total" :pageSize="pageSize"/>
            <div class="btn-group">
                <a-button type="primary" @click="pass">通过</a-button>
                <a-button type="primary" class="backGorundYellow"  @click="rejected">驳回</a-button>
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
        name: "goodRegistrationDetails",
        data() {
            return {
                goodRegistrationDetailsShow: false,
                modalWidth: '7.2rem',
                dateFormat: 'YYYY-MM-DD',
                goodRegistrationDetails: {
                    form: this.$form.createForm(this),
                    name: [`name`],
                    ActiveDate: [`ActiveDate`],
                    description: [`description`],
                },
                bindGoods: [],
                qiniu: this.$store.state.qiNiuLink,
                goodArray: '',
                goodcurrent: 1,
                total: 0,
                pageSize: 4,
                processId:''

            }
        },

        methods: {
            setGoodRegistrationDetailsShow(val) {
                this.goodRegistrationDetailsShow = val;
            },
            cancel() {
                this.goodRegistrationDetailsShow = false;
            },
            setGoodArray(val) {
                this.goodArray = val;
            },
            setprocessId(val){
                this.processId=val;
            },
            pageonChange(page) {
                this.goodcurrent = page
            },
            pass(){
                fetch.put('/flowable/'+this.processId,{result: '同意'}).then((res)=>{
                    console.log(res);
                    message.info(res.msg);
                    this.setGoodRegistrationDetailsShow(false);
                    this.$emit('fetchAgan');

                })
            },
            rejected(){
                fetch.put('/flowable/'+this.processId, {result: '驳回'}).then((res)=>{
                    console.log(res);
                    message.info(res.msg);
                    this.setGoodRegistrationDetailsShow(false);
                    this.$emit('fetchAgan');

                })
            },
            getDetail(key) {
                fetch.get('/shop/activity/getById/' + key).then(res => {
                    let activityDetail = res.obj;
                    console.log(activityDetail);
                    this.goodRegistrationDetails.form.setFieldsValue({
                        ['name']: activityDetail.name,
                        ['description']: activityDetail.description,
                        ['ActiveDate']: moment(parseInt(activityDetail.beginDate)).format("YYYY-MM-DD") + '至' + moment(parseInt(activityDetail.endDate)).format("YYYY-MM-DD")
                    });
                    //获取商品
                    fetch.get('/product/table/more/' + (this.goodArray).join(',')).then(res => {
                        this.bindGoods = res.obj;
                        this.total = res.obj.length
                    })

                })

            }
        },

    }
</script>

<style scoped>
    .addgoodList .figure-discribetion {
        margin-top: 0;
    }
    .addgoodList{
        height: 3rem;
    }
</style>