/**
 * 后台路由地址
 * @date        2019-05-16
 * @author cnvp
 * @anotherdate 2019-05-16T09:06:57+0800
 */
module.exports = app => {
  const { router, controller } = app
  const adminRouter = router.namespace('/admin')
  // const jwt = middleware.checkToken()
  router.get('/', controller.home.index)
  adminRouter.post('/login', controller.admin.login) // 登录
  adminRouter.get('/getmenu', controller.admin.getmenu) // 获取菜单
  adminRouter.get('/userinfo', controller.admin.userinfo) // 获取用户基本信息
  adminRouter.get('/index', controller.admin.index) // 首页统计数据
  adminRouter.get('/getmodule', controller.admin.getmodule) // 首页统计数据
  adminRouter.get('/modulefield', controller.admin.modulefield) // 模型字段
  adminRouter.get('/getmoduledetail', controller.admin.getmoduledetail) // 模型详情
}
