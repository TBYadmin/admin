<template>
    <a-modal title="查看流程" v-model="visible" @cancel="cancel" :footer="null" :width=width
    >
        <div class="process-wrap">
            <div class="img-wrap"><img :src=imgSrc alt=""></div>
            <div class="process-item-wrap ">
                <p class="process-Name">详细流程:</p>
                <p>发起人:{{List.startUserId}}</p>
                <p> 流程名称: {{List.processDefinitionName}}</p>
                <p> 开始时间: {{List.startTime | formatDate}}</p>
            </div>
        </div>
    </a-modal>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "process",
        data() {
            return {
                visible: false,
                imgSrc: '',
                width:600,
                List: {}
            }
        },
        mounted() {
            if (this.processId = '') {

            } else {


            }
        },
        filters: {
            formatDate(time) {
                var d = new Date(time);
                var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return datetime
            }

        },

        methods: {
            cancel() {
                this.setVisible(false)
            },
            setVisible(val) {
                this.visible = val
            },
            setprocessimg(img) {
                this.imgSrc = '/runtime/process-instances/' + img + '/diagram'
            },
            setprocessList(val) {
                this.List = val
            }

        }
    }
</script>

<style scoped>
    .process-wrap {
        width: 800px;
        height: 600px;
    }
.process-item-wrap p{
    color: #333;
}
    .process-item-wrap .process-Name {
        font-size: 18px;
        color: #000;
    }
</style>