/* eslint-disable */
<template>
  <a-layout>
    <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit">
      <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
        <template v-if="pane.key == 1">
          <!-- 图片管理 -->
          <a-layout>
            <a-layout-header class="head">
              <a-form :form="searchForm" @submit="handleSearch" layout="inline">
                <a-form-item :label="'图片类型'">
                  <a-select v-decorator="['type', {initialValue: '0'}]">
                    <a-select-option value="0">酒店</a-select-option>
                    <a-select-option value="1">景区</a-select-option>
                    <a-select-option value="2">餐饮</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item :label="'图片名称'">
                  <a-input v-decorator="[`name`]" placeholder="关键字"/>
                </a-form-item>

                <a-button type="primary" html-type="submit">确定</a-button>
                <a-button type="primary" @click="handleReset">重置</a-button>
              </a-form>
            </a-layout-header>
            <a-layout-content>
              <a-card hoverable style="width: 240px">
                <img alt="example" src="../../assets/images/test.jpg" slot="cover">
                <a-card-meta title="Europe Street beat">
                  <template slot="description">www.instagram.com</template>
                </a-card-meta>
              </a-card>
            </a-layout-content>
          </a-layout>
        </template>
        <template v-else>
          <!-- 图片编辑 -->
          <a-form :form="form[pane.key]">
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
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-layout>
</template>
<script>
const columns = [{
  title: '图片类型',
  dataIndex: 'type',
  scopedSlots: { customRender: 'type' }
}, {
  title: '图片名称',
  dataIndex: 'name',
  scopedSlots: { customRender: 'name' }
}, {
  title: '编号',
  dataIndex: 'key',
  scopedSlots: { customRender: 'key' }
}, {
  title: '地址',
  dataIndex: 'address',
  scopedSlots: { customRender: 'address' }
}, {
  title: '注册时间',
  dataIndex: 'date',
  scopedSlots: { customRender: 'date' }
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' }
}]
const data = []
for (let i = 0; i < 10; i++) {
  data.push({
    key: i.toString(),
    name: `图片名称 ${i}`,
    type: `图片类型`,
    address: `London Park no. ${i}`,
    date: `2018年3月${i}日`
  })
}
const plainOptions = []
for (let i = 0; i < 10; i++) {
  plainOptions.push({
    key: i.toString(),
    url: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
  })
}
export default {
  name: 'qualification',
  data () {
    const panes = [
      { title: '图片管理', content: '', key: '1' },
      { title: '新建图片', content: '', key: '2' }
    ]
    this.cacheData = data.map(item => ({ ...item }))

    return {
      columns,
      activeKey: panes[0].key,
      panes,
      data,
      newTabIndex: 0,

      form: [],
      indeterminate: false,
      checkAll: false,
      plainOptions
    }
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    handleReset () {
      this.searchForm.resetFields()
    },
    handleSearch (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line
          console.log("Received values of form: ", values)
          // this.$store.dispatch()
        }
      })
    },
    add () {
      const panes = this.panes
      const activeKey = `新增${this.newTabIndex++}`
      panes.push({ title: `新增图片${this.newTabIndex++}`, content: `Content of new Tab ${activeKey}`, key: activeKey })
      this.panes = panes
      this.activeKey = activeKey
      this.form[activeKey] = this.$form.createForm(this)
    },
    remove (targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.key !== targetKey)
      if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = panes[lastIndex].key
      }
      this.panes = panes
      this.activeKey = activeKey
    },
    onChange (checkedList) {
      console.log(checkedList)
      // this.indeterminate = !!checkedList.length && (checkedList.length < plainOptions.length)
      // this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    }

  }

}
</script>
<style scoped>
  .ant-layout-header{
    background: transparent;
  }

</style>
