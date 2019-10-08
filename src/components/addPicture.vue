<template>
    <div class="wrap">
        <!-- 图片编辑 -->
        <a-form :form="pictureAdd">
            <a-form-item :label="'商品名称'">
                <p>商品1</p>
            </a-form-item>
            <a-form-item :label="'商品说明'">
                <p>这是一段关于商品的说明</p>
            </a-form-item>
        </a-form>
        <div></div>
        <div>
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                <a-checkbox
                        :indeterminate="indeterminate"
                        @change="onCheckAllChange"
                        :checked="checkAll"
                >Check all</a-checkbox>

                <a-button type="primary">删除所选</a-button>
                <a-button type="primary">设为封面</a-button>
                <a-button type="primary">上传图片</a-button>
            </div>
            <br>
            <template v-for="o in plainOptions">
                <a-checkbox @change="onChange" :key='"check" + o.key'></a-checkbox>
                <img :src="o.url" :key=o.key width="100px"/>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addPicture",
        data(){
            return{
                pictureAdd:this.$form.createForm(this),
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