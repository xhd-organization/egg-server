const Controller = require('egg').Controller
const fs = require('fs')

class HomeController extends Controller {
  async index() {
    this.ctx.type = 'text/html'
    await this.ctx.render('index', { user: '作者：cnvp' })
  }

  async readfile() {
    const { ctx } = this
    ctx.body = fs.readFileSync('app/public/MP_verify_EXfUzuOggt6KZg4t.txt')
  }
}

module.exports = HomeController
