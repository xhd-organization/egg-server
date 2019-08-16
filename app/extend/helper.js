const moment = require('moment')
const crypto = require('crypto')
// 格式化时间
exports.formatTime = (time, type) => {
  if (type === 'day') {
    return moment(time).format('YYYYMMDD')
  } else {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }
}

// 根据openid获取token
exports.getToken = function(openid) {
  const { keys } = this.config
  const md5 = crypto.createHash('md5')
  const token = md5.update(`${openid}wx${keys}`).digest('hex')
  return token
}

// 解密token值
exports.decodeToken = function(token) {
  const decoded = this.ctx.app.jwt.decode(token, { complete: true })
  return decoded.payload.data.uid
}

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg
  }
  ctx.status = 200
}

/**
 * 获取当前点击的微信菜单名称
 * @date   2019-01-18
 * @author cnvp
 * @param  {array}
 * @param  {string}
 * @returns {string}
 */
exports.getMenuName = function(menuArr, EventKey) {
  var menuName = ''
  for (var key = 0; key < menuArr.length; key++) {
    if (menuArr[key].key === EventKey) {
      menuName = menuArr[key].name
    } else if (menuArr[key].sub_button && menuArr[key].sub_button.length > 0) {
      menuArr[key].sub_button.forEach(function(value, index) {
        if (value.type === 'click') {
          if (value.key === EventKey) {
            menuName = value.name
          }
        } else if (value.type === 'view') {
          if (value.url === EventKey) {
            menuName = value.name
          }
        }
      })
    } else if (menuArr[key].type === 'view' && EventKey === menuArr[key].url) {
      menuName = menuArr[key].name
    }
  }
  return menuName
}

/**
 * 格式化微信菜单
 * @date   2019-01-18
 * @author cnvp
 * @param  {array}
 * @returns {array}
 */
exports.formatWechatMenu = function(menuArr) {
  let arr = new Array(5)
  menuArr.forEach(function(value, index) {
    let menu_info = {
      "name": value.name,
      "sub_button": []
    }
    if (value.type === 'view') {
      Object.assign(menu_info, {
        "type": value.type,
        "url": value.url
      })
    }
    if (value.is_first === '0') {
      arr.push(menu_info)
    } else {
      arr[value.is_first - 1].sub_button.push(menu_info)
    }
  })
  return arr
}
