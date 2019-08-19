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

  // 获取某个模型字段
  async modulefield() {
    const { ctx, service } = this
    const field_feedback = await service.admin.modulefield('lt_feedback')
    ctx.helper.success({ ctx, res: field_feedback })
  }
}

module.exports = AdminController
