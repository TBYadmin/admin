<template>
    <a-modal v-model="editgoodDetail" title="修改商品详情" @cancel="cancel" :footer="null" class="add-modal" :width="modalWidth">
    <div class="wrap rich-text-eidt">
        <mavon-editor v-model="value" @save="save"    :defaultOpen="defaultOpen"  @imgAdd="imgAdd"  ref="md"
        />
    </div>
    </a-modal>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "goodDetailEdit",
        data(){
            return{
                editgoodDetail:false,
                modalWidth:'10rem',
                value:'',
                defaultOpen:'preview',
                qiNiu:'http://image.supconit.net',
            }
        },
        methods:{
            seteditgoodDetail(value){
                this.editgoodDetail=true
            },
            cancel(){
                this.editgoodDetail=false
            },
            save(){
                console.log(this.value);
                console.log(this.$refs.md.d_render);
                this.content=this.$refs.md.d_render
            },
            imgAdd(pos, $file){
                console.log($file);
                let formdata = new FormData();
                formdata.append('file', $file);
                axios.post('/maintenance/qiniu', formdata, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then(res => {
                    console.log(res.data.obj[0].key);
                    let url=this.qiNiu+ '/'+res.data.obj[0].key;
                    this.$refs.md.$img2Url(pos, url);
                })
            }
        }
    }
</script>

<style scoped>
.wrap{
    width:100% ;
    height: 10rem;
}
</style>