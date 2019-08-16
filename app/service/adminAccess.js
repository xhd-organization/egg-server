'use strict'

const Service = require('egg').Service

class AdminAccessService extends Service {
  /**
   * 管理员后台登录
   * @date        2019-08-01
   * @author cnvp
   * @anotherdate 2019-08-01T10:03:08+0800
   * @param       {object}                 payload [请求参数对象]
   * @returns      {object}                         [返回登录的token标识]
   */
  async login(payload) {
    const { ctx, service } = this
    const admin = await service.admin.findByUser(payload.username)
    if (!admin) {
      ctx.throw(404, 'admin not found')
    }
    const verifyPsw = await ctx.compare(payload.password, admin.password)
    if (!verifyPsw) {
      ctx.throw(404, 'admin password is error')
    }
    const sessionObj = await service.form.find('session', { uid: admin.uid, source: payload.source })
    let token = ''
    if (sessionObj) {
      await service.adminAccess.update({ token: sessionObj.token, expire_in: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) }, admin.uid)
      token = sessionObj.token
    } else {
      token = await service.actionToken.apply(admin.uid)
      // token = token.split('.')[1]
      await service.adminAccess.create({ uid: admin.uid, source: 5, token, expire_in: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) })
    }

    // 生成Token令牌
    return { token: token }
  }

  async index(token) {
    return this.app.mysql.get('session', { token: token })
  }

  async show(uid) {
    return this.app.mysql.get('session', { uid: uid })
  }

  async update(info, uid) {
    return this.app.mysql.update('session', info, { where: { uid: uid } })
  }

  async create(info) {
    return this.app.mysql.insert('session', info)
  }

  async delete(param) {
    return this.app.mysql.delete('session', param)
  }

  async logout(token) {
    const { service } = this
    const isDelete = await service.adminAccess.delete({ token })
    return isDelete
  }

  async resetPsw(values) {
    const { ctx, service } = this
    // ctx.state.admin 可以提取到JWT编码的data
    const _id = ctx.state.admin.data._id
    const admin = await service.admin.find(_id)
    if (!admin) {
      ctx.throw(404, 'admin is not found')
    }

    const verifyPsw = await ctx.compare(values.oldPassword, admin.password)
    if (!verifyPsw) {
      ctx.throw(404, 'admin password error')
    } else {
      // 重置密码
      values.password = await ctx.genHash(values.password)
      return service.admin.findByIdAndUpdate(_id, values)
    }
  }

  async current(payload) {
    const { ctx, service } = this
    // ctx.state.admin 可以提取到JWT编码的data
    // const _id = ctx.state.admin.data._id
    if (payload.token) {
      const isToken = await service.adminAccess.index(payload.token)
      if (isToken) {
        const admin = await service.admin.show(isToken.uid)
        const role = await service.role.show(admin.role)
        return {
          roles: [admin.role],
          uid: admin.uid,
          username: admin.username,
          introduction: role.name
        }
      }
    }
    ctx.throw(404, 'admin not found')
  }

  // 修改个人信息
  async resetSelf(values) {
    const { ctx, service } = this
    // 获取当前用户
    const _id = ctx.state.admin.data._id
    const admin = await service.admin.find(_id)
    if (!admin) {
      ctx.throw(404, 'admin is not found')
    }
    return service.admin.findByIdAndUpdate(_id, values)
  }

  // 更新头像
  async resetAvatar(values) {
    const { ctx, service } = this
    await service.upload.create(values)
    // 获取当前用户
    const _id = ctx.state.admin.data._id
    const admin = await service.admin.find(_id)
    if (!admin) {
      ctx.throw(404, 'admin is not found')
    }
    return service.admin.findByIdAndUpdate(_id, { avatar: values.url })
  }
}

module.exports = AdminAccessService
