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
                    <!--<a-form-item label="活动起始日期:" >-->
                    <!--<a-date-picker  :format="dateFormat" v-model="searchForm.startTime"/>-->
                    <!--</a-form-item>-->
                    <!--<a-form-item label="活动结束日期:"  >-->
                    <!--<a-date-picker  :format="dateFormat"  v-model="searchForm.endTime" />-->
                    <!--</a-form-item>-->
                    <a-form-item>
                    <a-button type="primary" @click="fliterQuery">查询</a-button>
                    <a-button type="primary" @click="handleReset">重置</a-button>
                    </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="fresh" style="margin-left: 1rem">刷新</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <span @click="addActivity" class="add-sales"> <i class=" icon iconfont icon-jia"></i> 新增活动</span>
            </a-layout-header>
            <a-layout-content>
        <div class="activities-wrap-content">
            <div class="activities-wrap activities" style="height: 500px;">
                <a-card hoverable style="width:2.7rem;height:3rem;" class="select" v-for="(item,index) in goodList"
                        :key="index" @mouseenter='item.editWrapShow =true' @mouseleave='item.editWrapShow= false'>
                    <div class="img-wrap"><img :src="item.cover" alt=""></div>
                    <div class="figure-discribetion">
                        <p class="fig-name" :title="item.name">{{item.name}}</p>
                        <div class="dis" :title="item.description">{{item.description}}</div>
                    </div>
                    <!--checkbox-->
                    <!--<div class="select-wrap">-->
                        <!--<a-checkbox :checked="item.check"></a-checkbox>-->
                    <!--</div>-->
                    <!--edit-->
                    <transition name='fade'>
                        <div class="edit-wrap" v-show="item.editWrapShow">
                            <span class="option-span edit-span" @click="editItem(item.id)"></span>
                            <!--<span class="option-span" @click="lookItem(item.id)"></span>-->
                            <span class="option-span delete-span" @click="deleteItem(item.id)"></span>
                        </div>
                    </transition>
                </a-card>

            </div>
            <a-pagination v-model="searchForm.current" :total="total" @change="pageChange" :pageSize='6'/>
        </div>
        <!--模态框-->
        <add-activity ref="addActivity" v-on:fetchAgan="fetchAgan"></add-activity>
        <replace-activity ref="replaceActivity" v-on:fetchAgan="fetchAgan"></replace-activity>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
    import addActivity from '@/components/addActivity'
    import replaceActivity from '@/components/replaceActivity'
    import fetch from '@/common/fetch'
    import moment from 'moment';
    import 'moment/locale/zh-cn';

    moment.locale('zh-cn');
    import {message} from 'ant-design-vue'

    export default {
        name: "activity",
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
                qiniu: this.$store.state.qiNiuLink
            }
        },
        components: {
            addActivity, replaceActivity
        },
        mounted() {
            this.getRecodes()
        },
        methods: {
            fliterQuery() {
                this.getRecodes();
            },
            fresh(){
                this.getSales();
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
            addActivity() {
                this.$refs.addActivity.setaddActivityShow(true)
            },
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.addActivityShow = false;
                    this.loading = false;
                }, 3000);
            },
            handleCancel(e) {
                this.addActivityShow = false;
            },
            setAddModal1Visible() {
                this.addActivityShow = false
            },
            pageChange(current) {
                this.searchForm.current = current;
                console.log(this.searchForm.current)
                this.getRecodes();
            },
            fetchAgan() {
                this.getRecodes();
            },
            deleteItem(key) {
                fetch.delete('/shop/activity/' + key).then(res => {
                    console.log(res);
                    message.info(res.msg);
                    this.getRecodes() ;
                })
            },
            lookItem(key) {
                console.log('查看详情')
            },
            editItem(key) {
                this.$refs.replaceActivity.setreplaceActivityShow(true);
                this.$refs.replaceActivity.setactivityId(key);
                fetch.get('/shop/activity/getById/' + key).then(res => {
                    let Json = res.obj;
                    console.log(Json);
                    let qiuNiu = this.$store.state.qiNiuLink;
                    console.log(typeof(moment(Json.beginDate).format('YYYY-MM-DD')))
                    this.$refs.replaceActivity.replaceActivity.form.setFieldsValue(
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
                    this.$refs.replaceActivity.fileList = imgArray;

                })
            },

            /**
             * 获取活动分页
             */
            getRecodes() {
                var parmas = this.searchForm;
                console.log(parmas)
                console.log(parmas.timeRange)
                let requstUrl;
                if (parmas.timeRange !== null) {
                    let timeRange = parmas.timeRange;
                    parmas['start'] = moment(timeRange[0]).format("YYYY-MM-DD");
                    parmas['end'] = moment(timeRange[1]).format("YYYY-MM-DD");
                }
                parmas['page'] = parmas.current
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
                    goodsArray.forEach((item) => {
                        item['editWrapShow'] = false;
                        item['check'] = false;
                        item['cover'] = this.qiniu + '/' + item.banner.split(',')[0]
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
        padding: 0 0.2rem ;
    }

    .ant-form-inline .ant-form-item {
        margin-bottom: 0.1rem;
    }

    .activities-wrap {
        width: 100%;
        height: auto;
    }
    .search-wrap .ant-form-item-label{
        height: 0.4rem;
        line-height: 0.4rem;
    }
    .search-wrap .ant-form-item label{
        height: 0.4rem !important;
        line-height: 0.4rem !important;
    }
    .search-wrap .ant-form-item label{
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
    .head.ant-layout-header{
        height: 1.5rem;
    }
    .sale-search-form-wrap {
        top: 0.2rem;
        bottom: auto;
    }

</style>