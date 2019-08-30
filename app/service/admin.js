const Service = require('egg').Service

class UserService extends Service {
  /**
   * 登录
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T08:44:43+0800
   * @param       {Object}                 param 请求参数对象
   */
  async login(param) {
    const { ctx, service } = this
    const user = await service.form.find('pt_user', { username: param.username })
    if (user) {
      return { token: user.ids }
    }
    ctx.throw(404, '未找到此用户')
  }

  /**
   * 创建模型,初始化字段
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T09:34:19+0800
   * @param       {Object}                 param 创建模型请求参数
   * @returns     {Number}                       正常时返回模型id，否则返回false
   */
  async createmodule(param) {
    const { ctx, service } = this
    const is_exits = await service.form.find('pt_module', { name: param.name })
    if (is_exits) {
      ctx.throw(405, `${param.name}已存在`)
      return false
    }
    const emptytable = param.emptytable === '1' ? '1' : '0'
    const sql_createTable = await service.form.createTable(param.name, emptytable)
    await this.app.mysql.query(sql_createTable)
    const ids = ctx.helper.getToken(param.name)
    const is_create = await service.form.create('pt_module', { ids, title: param.title, isparent: 'false', name: param.name, description: param.description, listfields: param.listfields })
    const sql_createDefaultField = await service.form.createDefaultField(ids, emptytable)
    await service.form.create('pt_field', sql_createDefaultField)
    if (is_create) {
      return ids
    }
    return false
  }

  /**
   * 更新模型信息
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T13:50:42+0800
   * @param       {Object}                 param 请求参数对象
   * @returns     {Boolean}                       true=修改成功， false=修改失败
   */
  async updatemodule(param) {
    const { ctx, service } = this
    const module_info = await service.form.find('pt_module', { ids: param.moduleid })
    if (module_info) {
      if (module_info.name !== param.name) {
        await service.form.updateTableName(module_info.name, param.name)
      }
      const is_update = await service.form.update('pt_module', { name: param.name, title: param.title, description: param.description, listfields: param.listfields }, { ids: param.moduleid })
      if (is_update) {
        return true
      }
    } else {
      ctx.throw(404, '没有发现此模型')
    }
    return false
  }

  /**
   * 获取表的字段信息
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T13:51:49+0800
   * @param       {String}                 name 表名
   * @returns     {Array}                      表的字段信息
   */
  async modulefieldlist(moduleid) {
    const { service } = this
    const field = await service.form.findAll('pt_field', { moduleid, ispost: 1 }, null, [['listorder', 'asc']])
    return field
  }
}

module.exports = UserService
