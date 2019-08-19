const Service = require('egg').Service

class UserService extends Service {
  async login(param) {
    const { ctx, service } = this
    const user = await service.form.find('pt_user', { username: param.username })
    if (user) {
      return { token: user.ids }
    }
    ctx.throw(404, '未找到此用户')
  }

  // 获取表字段
  async modulefield(name) {
    const { service } = this
    const field = await service.form.field(name)
    return field
  }
}

module.exports = UserService
