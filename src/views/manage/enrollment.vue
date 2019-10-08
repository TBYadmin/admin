<template>
    <div class="wrap">
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap sale-search-form-wrap">
                    <a-form layout="inline">
                        <a-form-item label="活动名称:">
                            <a-input v-model="searchForm.name"/>
                        </a-form-item>
                        <a-form-item label="商品状态:">
                            <a-select style="width: 120px" v-model="searchForm.state">
                                <a-select-option value="0">上架中</a-select-option>
                                <a-select-option value="1">已下架</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="活动日期:">
                            <a-range-picker v-model="searchForm.timeRange"/>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fliterQuery">查询</a-button>
                            <a-button type="primary" @click="handleReset">重置</a-button>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-layout-header>
            <a-layout-content>
                <div class="activities-wrap-content">
                    <div class="activities-wrap activities" style="height: 500px;">
                        <a-card hoverable style="width:2.7rem;height:3rem;"
                                class="select" v-for="(item,index) in goodList"
                                :key="index" @mouseenter='item.editWrapShow =true'
                                @mouseleave='item.editWrapShow= false'>
                            <div class="img-wrap"><img :src="item.cover" alt=""></div>
                            <div class="figure-discribetion">
                                <p class="fig-name" :title="item.name">{{item.name}}</p>
                                <div class="dis" :title="item.description">{{item.description}}</div>
                            </div>
                            <transition name='fade'>
                                <div class="edit-wrap" v-show="item.editWrapShow">
                                    <span class="option-span" @click="lookItem(item.id)"></span>
                                    <span class="option-span sign-up " @click="signUp(item.id)"></span>
                                </div>
                            </transition>
                            <!--提示遮罩-->
                            <div class="activity-mask" v-if="item.tips !==''">
                                {{item.tips}}
                            </div>
                        </a-card>

                    </div>
                    <a-pagination v-model="searchForm.current" :total="total" @change="pageChange" :pageSize='6'/>
                </div>

                <view-activity ref="viewActivity"></view-activity>
                <sign-activity ref="signActivity"></sign-activity>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>

    import viewActivity from '@/components/viewActivitiy'
    import  signActivity from '@/components/signUpActivity'
    import fetch from '@/common/fetch'
    import moment from 'moment';
    import 'moment/locale/zh-cn';

    moment.locale('zh-cn');
    import {message} from 'ant-design-vue'

    export default {
        name: "enrollment",
        data() {
            return {
                dateFormat: 'YYYY-MM-DD',
                searchForm: {
                    name: '',
                    state: '0',
                    current: 1,
                    size: 6,
                    timeRange: [],
                },
                goodList: [],
                addActivityShow: false,
                loading: false,
                total: 0,
                 qiniu: this.$store.state.qiNiuLink,
            }
        },
        components: {
            viewActivity,signActivity
        },
        mounted() {
            this.getRecodes();

        },
        methods: {



            fliterQuery() {
                this.getRecodes();
            },
            fresh(){
                this.getRecodes();
            },
            handleReset() {
                this.searchForm = {
                    name: '',
                    status: '0',
                    timeRange: [null, null],
                    size: 6,
                    current: 1
                }
            },
            pageChange(current) {
                this.searchForm.current = current;
                console.log(this.searchForm.current)
                this.getRecodes();
            },
            lookItem(key) {
                this.$refs.viewActivity.setviewActivityShow(true);
                this.$refs.viewActivity.setactivityId(key);
                fetch.get('/shop/activity/getById/' + key).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    let qiuNiu = this.$store.state.qiNiuLink;
                    console.log(typeof(moment(Json.beginDate).format('YYYY-MM-DD')))
                    this.$refs.viewActivity.viewActivity.form.setFieldsValue(
                        {
                            ['name']: Json.name,
                            ['description']: Json.description,
                            ['rule']: Json.description,
                            ['ActiveDate']: [moment( parseInt(Json.beginDate)), moment(parseInt(Json.endDate))],
                            ['enrollDate']: [moment(parseInt(Json.enrollBegin)), moment(parseInt(Json.enrollEnd))],
                            ['label']: Json.label,
                        })
                    let imgArray = [];
                    let JsonImageArray = Json.banner.split(',');
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
                    this.$refs.viewActivity.fileList = imgArray;

                })

            },
            /**
             * 报名
             * */
            signUp(key){
                this.$refs.signActivity.setsignVisible(true);
                this.$refs.signActivity.setAvtivityId(key);
                this.$refs.signActivity.getGoods()
                fetch.get('/shop/activity/getById/' + key).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    console.log(typeof(moment(Json.beginDate).format('YYYY-MM-DD')))
                    this.$refs.signActivity.signForm.form.setFieldsValue(
                        {
                            ['name']: Json.name,
                            ['description']: Json.description,
                            ['ActiveDate']: [moment(parseInt(Json.beginDate)), moment(parseInt(Json.endDate))],
                            ['enrollDate']: [moment(parseInt(Json.enrollBegin)), moment(parseInt(Json.enrollEnd))],
                            ['label']: Json.label,
                        })
                })
