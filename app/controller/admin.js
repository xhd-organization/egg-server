const Controller = require('egg').Controller

class AdminController extends Controller {
  async login() {
    const { ctx, service } = this
    const { username } = ctx.request.body
    if (!username) {
      ctx.throw(404, '缺少参数')
    }
    const res = await service.admin.login(ctx.request.body)
    ctx.helper.success({ ctx, res })
  }

  async userinfo() {
    const { ctx, service } = this
    const userinfo = await service.form.find('pt_user', { ids: ctx.query.token })
    if (!userinfo) {
      ctx.throw(404, 'token错误')
    }
    ctx.helper.success({ ctx, res: { roles: ['admin'], name: userinfo.names, avatar: '', introduction: userinfo.email }})
  }

  // 统计数据
  async index() {
    const { ctx, service } = this
    const num = await service.form.countMonth('downloadrecord', 1, 'createTime')
    const download_num = await service.form.count('downloadrecord')
    const learn_num = await service.form.count('lt_learnrecord')
    const feedback_num = await service.form.count('lt_feedback')
    const feedback_arr = await service.form.findAll('lt_feedback', null, ['ids', 'description', 'createTime', 'type'], [['createTime', 'desc']], 10)
    const wechat_num = await service.form.count('wx_msg')
    const version = await service.form.findAll('pt_version', null, null, [['create_time', 'desc']])
    ctx.helper.success({ ctx, res: { num: num, download_num, learn_num, feedback_num, wechat_num, feedback_arr, version }})
  }

  // 获取菜单
  async getmenu() {
    const { ctx, service } = this
    const system = await service.form.findAll('pt_systems')
    const menu = await service.form.findAll('pt_menu')
    ctx.helper.success({ ctx, res: { system, menu }})
  }

  // 创建模型
  async createmodule() {
    const { ctx, service } = this
    const { name, title } = ctx.request.body
    if (!name && !title) {
      ctx.throw(404, '字段不能为空')
      return false
    }
    const res = await service.admin.createmodule(ctx.request.body)
    ctx.helper.success({ ctx, res })
  }

  // 更新模型
  async updatemodule() {
    const { ctx, service } = this
    const { name, title, moduleid } = ctx.request.body
    if (!name && !title && !moduleid) {
      ctx.throw(404, '字段不能为空')
      return false
    }
    const res = await service.admin.updatemodule(ctx.request.body)
    ctx.helper.success({ ctx, res })
  }

  // 获取模型列表
  async getmodule() {
    const { ctx, service } = this
    const count = await service.form.count('pt_module', { isparent: 'false' })
    const { query: param } = ctx
    const page = param.page ? param.page : 1
    const limit = param.limit ? parseInt(param.limit) : 20
    const offset = (page - 1) * limit
    const module_arr = await service.form.findAll('pt_module', { isparent: 'false' }, ['ids', 'description', 'names'], [['orderids', 'desc']], limit, offset)
    ctx.helper.success({ ctx, res: { items: module_arr, total: count }})
  }

  //  获取模型详情信息
  async getmoduledetail() {
    const { ctx, service } = this
    console.log(ctx.query.moduleid)
    const res = await service.form.find('pt_module', { ids: ctx.query.moduleid })
    ctx.helper.success({ ctx, res })
  }

  // 获取某个模型的字段列表
  async modulefieldlist() {
    const { ctx, service } = this
    const { moduleid } = ctx.query
    if (!moduleid) {
      ctx.throw(404, '字段不能为空')
      return false
    }
    const module_info = await service.form.find('pt_module', { ids: moduleid })
    if (!module_info) {
      ctx.throw(404, '未找到对应的模型数据')
    }
    const field_arr = await service.admin.modulefieldlist(module_info.name, moduleid)
    ctx.helper.success({ ctx, res: field_arr })
  }

  /**
   * 获取字段详情
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T16:23:08+0800
   */
  async modulefielddetail() {
    const { ctx, service } = this
    const { moduleid, fieldid } = ctx.query
    if (!moduleid && !fieldid) {
      ctx.throw(404, '字段不能为空')
      return false
    }
    const field = await service.form.find('pt_field', { id: fieldid, moduleid })
    ctx.helper.success({ ctx, res: field })
  }

  // 添加字段
  async addmodulefield() {
    const { ctx, service } = this
    const { moduleid, field, name, setup, tips, required, minlength, maxlength, pattern, errormsg, classname, type, listorder, status } = ctx.request.body
    if (moduleid && field && name && setup) {
      const is_exits = await service.form.find('pt_field', { moduleid, field })
      if (is_exits) {
        ctx.throw(406, '该字段已存在')
      } else {
        const is_create = await service.form.create('pt_field', { moduleid, field, name, setup, tips, required, minlength, maxlength, pattern, errormsg, classname, type, listorder, status })
        ctx.helper.success({ ctx, res: is_create.insertId })
      }
    } else {
      ctx.throw(404, '缺少字段')
    }
  }

  // 更新字段
  async updatemodulefield() {
    const { ctx, service } = this
    const { fieldid, moduleid, field, name, setup, tips, required, minlength, maxlength, pattern, errormsg, classname, type, listorder, status } = ctx.request.body
    if (fieldid && moduleid && field && name && setup) {
      const is_create = await service.form.update('pt_field', { moduleid, field, name, setup, tips, required, minlength, maxlength, pattern, errormsg, classname, type, listorder, status }, { id: fieldid })
      ctx.helper.success({ ctx, res: is_create.insertId })
    } else {
      ctx.throw(404, '缺少字段')
    }
  }
}

module.exports = AdminController
