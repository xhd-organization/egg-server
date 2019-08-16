'use strict'
/**
 * 路由配置总入口
 */
module.exports = app => {
  require('./router/admin')(app)
}
