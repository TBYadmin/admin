<template>
    <a-modal v-model="addgoodModelShow" :title="title" @cancel="cancel" :footer="null" class="add-modal" :width="modalWidth">
        <div class="wrap">
            <!-- 新增商品 -->
            <a-form >
                <a-form-item :label="'商品类型'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                    <a-select v-model="type" @change="typeChange"  :disabled="typeDisabled">
                        <a-select-option value="1">客房</a-select-option>
                        <a-select-option value="2">门票</a-select-option>
                        <!--<a-select-option value="2">餐饮</a-select-option>-->
                    </a-select>
                </a-form-item>
                <div class="form-wrap">
                    <add-good-hotel v-if="type=='1'"  v-on:hideModel="hideModel" ref="addGoodHotel"></add-good-hotel>
                    <add-good-ticket v-if="type=='2'"  v-on:hideModel="hideModel" ref="addGoodTicket"></add-good-ticket>
                </div>
            </a-form>
        </div>
    </a-modal>
</template>

<script>
    import fetch from '@/common/fetch'
    import { message } from 'ant-design-vue'
    import addGoodHotel from './addGood_hotel'
    import addGoodTicket from './addGood_ticket'
    export default {
        name: "addGood",
        data() {
            return {
                modalWidth:'6rem',
                addgoodModelShow: false,
                type:'1',
                title:'新增商品',
                typeDisabled:false
            }
        },
        components:{
            addGoodHotel,addGoodTicket
        },
        mounted() {
        },
        methods: {
            typeChange(val){
                this.type=val;
            },
            cancel() {
                this. setaddgoodModelShow(false);
                this.$emit('fetchAgan');
            },
            setaddgoodModelShow(val) {
                if(val){
                }else {
                    switch (this.type) {
                        case '1':
                            this.$refs.addGoodHotel.addGoodform.form.resetFields();
                            this.$refs.addGoodHotel.fileList = [];
                            break;
                        case '2':
                            this.$refs.addGoodTicket.addGoodform.form.resetFields();
                            this.$refs.addGoodTicket.fileList = [];
                    }
                }
                this.addgoodModelShow = val;
            },
            hideModel(){
                this.setaddgoodModelShow(false);
                this.$emit('fetchAgan');
            },
            settypeDisabled(val){
                this.typeDisabled=val
            }
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
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