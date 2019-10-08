<template>
    <a-modal v-model="addqualificationsqhow" :title="title" :footer="null" class="add-modal" @cancel="closeAdd" :width="modalWidth">
        <div class="wrap">
            <!-- 新增资质 -->
            <a-form >
                <a-form-item :label="'资质类型'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                    <a-select v-model="type" @change="typeChange">
                        <a-select-option value="1">酒店</a-select-option>
                        <a-select-option value="2">景区</a-select-option>
                        <!--<a-select-option value="2">餐饮</a-select-option>-->
                    </a-select>
                </a-form-item>
                <div class="form-wrap">
                    <add-hotel-form v-if="type=='1'" v-on:modelHide="modelHide" ref="addQualificationsHotel" ></add-hotel-form>
                    <add-view-form v-if="type=='2'" v-on:modelHide="modelHide" ref="addQualificationsView"  ></add-view-form>

                </div>
            </a-form>
        </div>
    </a-modal>
</template>

<script>
    // import Utils from '@/common/utils'
    import Config from '@/config/api'
    import fetch from '@/common/fetch'
    import axios from 'axios'
    import {message} from 'ant-design-vue'
    import addHotelForm from "./addQualification_hotel"
    import addViewForm from "./addQualification_view"
    import map from './mapDrag'

    export default {
        name: "addQualifications",
        data() {
            return {
                title:'新增资质',
                type: '1',
                addqualificationsqhow:false,
                modalWidth:'6rem'

            }
        },
        components: {
            addHotelForm,addViewForm
        },

        methods: {
            typeChange(value) {
                this.type = value
            },
            remove(){
                this.setAddModel(false);
            },
             closeAdd(){
                 this.setAddModel(false);
            },
            setAddModel(val) {
                if(val){
                }else{
                    switch (this.type){
                        case '1':
                            this.$refs.addQualificationsHotel.formaddqualification.form.resetFields();
                            this.$refs.addQualificationsHotel.fileList = [];
                            this.$refs.addQualificationsHotel.qualificationfileList = [];
                            this.$refs.addQualificationsHotel.starfileList = [];
                            break;
                        case '2':
                            this.$refs.addQualificationsView.formaddqualification.form.resetFields();
                            this.$refs.addQualificationsView.fileList = [];
                            this.$refs.addQualificationsView.qualificationfileList = [];
                            this.$refs.addQualificationsView.starfileList = [];
                    }


                }
                this.addqualificationsqhow = val;


            },
            modelHide(){
                this.setAddModel(false);
                 this.$emit('fetchAgan');
            },
            setType(val){
                this.type=val;
                return new Promise( function(resolve, reject) {
                    resolve();
                } );
            },
            setvalidation(val){
                this.validation=val
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