//
            },

            /**
             * 获取活动分页
             */
            getRecodes() {
                var parmas = this.searchForm;
                console.log(parmas);
                console.log(parmas.timeRange);
                let requstUrl;
                if (parmas.timeRange !== null) {
                    let timeRange = parmas.timeRange;
                    parmas['start'] = moment(timeRange[0]).format("YYYY-MM-DD");
                    parmas['end'] = moment(timeRange[1]).format("YYYY-MM-DD");
                }
                parmas['page'] = parmas.current ;
                if (parmas.timeRange[0] == null || parmas.timeRange[1] == null) {
                    requstUrl = '/shop/activity/page4B?size=' + parmas.size + '&current=' + parmas.page + '&name=' + parmas.name
                } else {
                    requstUrl = '/shop/activity/page4B?size=' + parmas.size + '&current=' + parmas.page + '&status=' + parmas.state + '&startTime=' + parmas.start + '&endTime=' + parmas.end + '&name=' + parmas.name
                }
                console.log(parmas);
                fetch.get(requstUrl).then(res => {
                    console.log(res)
                    this.total = parseInt(res.obj.total);
                    console.log(this.total)
                    let goodsArray = res.obj.records;
                    //let 获取当前时间匹配活动是否已结束或者报名已结束；
                    let currentTimeStamp = moment(new Date()).valueOf();
                    goodsArray.forEach((item) => {
                        item['editWrapShow'] = false;
                        item['check'] = false;
                        item['cover'] = this.qiniu + '/' + item.banner.split(',')[0];
                        if (currentTimeStamp >= parseInt(item.enrollBegin) && currentTimeStamp <= parseInt(item.enrollEnd)) {
                            item['tips'] = ''
                        } else if (currentTimeStamp < parseInt(item.enrollBegin)) {
                            item['tips'] = '暂未开启报名'
                        } else {
                            item['tips'] = '活动报名已结束'
                        }

                    });
                    this.goodList = goodsArray;
                    console.log(this.goodList)
                })
            }
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }

    .ant-form.ant-form-inline {
        padding: 0 0.2rem;
    }

    .ant-form-inline .ant-form-item {
        margin-bottom: 0.1rem;
    }

    .activities-wrap {
        width: 100%;
        height: auto;
    }

    .search-wrap .ant-form-item-label {
        height: 0.4rem;
        line-height: 0.4rem;
    }

    .search-wrap .ant-form-item label {
        height: 0.4rem !important;
        line-height: 0.4rem !important;
    }

    .search-wrap .ant-form-item label {
        height: 0.4rem !important;
        line-height: 0.4rem !important;
    }

    .add-sales {
        position: absolute;
        bottom: 0;
        left: 50px;
        width: 1.75rem;
        height: 0.56rem;
        background: rgba(64, 158, 255, 1);
        border-radius: 0.07rem;
        line-height: 0.56rem;
        text-align: center;
        /*font-size:0.22rem;*/
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        font-size: 0.17rem;
        font-size: 0.17rem;

    }

    .head.ant-layout-header {
        height: 1.5rem;
    }

    .activities-wrap {
        padding-top: 0;
    }
    .activity-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 400;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 0.08rem;
        line-height: 3rem;
        text-align: center;
        color: #d8dbe4;
        font-size: 0.2rem;
    }
</style>