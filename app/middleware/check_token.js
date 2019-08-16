'use strict'

module.exports = (option, app) => {
  return async function(ctx, next) {
    const token = ctx.query.token || ctx.request.body.token || ctx.header['admin-token']
    if (token) {
      try {
        ctx.app.jwt.verify(token, ctx.app.config.jwt.secret)
        await next()
      } catch (err) {
        ctx.body = {
          msg: err.message,
          code: 401
        }
      }
    } else {
      ctx.body = {
        msg: '缺少token参数',
        code: 404
      }
    }
  }
}
