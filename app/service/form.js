const Service = require('egg').Service

class FormService extends Service {
  // 查找所有的
  async findAll(name, condition = null, returnArr = null, orders = null, limit = 20, offset = 0) {
    const info = await this.app.mysql.select(name, { where: condition, columns: returnArr, orders: orders, limit: limit, offset: offset })
    return info
  }

  // 查找信息
  async find(name, condition, returnArr) {
    const info = await this.app.mysql.get(name, condition, { columns: returnArr })
    return info
  }

  // 查找数量
  async count(name, condition = null) {
    const count = await this.app.mysql.count(name, condition)
    return count
  }

  // 创建信息
  async create(name, data) {
    const info = await this.app.mysql.insert(name, data)
    return info
  }

  // 更新信息
  async update(name, data, condition) {
    const isUpdate = await this.app.mysql.update(name, data, { where: condition })
    return isUpdate
  }

  // 删除信息
  async delete(name, condition) {
    const isDelete = await this.app.mysql.delete(name, condition)
    return isDelete
  }

  // 模糊搜索
  async search(name, key, value, columns) {
    const keywords = this.app.mysql.escape('%' + value + '%')
    const sql = this.app.mysql.format(`SELECT ?? FROM ${name} WHERE ${key} LIKE ${keywords}`, [columns])
    const info = await this.app.mysql.query(sql)
    return info
  }

  // 最近几个月的数据
  async findMonth(name, returnArr = '*', month_num, time_field) {
    const info = await this.app.mysql.query(`SELECT ${returnArr.toString()} FROM ${name} WHERE DATE_SUB(CURDATE(), INTERVAL ${month_num} MONTH) <= date(${time_field})`)
    return info
  }

  // 最近几个月的数量
  async countMonth(name, month_num, time_field) {
    const num = await this.app.mysql.query(`SELECT COUNT(*) AS count FROM ${name} WHERE DATE_SUB(CURDATE(), INTERVAL ${month_num} MONTH) <= date(${time_field})`)
    if (num[0]) {
      return num[0].count
    }
    return 0
  }

  async field(name) {
    const config = this.config
    const { database: db_name } = config.mysql.client
    const field = await this.app.mysql.query(`select COLUMN_NAME as name, DATA_TYPE as data_type, COLUMN_TYPE as lentype, COLUMN_COMMENT as comments, ORDINAL_POSITION as listorder from information_schema.COLUMNS where table_name = '${name}' and table_schema = '${db_name}';`)
    // const field = await this.app.mysql.query(`SELECT COLUMN_NAME AS name,if( COLUMN_COMMENT is null or COLUMN_COMMENT='', COLUMN_NAME, COLUMN_COMMENT) AS namecn FROM information_schema.COLUMNS WHERE TABLE_NAME='${name}'`)
    return field
  }

  // 连表查询
  async finds(param) {
    await this.app.mysql.query('SELECT a.nickName,a.avatarUrl,b.star_level,b.tel,b.pre_time, b.id, b.uid, b.longitude, b.latitude, b.status, b.result, b.create_time, b.update_time  FROM user_info  a, y_pre_info b WHERE a.id=b.uid AND b.result=? ORDER BY b.id DESC LIMIT ? , ?', [param.result, param.offset, parseInt(param.limit)])
  }
}

module.exports = FormService
