const columns = [{
  title: '订单编号',
  dataIndex: 'key',
  key: 'id'
}, {
  title: '收件人',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '联系方式',
  colSpan: 2,
  dataIndex: 'tel',
  key: 'tel'
}, {
  title: '联系方式',
  colSpan: 0,
  dataIndex: 'address',
  key: 'address'
}, {
  title: '详情',
  dataIndex: 'details',
  key: 'details'
}, {
  title: '合计价格',
  key: 'price',
  dataIndex: 'price'
}, {
  title: '实付金额',
  key: 'realprice',
  dataIndex: 'realprice'
}, {
  title: '建立时间',
  dataIndex: 'createDate',
  key: 'createDate'
}, {
  dataIndex: 'payDate',
  title: '付款时间',
  key: 'payDate'
}, {
  dataIndex: 'status',
  title: '状态',
  key: 'status'
}]

const data = [{
  key: 'CGTJ1289183923829YSTY',
  name: '秦进辉',
  tel: 1828921995,
  address: 'New York No. 1 Lake Park',
  details: 'XXXXXXXX x1  黑色；￥44',
  price: 88,
  realprice: 88,
  createDate: '2017-5-12  18:42:44',
  payDate: '2017-5-12  18:42:44',
  status: '已付款'
} ]
export default {
  columns,
  data
}
