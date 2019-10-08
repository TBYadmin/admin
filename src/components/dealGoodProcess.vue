<template>
    <a-modal v-model="dealGoodProcessVisible" title="商品流程审核" @cancel="cancel" :footer="null" class="add-modal" :width="modalWidth" >
        <div class="wrap">
           <div class="form-wrap">
               <deal-room ref="dealRoom"     v-if="type==='1'" v-on:hideModel="hideModel"></deal-room>
               <deal-ticket ref="dealTicket" v-if="type==='2'" v-on:hideModel="hideModel"></deal-ticket>
           </div>

        </div>
    </a-modal>
</template>

<script>
    import fetch from '@/common/fetch'
    import { message } from 'ant-design-vue'
    import  dealRoom from './dealGood_room'
    import  dealTicket from './dealGood_ticket'
    export default {
        name: "dealGoodProcess",
        data() {
            return {
                modalWidth:'6rem',
                dealGoodProcessVisible: false,
                processId:'',
                type:'1'
            }
        },
        components:{
            dealRoom,dealTicket
        },
        mounted() {
        },
        methods: {
            cancel() {
                this.dealGoodProcessVisible = false
                this.$emit('fetchAgan');
            },
            setdealGoodProcessVisible(val) {
                this.dealGoodProcessVisible = val;
            },

            setprocessId(val){
                this.processId=val;
            },
           hideModel(){
                this.setdealGoodProcessVisible(false);
               this.$emit('fetchAgan');
           },
            setType(val){
                this.type = val;
                return new Promise( function(resolve, reject) {
                    resolve();
                } );
            }

        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }  input::-webkit-input-placeholder ,textarea::-webkit-input-placeholder{ /* WebKit, Blink, Edge */
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