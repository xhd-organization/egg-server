'use strict'

const Service = require('egg').Service

class ActionTokenService extends Service {
  /**
   * 根据用户的唯一标识，生成对应的token信息
   * @date        2019-08-01
   * @author cnvp
   * @anotherdate 2019-08-01T10:05:24+0800
   * @param       {string}                 uid [用户唯一标识符]
   * @returns      {object}                     [token对象信息]
   */
  async apply(uid) {
    const { ctx } = this
    return ctx.app.jwt.sign({
      data: {
        uid: uid
      }
    }, ctx.app.config.jwt.secret, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) })
  }
}

module.exports = ActionTokenService
