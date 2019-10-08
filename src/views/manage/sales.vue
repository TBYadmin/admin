<template>
    <div class="wrap">
        <!-- 促销管理 -->
        <a-layout>
            <a-layout-header class="head">
                <div class="search-form-wrap sale-search-form-wrap">
                    <a-form layout="inline">
                        <a-form-item label="活动名称:">
                            <a-input v-model="searchForm.name"/>
                        </a-form-item>
                        <a-form-item label="商品状态:">
                            <a-select style="width:1.5rem;" defaultValue="0" v-model="searchForm.status">
                                <a-select-option value="0">上架中</a-select-option>
                                <a-select-option value="1"> 已下架</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="促销日期:">
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

                <span @click="addSale" class="add-sales"> <i class=" icon iconfont icon-jia"></i> 新增促销</span>

            </a-layout-header>
            <a-layout-content>
                <div class="activities-wrap">
                    <a-card hoverable style="width:2.7rem;height:3rem;"
                            class="select" v-for="(item,index) in goodList"
                            :key="index" @mouseenter='item.editWrapShow =true' @mouseleave='item.editWrapShow= false'>
                        <div class="img-wrap"><img :src="qiNiu +'/'+item.cover.split(',')[0]" alt=""></div>
                        <div class="figure-discribetion">
                            <p class="fig-name" :title="item.name">{{item.name}}</p>
                            <div class="dis" :title="item.description">{{item.description}}</div>
                        </div>
                        <transition name='fade'>
                            <div class="edit-wrap" v-show="item.editWrapShow">
                                <span class="option-span" @click="editItem(item.id)"></span>
                                <span class="option-span delete-span" @click="deleteItem(item.id)"></span>
                            </div>
                        </transition>
                    </a-card>
                </div>
                <a-pagination v-model="searchForm.current" :total="total" @change="pageChange"  :pagesSize="searchForm.size"/>
            </a-layout-content>
        </a-layout>
        <!--模态框-->
        <add-sales ref="addSales" v-on:fetchAgan="fetchAgan"></add-sales>
        <replace-sales ref="replaceSales"></replace-sales>
    </div>
</template>

<script>
    import addSales from '@/components/addSales'
    import replaceSales from '@/components/replaceSales'
    import fetch from '@/common/fetch'
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {mapState, mapGetters} from 'vuex'

    moment.locale('zh-cn');
    import {message} from 'ant-design-vue'

    export default {
        name: "sales",
        data() {
            return {
                searchForm: {
                    name: '',
                    status: '0',
                    timeRange: [],
                    size: 10,
                    current: 1
                },
                goodList: [],
                dateFormat: 'YYYY-MM-DD',
                total: 50,

            }
        },
        components: {
            addSales, replaceSales
        },
        mounted() {
            this.getSales()
        },
        computed: mapState({
            qiNiu: state => state.qiNiuLink
        }),
        methods: {
            handleReset() {
                this.searchForm = {
                    name: '',
                    status: '0',
                    timeRange: [],
                    size: 10,
                    current: 1
                }
            },
            fliterQuery() {
                this.getSales();
            },
            fresh(){
                this.getSales();
            },
            addSale() {
                this.$refs.addSales.setaddSalesVisible(true);
                this.$refs.addSales.getGoods();
            },
            pageChange(current) {
                this.searchForm.current = current;
                this.getSales()
            },

            editItem(key) {
                console.log('edit');
                this.$refs.replaceSales.setreplaceSalesVisible(true);
                fetch.get('/shop/sales/getById/' + key).then(res => {
                    console.log(res.obj);
                    let Json = res.obj;
                    this.$refs.replaceSales.settype(Json.type + '').then(res => {
                        console.log(JSON.parse(Json.ruleJson).type)
                        let disType = JSON.parse(Json.ruleJson).type + '';
                        if (disType == 0) {
                            this.$refs.replaceSales.salesForm.form.setFieldsValue({
                                ['beginDate']: moment(parseInt(Json.beginDate)),
                                ['endDate']: moment(parseInt(Json.endDate)),
                                ['name']: Json.name,
                                ['description']: Json.description,
                                ['discount']: JSON.parse(Json.ruleJson).discount
                            })
                        } else {
                            let ruleArrayObject = JSON.parse(Json.ruleJson);
                            // debugger;
                            this.$refs.replaceSales.setfullReductionNumber(ruleArrayObject.length).then(res => {
                                ;
                                for (var i = 0; i < ruleArrayObject.length; i++) {
                                    this.$refs.replaceSales.salesForm.form.setFieldsValue({
                                        ['full' + i]: ruleArrayObject[i].full,
                                        ['minus' + i]: ruleArrayObject[i].reduction
                                    })
                                }
                            })
                            this.$refs.replaceSales.salesForm.form.setFieldsValue(

                                {
                                    ['beginDate']: moment(parseInt(Json.beginDate)),
                                    ['endDate']: moment(parseInt(Json.endDate)),
                                    ['name']: Json.name,
                                    ['description']: Json.description,
                                    // ['full']: (JSON.parse(Json.ruleJson))[0].full,
                                    // ['minus']: (JSON.parse(Json.ruleJson))[0].reduction
                                })
                        }
                        /**
                         * 获取促销绑定的商品
                         */
                        var boundGoodsArray = Json.productIdList;
                        // debugger
                        let boundGoodsString = '';
                        boundGoodsArray.forEach((item) => {
                            boundGoodsString += item + ',';
                            console.log(boundGoodsString)
                            let getBoundParamsString = boundGoodsString.slice(0, boundGoodsString.length - 1);
                            fetch.get('/shop/sales/getProducts/' + getBoundParamsString).then(res => {
                                console.log(res)
                                this.$refs.replaceSales.setMerchantGoods(res.obj.obj)
                            })
                        })
                    })
                })
            },
            deleteItem(key) {
                console.log(key)
                fetch.delete('/shop/sales/' + key).then(res => {
                    console.log(res)
                    message.info(res.msg);
                    this.getSales()
                })
            },

            /**
             * 获取促销记录
             */
            getSales() {

                var parmas = this.searchForm;
                console.log(parmas)
                console.log(parmas.timeRange[0]);
                let current = parmas.current ;
                let requstUrl;
                if (parmas.timeRange.length > 0) {
                    let timeRange = parmas.timeRange;
                    parmas['start'] = moment(timeRange[0]).format("YYYY-MM-DD");
                    parmas['end'] = moment(timeRange[1]).format("YYYY-MM-DD");
                    requstUrl = '/shop/sales/page4B?size=' + parmas.size + '&current=' + current + '&status=' + parmas.status + '&startTime=' + parmas.start + '&endTime=' + parmas.end + '&description=' + parmas.name
                } else {
                    requstUrl = '/shop/sales/page4B?size=' + parmas.size + '&current=' + current + '&description=' + parmas.name
                }
                console.log(parmas);
                fetch.get(requstUrl).then(res => {
                    console.log(res)
                    let goodsArray = res.obj.records;
                    this.total = parseInt(res.obj.total);
                    goodsArray.forEach((item) => {
                        item['editWrapShow'] = false;
                        item['check'] = false;
                    });
                    this.goodList = goodsArray;
                    console.log(this.goodList)
                })
            },
            fetchAgan() {
                this.getSales();
            },

        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }

    .search-form-wrap .ant-input {
        width: 1.5rem;
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

    .add-sales .iconfont {
        font-size: 0.15rem;
    }

    .sale-search-form-wrap {
        top: 0.2rem;
        bottom: auto;
    }

    .head.ant-layout-header {
        height: 1.5rem;
    }
</style>