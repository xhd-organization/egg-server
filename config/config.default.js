const cn = require('./cn_default') // 基础文字配置文件
const code = require('./code') // 错误码
const path = require('path')
const fs = require('fs')
module.exports = appInfo => {
  const config = exports = {}
  config.name = '奇缘网'

  // use for cookie sign key, should change to your own and keep security
  config.keys = '123456'

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(__dirname, '../favicon.ico'))
  }
  // add your config here
  // 加载中间件
  config.middleware = ['notfoundHandler', 'errorHandler', 'gzip']

  // 只对 /api 前缀的 url 路径生效
  config.errorHandler = {
    // match: '/api'
  }

  config.gzip = {
    threshold: 1024 // 小于 1k 的响应体不压缩
  }

  config.security = {
    domainWhiteList: [
      'http://127.0.0.1:8080',
      'http://127.0.0.1:7001',
      'http://127.0.0.1:9527',
      'http://192.168.16.154:9527',
      'https://open.weixin.qq.com'
    ],
    methodnoallow: {
      enable: true
    },
    csrf: {
      enable: false,
      ignore: ['/api/', '/admin/login'],
      headerName: 'Admin-Token', // csrfToken
      cookieName: 'csrfToken', // csrfToken
      ignoreJSON: false // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    }
  }

  config.logger = {
    outputJSON: false
  }

  config.view = {
    root: path.join(appInfo.baseDir, 'app/views'),
    mapping: {
      '.html': 'nunjucks'
    }
  }

  config.nunjucks = {
    tags: {
      variableStart: '<$',
      variableEnd: '$>'
    }
  }

  config.static = {
    prefix: '',
    dir: path.join(appInfo.baseDir, 'app/public')
  }

  config.cn = cn
  config.code = code

  config.multipart = {
    fileExtensions: ['.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov'] // 增加对 .apk 扩展名的支持
  }

  config.bcrypt = {
    saltRounds: 10 // default 10
  }

  config.cors = {
    origin: '',
    allowHeaders: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With', 'Admin-Token', 'X-token'],
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg_x',
    options: {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0
    }
  }

  config.mysql = {
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      charset: 'utf8mb4',
      // 密码
      password: '123456',
      // 数据库名
      database: 'train'
    }
  }

  config.jwt = {
    secret: '123456',
    enable: true, // default is false
    match: '/jwt' // optional
  }

  return config
}
