/**
 * 工具类: 字符串工具类，对象工具类，路径工具类，数组工具类
 */
var stringUtils = {
  /**
     * 字符串拼接方法
     * @param String 拓展参数
     * @returns String
     */
  concat: (first, ...args) => {
    args.forEach((s, i) =>
      Object.prototype.toString.call(s).slice(8, -1) === 'String' || (args[i] = JSON.stringify(s))
    )
    return [first].concat(...args).join('')
  },
  /**
     * 判断字符串是否为空值或者是否为字符串
     * @returns Boolean
     */
  isNull: (str) => {
    return str === '' ||
            Object.prototype.toString.call(str).slice(8, -1) === 'Undefined' ||
            Object.prototype.toString.call(str).slice(8, -1) === 'Null'
  }
}
var objectUtils = {
  /**
     * 判断是否为对象或者空值
     * @returns Boolean
     */
  isNull: (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Null' ||
                Object.prototype.toString.call(o).slice(8, -1) === 'Undefined' ||
                o.toString() === ''
  },
  /**
     * 初始化赋值对象的每个属性为空字符串
     */
  init: (o) => {
    for (let _prop in o) {
      o[_prop] = ''
    }
  },
  /**
     * 对象反射赋值
     * @param o 原对象 Object
     * @param _target 目标对象 Object
     */
  formDataReflector: (o, _target) => {
    if (objectUtils.isNull(o) && objectUtils.isNull(_target)) {
      return
    }
    for (let _prop in o) {
      if (typeof o[_prop] !== 'function' && _target.hasOwnProperty(_prop)) {
        _target[_prop] = o[_prop]
      }
    }
  }
}
var arrayUtils = {
  /**
     * 判断是否是数组
     * @returns Boolean
     */
  isArray: (o) => Object.prototype.toString.call(o).slice(8, -1) === 'Array',

  /**
     * 权限按钮双数组取交集
     * @param dataList 当前页面已有权限数据列表 Array[Object]
     *  Object{tag, method, url}
     * @param reviceList 当前用户拥有权限列表 Array[Object]
     *  Object{method, url, name}
     * 判断依据  url + method
     *  tag 匹配页面标记
     *  name 按钮显示名称 可后台配置修改
     * @returns Array[Object]
     *  Object{method, url, name, tag}
     */
  authOperateIntersect: (dataList, reviceList) => {
    // todo map()
    let list = []
    reviceList.forEach(e => {
      dataList.forEach(ele => {
        if (ele.url === e.url && ele.method === e.method) {
          e.tag = ele.tag
          list.push(e)
        }
      })
    })
    return list
  }
}
var urlUtils = {
  /**
     * url路径批量增加参数
     * @returns String
     */
  addParam: (url, obj) => {
    url += '?'
    for (let _prop in obj) {
      !stringUtils.isNull(obj[_prop]) && (url = url + _prop + '=' + obj[_prop] + '&')
    }
    return url
  },
  /**
     * restful url拼接参数
     * @returns String
     */
  concat: (url, ...patch) => {
    patch.forEach(e => (url = url + '/' + e))
    return url
  }
}
export default {
  stringUtils,
  objectUtils,
  arrayUtils,
  urlUtils
}
