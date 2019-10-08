/**
 * 与后台约定的静态配置
 * API
 */
var baseUrl = ''
const host = '/platform'
const api = {
  login: '/platform/login',
  logout: '/security/logout',
  // qualification
  qualification: '/aptitude/table',
  scenic: '/aptitude/scenic',
  hotel: '/aptitude/hotel'

}
const pageSizeConfig = {
  normal: [10, 20, 50, 100]
}
const status = {
  SUCCESS: true,
  ERROR: false
}

var setHost = host => (baseUrl = host + baseUrl)
var getBaseUrl = () => baseUrl

export default {
  api,
  pageSizeConfig,
  getBaseUrl,
  host,
  status,
  setHost
}
