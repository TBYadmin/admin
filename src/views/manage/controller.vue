<template>
    <div class="wrap">
        <div class="filter-wrap">
            <a-button type="primary" @click="updateIndex">更新索引</a-button>
            <a-button type="primary" @click="deleteIndex">删除索引</a-button>
        </div>

    </div>
</template>

<script>
    import fetch from '@/common/fetch'
    import {message} from 'ant-design-vue'

    export default {
        name: "controller",
        methods: {
            updateIndex() {
                fetch.post('/search/aptitude', {}).then(res => {
                    message.info('数据更新成功')
                })
            },
            deleteIndex(){
                fetch.delete('/search/aptitude', {}).then(res => {
                    message.info('数据删除成功')
                })
            }

        }
    }

</script>

<style scoped>
    .filter-wrap {
        padding: 0.5rem 0.5rem;
    }

</style>