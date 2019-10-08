<template>
  <a-layout>
    <a-layout-header class="head">
      订单管理
      订单列表
    </a-layout-header>
    <a-layout-content>
      <a-layout>
        <a-layout-header class="head">搜索条件</a-layout-header>
        <a-layout-content>
          <a-form :form="form" @submit="handleSearch" layout="inline">
            <a-form-item>
              <a-input v-decorator="[`code`]" placeholder="请输入订单编号"/>
            </a-form-item>
            <a-form-item>
              <a-date-picker v-decorator="[`date`]" placeholder="请输入起始事件"/>
            </a-form-item>
            <a-form-item :label="'状态'">
              <a-select v-decorator="['status', {initialValue: '2'}]">
                <a-select-option value="0">未完成</a-select-option>
                <a-select-option value="1">已完成</a-select-option>
                <a-select-option value="2">全部</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="'每页显示'">
              <a-select v-decorator="['count', {initialValue: '5'}]">
                <a-select-option value="5">5</a-select-option>
                <a-select-option value="10">10</a-select-option>
                <a-select-option value="50">50</a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" html-type="submit">确定</a-button>
          </a-form>
        </a-layout-content>
      </a-layout>
      <a-layout>
        <a-layout-header class="head">
          订单信息
          <a href="javascript:;" class="btn" type="primary">打印表格</a>
        </a-layout-header>
        <a-layout-content>
          <a-table :columns="columns" :dataSource="data">
            <template slot="name" slot-scope="text">
              {{text}}
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script>
import Data from '@/data/order'
export default {
  name: 'order',
  data () {
    return {
      form: this.$form.createForm(this),
      columns: Data.columns,
      data: []
    }
  },
  mounted () {
    this.data = Data.data
  },
  methods: {
    handleSearch (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line
          console.log("Received values of form: ", values)
          this.$router.push({ path: '/order', replace: true })
        }
      })
    }
  }
}
</script>
<style>
.btn {
  float: right;
}
</style>
