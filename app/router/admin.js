/**
 * 后台路由地址
 * @date        2019-08-16
 * @author cnvp
 * @anotherdate 2019-05-16T09:06:57+0800
 */
module.exports = app => {
  const { router, controller } = app
  const adminRouter = router.namespace('/admin')
  // const jwt = middleware.checkToken()
  router.get('/', controller.home.index)
  adminRouter.post('/login', controller.admin.login) // 登录
  adminRouter.post('/logout', controller.admin.logout) // 登出
  adminRouter.get('/index', controller.admin.index) // 首页统计数据
  adminRouter.get('/getmenu', controller.admin.getmenu) // 获取菜单
  adminRouter.get('/userinfo', controller.admin.userinfo) // 获取用户基本信息
  adminRouter.get('/getmodule', controller.admin.getmodule) // 获取模型
  adminRouter.post('/createmodule', controller.admin.createmodule) // 创建模型
  adminRouter.post('/updatemodule', controller.admin.updatemodule) // 更新模型
  adminRouter.post('/deletemodule', controller.admin.deletemodule) // 删除模型
  adminRouter.get('/getmoduledetail', controller.admin.getmoduledetail) // 模型详情
  adminRouter.get('/modulefieldlist', controller.admin.modulefieldlist) // 获取模型字段列表
  adminRouter.get('/modulefielddetail', controller.admin.modulefielddetail) // 获取字段的信息
  adminRouter.post('/addmodulefield', controller.admin.addmodulefield) // 添加字段
  adminRouter.post('/updatemodulefield', controller.admin.updatemodulefield) // 更新字段
  adminRouter.post('/deletemodulefield', controller.admin.deletemodulefield) // 删除字段
  adminRouter.post('/sortfield', controller.admin.sortfield) // 字段排序

  adminRouter.get('/getcategorylist', controller.admin.getcategorylist) // 获取栏目列表
  adminRouter.post('/createcategory', controller.admin.createcategory) // 获取栏目列表
  adminRouter.post('/updatecategory', controller.admin.updatecategory) // 更新栏目信息
  adminRouter.post('/deletecategory', controller.admin.deletecategory) // 删除栏目
  adminRouter.post('/sortcategory', controller.admin.sortcategory) // 栏目排序
  adminRouter.get('/getcategorydetail', controller.admin.getcategorydetail) // 获取栏目详情

  adminRouter.get('/getcontentlist', controller.admin.getcontentlist) // 获取内容信息列表
  adminRouter.post('/createcontent', controller.admin.createcontent) // 创建内容
  adminRouter.post('/updatecontent', controller.admin.updatecontent) // 更新内容
  adminRouter.post('/deletecontent', controller.admin.deletecontent) // 刪除内容

  // adminRouter.get('/datasource', controller.admin.datasource) // 获取数据源
  adminRouter.post('/upload', controller.adminAccess.upload)

  adminRouter.post('/updateCategoryPermission', controller.admin.updateCategoryPermission) // 更新栏目信息和栏目角色权限
  adminRouter.post('/createCategoryPermission', controller.admin.createCategoryPermission) // 创建栏目信息和栏目角色权限
  adminRouter.post('/deleteCategoryPsermission', controller.admin.deleteCategoryPsermission) // 删除信息和栏目角色权限

  adminRouter.post('/user', controller.admin.user) // 创建用户
}
