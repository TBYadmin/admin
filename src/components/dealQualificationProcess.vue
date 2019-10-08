<template>
    <a-modal v-model="dealQualificationProcessShow" title="资质流程审核" :footer="null" class="add-modal" @cancel="closeDeal" :width="modalWidth">
        <div class="wrap">
            <!-- 资质流程 -->
            <a-form >
                <a-form-item :label="'资质类型'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                    <a-select v-model="type" :disabled="true">
                        <a-select-option value="1">酒店</a-select-option>
                        <a-select-option value="2">景区</a-select-option>
                    </a-select>
                </a-form-item>
                <div class="form-wrap">
                    <deal-hotel v-if="type=='1'" ref="dealHotel" v-on:hideModel="hideModel"></deal-hotel>
                    <deal-view v-if="type=='2'" ref="dealView"   v-on:hideModel="hideModel"></deal-view>
                </div>
            </a-form>
        </div>
    </a-modal>
</template>

<script>

    import dealHotel from './dealQualification_hotel'
    import dealView from './dealQualification_view'

    export default {
        name: "dealQualificationProcess",
        data() {
            return {
                type: '1',
                action: '/maintenance/qiniu',
                uploadShow: false,
                dealQualificationProcessShow: false,
                previewVisible: false,
                previewImage: '',
                fileList: [],
                processId: '',
                modalWidth:'6rem'
            }
        },
        components: {
            dealHotel,dealView
        },
        methods: {
            setdealQualificationProcessShow(val) {
                this.dealQualificationProcessShow = val
            },
            closeDeal() {
                this.dealQualificationProcessShow = false
            },
            setprocessId(val) {
                this.processId = val;
            },
            hideModel() {
                this.setdealQualificationProcessShow(false);
                this.$emit('fetchAgan');
            },
            setType(val){
                this.type=val;
                return new Promise( function(resolve, reject) {
                    resolve();
                } );
            }
        }
    }
</script>

<style scoped>
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